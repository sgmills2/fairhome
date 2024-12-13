import { supabaseAdmin } from '../lib/supabase';

interface ChicagoProperty {
  property_name: string;
  property_type: string;
  management_company: string;
  address: string;
  longitude: string;
  latitude: string;
}

const CHICAGO_API = 'https://data.cityofchicago.org/resource/s6ha-ppgi.json';

export async function syncChicagoData() {
  try {
    const response = await fetch(CHICAGO_API);
    const data = await response.json() as ChicagoProperty[];

    console.log('Fetched Chicago data:', data.length, 'records');

    // Transform Chicago data
    const listings = data
      .filter(item => 
        // Filter out items without valid coordinates
        item.longitude && 
        item.latitude && 
        !isNaN(Number(item.longitude)) && 
        !isNaN(Number(item.latitude)) &&
        item.address && 
        item.property_name
      )
      .map((item: ChicagoProperty) => ({
        title: item.property_name || 'Unnamed Property',
        description: `${item.property_type || 'Property'} managed by ${item.management_company || 'Unknown'}`,
        address: item.address,
        // Use raw point text for PostGIS
        location: `POINT(${Number(item.longitude)} ${Number(item.latitude)})`,
        price: 1000, // Placeholder price
        bedrooms: 2,  // Placeholder bedrooms
        bathrooms: 1, // Placeholder bathrooms
        square_feet: 800, // Placeholder square feet
        photos: [],
        amenities: []
      }));

    console.log('Transformed listings:', listings.length);

    // Clear existing listings
    const { error: deleteError } = await supabaseAdmin
      .from('listings')
      .delete()
      .not('id', 'is', null);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw deleteError;
    }

    // Insert new listings in batches of 50
    const batchSize = 50;
    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize);
      const { error: insertError } = await supabaseAdmin
        .from('listings')
        .insert(batch)
        .select();

      if (insertError) {
        console.error('Insert error at batch', i, ':', insertError);
        throw insertError;
      }
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(listings.length / batchSize)}`);
    }
    
    console.log(`Successfully synced ${listings.length} listings`);
    return { success: true, count: listings.length };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, error };
  }
} 