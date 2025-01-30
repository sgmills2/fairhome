import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;  // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadGeoData() {
  try {
    // Read the GeoJSON files
    const neighborhoodsPath = path.join(__dirname, '../src/data/chicago-neighborhoods.json');
    const wardsPath = path.join(__dirname, '../src/data/chicago-wards.json');

    console.log('Reading GeoJSON files...');
    const neighborhoods = JSON.parse(fs.readFileSync(neighborhoodsPath, 'utf8'));
    const wards = JSON.parse(fs.readFileSync(wardsPath, 'utf8'));

    console.log('Uploading neighborhoods data...');
    const { error: neighborhoodsError } = await supabase
      .from('geo_data')
      .upsert({
        id: 'neighborhoods',
        name: 'neighborhoods',
        data: neighborhoods
      }, {
        onConflict: 'id'
      });

    if (neighborhoodsError) {
      console.error('Error uploading neighborhoods:', neighborhoodsError);
      throw neighborhoodsError;
    }

    console.log('Uploading wards data...');
    const { error: wardsError } = await supabase
      .from('geo_data')
      .upsert({
        id: 'wards',
        name: 'wards',
        data: wards
      }, {
        onConflict: 'id'
      });

    if (wardsError) {
      console.error('Error uploading wards:', wardsError);
      throw wardsError;
    }

    console.log('Successfully uploaded all geo data!');
  } catch (error) {
    console.error('Error uploading geo data:', error);
    process.exit(1);
  }
}

uploadGeoData(); 