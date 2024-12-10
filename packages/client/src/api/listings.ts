// API website: https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/s6ha-ppgi/about_data

import { supabase } from '../lib/supabase-client';
import type { Listing } from '@fairhome/shared/src/types';
import type { Database } from '../lib/database.types';

const CHICAGO_API = 'https://data.cityofchicago.org/resource/s6ha-ppgi.json';

type DbListing = Database['public']['Tables']['listings']['Row'];

async function syncChicagoData() {
  const response = await fetch(CHICAGO_API);
  const data = await response.json();

  // Transform Chicago data to match our schema
  const listings = data.map((item: any) => ({
    title: item.property_name,
    description: `${item.property_type} managed by ${item.management_company}`,
    address: item.address,
    location: `POINT(${item.longitude} ${item.latitude})`,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    photos: [],
    amenities: []
  }));

  // Upsert to Supabase
  const { error } = await supabase
    .from('listings')
    .upsert(listings, { 
      onConflict: 'address',  // Assuming address is unique
      ignoreDuplicates: true 
    });

  if (error) console.error('Error syncing data:', error);
}

export async function fetchListings(): Promise<Listing[]> {
  try {
    console.log('Starting data sync...');
    await syncChicagoData();
    console.log('Data sync complete');
    
    console.log('Fetching from Supabase...');
    const { data, error } = await supabase.from('listings').select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log('Supabase data:', data);
    
    if (!data || data.length === 0) {
      console.log('No listings found in Supabase');
      return [];
    }

    return (data as DbListing[]).map(item => ({
      id: item.id,
      developerId: item.developer_id || '',
      title: item.title,
      description: item.description || '',
      address: item.address,
      price: Number(item.price),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      squareFeet: item.square_feet,
      photos: item.photos,
      amenities: item.amenities,
      ...extractLatLng(item.location),
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

function extractLatLng(location: unknown) {
  if (typeof location === 'string') {
    const match = location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match) {
      const [_, lng, lat] = match;
      return {
        latitude: Number(lat),
        longitude: Number(lng)
      };
    }
  }
  return {
    latitude: 41.8781,  // Chicago default
    longitude: -87.6298
  };
} 