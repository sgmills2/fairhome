import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export function useMapViewport() {
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [zoom, setZoom] = useState(11);

  // Calculate cluster radius based on zoom
  const clusterRadius = zoom >= 16 ? 30 : // Very close
                       zoom >= 14 ? 40 : // Close
                       zoom >= 12 ? 50 : // Medium
                       70;              // Far

  // Debounced viewport change handler
  const handleViewportChange = useCallback(
    debounce((bounds: [[number, number], [number, number]], newZoom: number) => {
      setMapBounds(bounds);
      setZoom(newZoom);
    }, 100),
    []
  );

  // Check if a location is within the current viewport
  const isInViewport = useCallback((latitude: number, longitude: number) => {
    if (!mapBounds) return true;
    const [[swLng, swLat], [neLng, neLat]] = mapBounds;
    return (
      longitude >= swLng &&
      longitude <= neLng &&
      latitude >= swLat &&
      latitude <= neLat
    );
  }, [mapBounds]);

  return {
    mapBounds,
    zoom,
    clusterRadius,
    handleViewportChange,
    isInViewport
  };
} 