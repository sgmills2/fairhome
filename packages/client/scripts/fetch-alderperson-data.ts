import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chicago Data Portal API endpoints
const WARD_OFFICES_URL = 'https://data.cityofchicago.org/resource/htai-wnw4.json';
// Using the official City of Chicago ward boundaries (2023 redistricting)
const WARD_BOUNDARIES_URL = 'https://data.cityofchicago.org/api/geospatial/p293-wvbd?method=export&format=GeoJSON';

interface WardOffice {
  ward: string;
  alderman: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  ward_phone: string;
  website: string;
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface Alderperson {
  ward: string;
  name: string;
  address: string;
  phone: string;
  website: string;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

async function fetchAlderData() {
  console.log('Fetching Chicago alderperson data...');
  
  try {
    // Fetch ward offices data
    console.log('Fetching ward offices...');
    const officesResponse = await axios.get(WARD_OFFICES_URL);
    const officesData = officesResponse.data as WardOffice[];
    
    // Fetch ward boundaries from City data portal
    console.log('Fetching ward boundaries from City data portal...');
    const boundariesResponse = await axios.get(WARD_BOUNDARIES_URL);
    const boundariesData = boundariesResponse.data as GeoJSONCollection;

    if (!boundariesData?.features) {
      throw new Error('Invalid boundary data received');
    }

    // Process and merge data
    console.log('Processing and merging data...');
    const processedFeatures = boundariesData.features.map(feature => {
      // The ward number might be in different fields depending on the data source
      const wardNumber = (
        feature.properties.ward || 
        feature.properties.ward_num || 
        feature.properties.WARD || 
        ''
      ).toString();
      
      const officeData = officesData.find(office => office.ward === wardNumber);

      return {
        ...feature,
        properties: {
          ward: wardNumber,
          alderperson: officeData ? toTitleCase(officeData.alderman) : null,
          address: officeData?.address || null,
          phone: officeData?.ward_phone || null,
          website: officeData?.website || null
        }
      };
    });

    const outputData = {
      type: "FeatureCollection" as const,
      features: processedFeatures
    };

    // Write to file
    console.log('Writing data to file...');
    const outputPath = path.join(__dirname, '../src/data/chicago-wards.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    
    // Create alderperson list for search component
    const alderList = processedFeatures
      .filter(f => f.properties.alderperson)
      .map(f => ({
        ward: f.properties.ward,
        name: `${f.properties.ward}${getOrdinal(Number(f.properties.ward))} Ward - ${f.properties.alderperson}`,
        address: f.properties.address,
        phone: f.properties.phone,
        website: f.properties.website
      }))
      .sort((a, b) => Number(a.ward) - Number(b.ward));

    const alderListPath = path.join(__dirname, '../src/data/alderpersons.json');
    fs.writeFileSync(alderListPath, JSON.stringify(alderList, null, 2));
    
    console.log('Done! Updated chicago-wards.json and alderpersons.json');
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

async function fetchAlderpersonData(): Promise<void> {
  try {
    console.log('Fetching Chicago alderperson data...');
    // TODO: Fetch data from Chicago Data Portal API
    // For now, using static data
    const alderpersons: Alderperson[] = [
      {
        ward: "1",
        name: "Daniel La Spata",
        address: "2740 W North Ave",
        phone: "(773) 360-3325",
        website: "https://www.the1stward.com/"
      }
      // Add more alderpersons here
    ];

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/alderpersons.json');
    fs.writeFileSync(outputPath, JSON.stringify(alderpersons, null, 2));
    console.log('Successfully wrote alderperson data to file');
  } catch (error) {
    console.error('Error fetching alderperson data:', error);
    process.exit(1);
  }
}

// Run the script
fetchAlderData().catch(console.error);
fetchAlderpersonData(); 