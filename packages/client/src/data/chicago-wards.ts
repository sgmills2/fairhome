import wardData from './chicago-wards.json';

export interface WardProperties {
  ward: string;
  alderperson: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
}

export interface WardFeature {
  type: "Feature";
  properties: WardProperties;
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

export interface ChicagoWards {
  type: "FeatureCollection";
  features: WardFeature[];
}

export const chicagoWards = wardData as ChicagoWards;

// Helper function to find a ward by number
export function findWard(wardNumber: string) {
  return chicagoWards.features.find(
    f => f.properties.ward === wardNumber
  );
}

// Helper function to get ward center
export function getWardCenter(feature: WardFeature): [number, number] {
  // For MultiPolygon, we'll use the first polygon's bounds
  const coords = feature.geometry.coordinates[0][0];
  const lats = coords.map(c => c[1]);
  const lngs = coords.map(c => c[0]);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2
  ];
}

// Helper function to get ward bounds
export function getWardBounds(feature: WardFeature): [[number, number], [number, number]] {
  const coords = feature.geometry.coordinates[0][0];
  const lats = coords.map(c => c[1]);
  const lngs = coords.map(c => c[0]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)]
  ];
} 