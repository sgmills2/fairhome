import { Autocomplete } from '@mui/joy';
import type { Listing } from '@fairhome/shared/src/types';
import { chicagoNeighborhoods, findNeighborhood, getNeighborhoodCenter } from '../data/chicago-neighborhoods';

interface SearchBarProps {
  listings: Listing[];
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  onNeighborhoodSelect: (neighborhood: string | null) => void;
  selectedNeighborhood: string | null;
}

interface SearchOption {
  label: string;
  neighborhood: string;
}

function SearchBar({ 
  listings, 
  onLocationSelect, 
  onNeighborhoodSelect,
  selectedNeighborhood 
}: SearchBarProps) {
  // Create search options from neighborhood data
  const searchOptions = chicagoNeighborhoods.features.map(feature => ({
    label: feature.properties.community,
    neighborhood: feature.properties.community
  }));

  const handleSelect = (_: any, value: SearchOption | null) => {
    if (value) {
      const neighborhood = findNeighborhood(value.neighborhood);
      if (neighborhood) {
        const [centerLng, centerLat] = getNeighborhoodCenter(neighborhood);
        onLocationSelect({
          latitude: centerLat,
          longitude: centerLng
        });
        onNeighborhoodSelect(value.neighborhood);
      }
    } else {
      onNeighborhoodSelect(null);
    }
  };

  return (
    <Autocomplete
      placeholder="Search by neighborhood"
      options={searchOptions}
      value={searchOptions.find(opt => opt.neighborhood === selectedNeighborhood) || null}
      sx={{ width: 300 }}
      onChange={handleSelect}
    />
  );
}

export default SearchBar; 