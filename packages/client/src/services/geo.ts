import { supabase } from '../lib/supabase-client';

// Cache the data in memory
const geoDataCache: Record<string, any> = {};

export async function fetchGeoData(name: 'neighborhoods' | 'wards') {
  // Check cache first
  if (geoDataCache[name]) {
    console.log(`Returning cached ${name} data`);
    return geoDataCache[name];
  }

  try {
    console.log(`Fetching ${name} data from Supabase...`);
    const { data, error } = await supabase
      .from('geo_data')
      .select('data')
      .eq('name', name)
      .single();

    if (error) {
      console.error(`Error fetching ${name} data from Supabase:`, error);
      throw error;
    }

    if (!data) {
      console.error(`No ${name} data found in Supabase`);
      throw new Error(`No ${name} data found`);
    }

    console.log(`Successfully fetched ${name} data`);
    // Cache the result
    geoDataCache[name] = data.data;
    return data.data;
  } catch (error) {
    console.error(`Error in fetchGeoData(${name}):`, error);
    // Fallback to local data in development
    if (import.meta.env.DEV) {
      console.log(`Falling back to local ${name} data in development`);
      try {
        const localData = await import(`../data/chicago-${name}.json`);
        return localData.default;
      } catch (localError) {
        console.error(`Error loading local ${name} data:`, localError);
        throw localError;
      }
    }
    throw error;
  }
} 