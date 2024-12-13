import { supabase } from '../lib/supabase-client';
import type { Listing } from '@fairhome/shared/src/types';
import type { Database } from '../lib/database.types';

type DbListing = Database['public']['Tables']['listings']['Row'];

export async function fetchListings(): Promise<Listing[]> {
  try {
    // Use PostGIS ST_AsText to get readable coordinates
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

    return data.map(item => {
      try {
        return {
          id: item.id,
          developerId: item.developer_id || '',
          title: item.title,
          description: item.description || '',
          address: item.address,
          latitude: item.latitude || 41.8781,
          longitude: item.longitude || -87.6298,
          price: Number(item.price),
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          squareFeet: item.square_feet,
          photos: item.photos,
          amenities: item.amenities,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        };
      } catch (err) {
        console.error('Error processing listing:', item, err);
        return null;
      }
    }).filter(Boolean) as Listing[];
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
} 