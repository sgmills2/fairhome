import type { ViewportBounds } from '../types/map';

export function isPointInBounds(
  lat: number,
  lng: number,
  bounds: [[number, number], [number, number]] | null
): boolean {
  if (!bounds) return true;
  const [[swLng, swLat], [neLng, neLat]] = bounds;
  return (
    lng >= swLng &&
    lng <= neLng &&
    lat >= swLat &&
    lat <= neLat
  );
}

export function calculateCenter(points: Array<[number, number]>): [number, number] {
  if (points.length === 0) {
    // Default to Chicago's center
    return [-87.6298, 41.8781];
  }

  const sum = points.reduce(
    (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
    [0, 0]
  );

  return [
    sum[0] / points.length,
    sum[1] / points.length
  ];
}

export function calculateBounds(points: Array<[number, number]>): ViewportBounds {
  if (points.length === 0) {
    // Default Chicago bounds
    return {
      sw: [-87.9, 41.6],
      ne: [-87.3, 42.0]
    };
  }

  const lngs = points.map(([lng]) => lng);
  const lats = points.map(([, lat]) => lat);

  return {
    sw: [Math.min(...lngs), Math.min(...lats)],
    ne: [Math.max(...lngs), Math.max(...lats)]
  };
} 