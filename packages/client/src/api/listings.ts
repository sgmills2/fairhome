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
  console.log('Raw location:', location);
  // Handle binary PostGIS format
  if (typeof location === 'string' && location.startsWith('0101000020')) {
    // Convert from binary to text format using a simpler approach
    const coords = decodePostGISPoint(location);
    if (coords) {
      console.log('Extracted:', coords);
      return coords;
    }
  }
  console.log('Using default location');
  return {
    latitude: 41.8781,
    longitude: -87.6298
  };
}

// Helper function to decode PostGIS binary format without using Buffer
function decodePostGISPoint(hex: string): { latitude: number; longitude: number } | null {
  try {
    // Convert hex to float64 using DataView
    function hexToFloat64(hexStr: string): number {
      const bytes = new Uint8Array(8);
      for (let i = 0; i < 16; i += 2) {
        bytes[i/2] = parseInt(hexStr.substr(i, 2), 16);
      }
      return new DataView(bytes.buffer).getFloat64(0, true);
    }

    // Skip SRID and point identifier (first 18 characters)
    const coordsHex = hex.slice(18);
    const lng = hexToFloat64(coordsHex.slice(0, 16));
    const lat = hexToFloat64(coordsHex.slice(16, 32));
    
    return { latitude: lat, longitude: lng };
  } catch (e) {
    console.error('Error decoding PostGIS point:', e);
    return null;
  }
} 