import { supabase } from '../lib/supabase-client';
import type { Listing } from '@fairhome/shared/src/types';

interface ListingRow {
  id: string;
  developer_id: string | null;
  title: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  photos: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export async function fetchListings(): Promise<Listing[]> {
  try {
    // Use the get_listings_with_coordinates function which already returns lat/lng
    const { data, error } = await supabase
      .rpc('get_listings_with_coordinates')
      .throwOnError();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }

    console.log('Raw listings data:', data);

    return (data as ListingRow[]).map(item => ({
      id: item.id,
      developerId: item.developer_id || '',
      title: item.title,
      description: item.description || '',
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      price: Number(item.price),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      squareFeet: item.square_feet,
      photos: item.photos || [],
      amenities: item.amenities || [],
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
} 