import { supabase } from '../lib/supabase-client';

// Cache the data in memory
const geoDataCache: Record<string, any> = {};

export async function fetchGeoData(name: 'neighborhoods' | 'wards') {
  // Check cache first
  if (geoDataCache[name]) {
    return geoDataCache[name];
  }

  try {
    const { data, error } = await supabase
      .from('geo_data')
      .select('data')
      .eq('name', name)
      .single();

    if (error) throw error;

    // Cache the result
    geoDataCache[name] = data.data;
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${name} data:`, error);
    // Fallback to local data in development
    if (import.meta.env.DEV) {
      const localData = await import(`../data/chicago-${name}.json`);
      return localData.default;
    }
    throw error;
  }
} 