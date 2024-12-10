import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper type for table rows
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type DatabaseListing = Tables<'listings'>;

// Frontend-friendly listing type with lat/lng
export interface Listing extends Omit<DatabaseListing, 'location'> {
  latitude: number;
  longitude: number;
}

export type Developer = Tables<'developers'>;

// Helper to convert database listing to frontend listing
export function toFrontendListing(dbListing: DatabaseListing): Listing {
  // PostGIS location is stored as a string like 'POINT(longitude latitude)'
  const locationMatch = (dbListing.location as string).match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  const [_, longitude, latitude] = locationMatch || [null, 0, 0];

  return {
    ...dbListing,
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
} 