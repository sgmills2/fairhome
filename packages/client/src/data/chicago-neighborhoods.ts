// Source: Chicago Data Portal - Boundaries - Community Areas (current)
export const chicagoNeighborhoods = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "area_num_1": "1",
        "community": "Rogers Park"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-87.6795, 42.0195], [-87.6795, 42.0095], [-87.6595, 42.0095], [-87.6595, 42.0195], [-87.6795, 42.0195]]]
      }
    },
    // Note: This is just a sample. We should add the complete GeoJSON data for all neighborhoods.
    // The coordinates shown are simplified for demonstration.
  ]
} as const;

export type Neighborhood = typeof chicagoNeighborhoods.features[number]['properties'];

// Helper function to find a neighborhood by name
export function findNeighborhood(name: string) {
  return chicagoNeighborhoods.features.find(
    f => f.properties.community.toLowerCase() === name.toLowerCase()
  );
} 