import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface NeighborhoodFeature {
  type: 'Feature';
  properties: {
    area_numbe: string;
    community: string;
    shape_area: string;
    shape_len: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

interface NeighborhoodCollection {
  type: 'FeatureCollection';
  features: NeighborhoodFeature[];
}

// Sort neighborhoods alphabetically
async function sortNeighborhoods() {
  console.log('Sorting Chicago neighborhoods alphabetically...');
  
  try {
    // Read existing data
    const inputPath = path.join(__dirname, '../src/data/chicago-neighborhoods.json');
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as NeighborhoodCollection;

    // Sort features by community name
    data.features.sort((a, b) => 
      a.properties.community.localeCompare(b.properties.community)
    );

    // Write sorted data back
    fs.writeFileSync(inputPath, JSON.stringify(data, null, 2));
    console.log('Done! Neighborhoods sorted alphabetically');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
sortNeighborhoods(); 