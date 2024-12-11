const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');

const COMMUNITY_AREAS_URL = 'https://data.cityofchicago.org/resource/igwz-8jzy.geojson';
const ALDERMANIC_URL = 'https://data.cityofchicago.org/resource/7s9v-hp3s.geojson';

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

interface AldermanicInfo {
  ward: string;
  alderman: string;
}

async function fetchData() {
  console.log('Fetching Chicago neighborhood data...');
  
  try {
    // Fetch community areas
    console.log('Fetching community areas...');
    const communityResponse = await nodeFetch(COMMUNITY_AREAS_URL);
    const communityData = await communityResponse.json() as GeoJSONCollection;
    
    // Fetch aldermanic districts
    console.log('Fetching aldermanic districts...');
    const aldermanicResponse = await nodeFetch(ALDERMANIC_URL);
    const aldermanicData = await aldermanicResponse.json() as GeoJSONCollection;
    
    if (!communityData?.features || !Array.isArray(communityData.features)) {
      throw new Error('Invalid community areas data');
    }

    // Process and merge data
    console.log('Processing and merging data...');
    const processedFeatures = communityData.features.map(feature => {
      // Find overlapping aldermanic district
      const center = getFeatureCenter(feature);
      const aldermanicInfo = aldermanicData?.features ? 
        findContainingWard(center, aldermanicData.features) : null;
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          ward: aldermanicInfo?.ward || null,
          alderman: aldermanicInfo?.alderman || null
        }
      };
    });

    const outputData = {
      type: "FeatureCollection" as const,
      features: processedFeatures
    };

    // Validate GeoJSON
    console.log('Validating GeoJSON structure...');
    if (!validateGeoJSON(outputData)) {
      throw new Error('Invalid GeoJSON structure');
    }

    // Write to file
    console.log('Writing data to file...');
    const outputPath = path.join(__dirname, '../src/data/chicago-neighborhoods.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    
    console.log('Done! Updated chicago-neighborhoods.json');
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function getFeatureCenter(feature: GeoJSONFeature): [number, number] {
  const coords = feature.geometry.coordinates[0];
  const lats = coords.map((c: number[]) => c[1]);
  const lngs = coords.map((c: number[]) => c[0]);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2
  ];
}

function findContainingWard(point: [number, number], wards: GeoJSONFeature[]): AldermanicInfo | null {
  // Find ward that contains this point
  // This is a simplified check - in production we'd use proper point-in-polygon
  const ward = wards.find(wardFeature => {
    // Basic bounding box check
    const coords = wardFeature.geometry.coordinates[0];
    const lats = coords.map((c: number[]) => c[1]);
    const lngs = coords.map((c: number[]) => c[0]);
    const [lng, lat] = point;
    
    return (
      lng >= Math.min(...lngs) &&
      lng <= Math.max(...lngs) &&
      lat >= Math.min(...lats) &&
      lat <= Math.max(...lats)
    );
  });

  if (!ward) return null;

  return {
    ward: ward.properties.ward || '',
    alderman: ward.properties.alderman || ''
  };
}

function validateGeoJSON(data: any): boolean {
  // Basic GeoJSON validation
  if (data.type !== 'FeatureCollection') return false;
  if (!Array.isArray(data.features)) return false;
  
  return data.features.every((feature: any) => {
    return (
      feature.type === 'Feature' &&
      feature.properties &&
      feature.geometry &&
      feature.geometry.type === 'MultiPolygon' &&
      Array.isArray(feature.geometry.coordinates)
    );
  });
}

// Run the script
fetchData().catch(console.error); 