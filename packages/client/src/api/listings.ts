// API website: https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/s6ha-ppgi/about_data

import { supabase } from '../lib/supabase-client';
import type { Listing } from '@fairhome/shared/src/types';
import type { Database } from '../lib/database.types';

type DbListing = Database['public']['Tables']['listings']['Row'];

export async function fetchListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase.from('listings').select('*');
    
    if (error) {
      console.error('Supabase error:', error);
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
    latitude: 41.8781,
    longitude: -87.6298
  };
} 