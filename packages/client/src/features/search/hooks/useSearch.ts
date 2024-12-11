import { useState, useCallback } from 'react';
import { findNeighborhood, getNeighborhoodCenter } from '../../../data/chicago-neighborhoods';

interface SearchLocation {
  latitude: number;
  longitude: number;
}

export function useSearch() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedAlderperson, setSelectedAlderperson] = useState<string | null>(null);

  const handleNeighborhoodSelect = useCallback((neighborhood: string | null, onLocationSelect: (location: SearchLocation) => void) => {
    setSelectedNeighborhood(neighborhood);
    
    if (neighborhood) {
      const found = findNeighborhood(neighborhood);
      if (found) {
        const [centerLng, centerLat] = getNeighborhoodCenter(found);
        onLocationSelect({
          latitude: centerLat,
          longitude: centerLng
        });
      }
    }
  }, []);

  const handleAlderpersonSelect = useCallback((alderperson: string | null) => {
    setSelectedAlderperson(alderperson);
    // Future: Add ward boundary highlighting and centering
  }, []);

  return {
    selectedNeighborhood,
    selectedAlderperson,
    handleNeighborhoodSelect,
    handleAlderpersonSelect
  };
} 