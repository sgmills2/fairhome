import { Autocomplete } from '@mui/joy';
import { chicagoNeighborhoods, findNeighborhood, getNeighborhoodCenter } from '../data/chicago-neighborhoods';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  onNeighborhoodSelect: (neighborhood: string | null) => void;
  selectedNeighborhood: string | null;
}

interface SearchOption {
  label: string;
  neighborhood: string;
}

function SearchBar({ 
  onLocationSelect, 
  onNeighborhoodSelect,
  selectedNeighborhood 
}: SearchBarProps) {
  // Create search options from neighborhood data
  const searchOptions: SearchOption[] = chicagoNeighborhoods.features.map(feature => ({
    label: feature.properties.community,
    neighborhood: feature.properties.community
  }));

  // Debounced handler for search selection
  const handleSelect = useCallback(
    debounce((_: any, value: SearchOption | null) => {
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
      placeholder="Search by neighborhood"
      options={searchOptions}
      value={selectedOption}
      sx={{ width: 300 }}
      onChange={handleSelect}
      getOptionLabel={(option) => option.label}
    />
  );
}

export default SearchBar; 