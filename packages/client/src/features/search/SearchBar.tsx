import { Autocomplete } from '@mui/joy';
import { chicagoNeighborhoods, findNeighborhood, getNeighborhoodCenter } from '../../data/chicago-neighborhoods';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import type { SearchBarProps } from '../../types/search';

function SearchBar({ 
  onLocationSelect, 
  onNeighborhoodSelect,
  selectedNeighborhood 
}: SearchBarProps) {
  // Create search options from neighborhood data
  const searchOptions = chicagoNeighborhoods.features.map(feature => ({
    label: feature.properties.community,
    neighborhood: feature.properties.community
  }));

  // Debounced handler for search selection
  const handleSelect = useCallback(
    debounce((_: any, value: { label: string; neighborhood: string } | null) => {
      if (!value) {
        onNeighborhoodSelect(null);
        return;
      }

      const neighborhood = findNeighborhood(value.neighborhood);
      if (neighborhood) {
        const [centerLng, centerLat] = getNeighborhoodCenter(neighborhood);
        onLocationSelect({
          latitude: centerLat,
          longitude: centerLng
        });
        onNeighborhoodSelect(value.neighborhood);
      }
    }, 100),
    [onLocationSelect, onNeighborhoodSelect]
  );

  const selectedOption = selectedNeighborhood
    ? searchOptions.find(opt => opt.neighborhood === selectedNeighborhood)
    : null;

  return (
    <Autocomplete
      placeholder="Search by Neighborhood"
      options={searchOptions}
      value={selectedOption}
      sx={{ 
        width: { md: '320px', lg: '360px' }
      }}
      onChange={handleSelect}
      getOptionLabel={(option) => option.label}
    />
  );
}

export default SearchBar; 