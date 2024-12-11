import neighborhoodData from './chicago-neighborhoods.json';

export interface NeighborhoodProperties {
  area_numbe: string;
  community: string;
  shape_area: string;
  shape_len: string;
}

export interface NeighborhoodFeature {
  type: "Feature";
  properties: NeighborhoodProperties;
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

export interface ChicagoNeighborhoods {
  type: "FeatureCollection";
  features: NeighborhoodFeature[];
}

export const chicagoNeighborhoods = neighborhoodData as ChicagoNeighborhoods;

// Helper function to find a neighborhood by name
export function findNeighborhood(name: string) {
  return chicagoNeighborhoods.features.find(
    f => f.properties.community.toLowerCase() === name.toLowerCase()
  );
}

// Helper function to get neighborhood center
export function getNeighborhoodCenter(feature: NeighborhoodFeature): [number, number] {
  // For MultiPolygon, we'll use the first polygon's bounds
  const coords = feature.geometry.coordinates[0][0];
  const lats = coords.map(c => c[1]);
  const lngs = coords.map(c => c[0]);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2
  ];
}

// Helper function to get neighborhood bounds
export function getNeighborhoodBounds(feature: NeighborhoodFeature): [[number, number], [number, number]] {
  const coords = feature.geometry.coordinates[0][0];
  const lats = coords.map(c => c[1]);
  const lngs = coords.map(c => c[0]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)]
  ];
} 