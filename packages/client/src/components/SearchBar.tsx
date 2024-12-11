import { Autocomplete } from '@mui/joy';
import type { Listing } from '@fairhome/shared/src/types';
import { chicagoNeighborhoods, findNeighborhood, getNeighborhoodCenter } from '../data/chicago-neighborhoods';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  listings: Listing[];
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  onNeighborhoodSelect: (neighborhood: string | null) => void;
  selectedNeighborhood: string | null;
}

interface SearchOption {
  label: string;
  type: 'neighborhood' | 'listing';
  neighborhood?: string;
  listing?: Listing;
}

function SearchBar({ 
  listings,
  onLocationSelect, 
  onNeighborhoodSelect,
  selectedNeighborhood 
}: SearchBarProps) {
  // Create search options from both neighborhoods and listings
  const searchOptions: SearchOption[] = [
    ...chicagoNeighborhoods.features.map(feature => ({
      label: feature.properties.community,
      type: 'neighborhood' as const,
      neighborhood: feature.properties.community
    })),
    ...listings.map(listing => ({
      label: listing.title,
      type: 'listing' as const,
      listing
    }))
  ];

  // Debounced handler for search selection
  const handleSelect = useCallback(
    debounce((_: any, value: SearchOption | null) => {
      if (!value) {
        onNeighborhoodSelect(null);
        return;
      }

      if (value.type === 'neighborhood' && value.neighborhood) {
        const neighborhood = findNeighborhood(value.neighborhood);
        if (neighborhood) {
          const [centerLng, centerLat] = getNeighborhoodCenter(neighborhood);
          onLocationSelect({
            latitude: centerLat,
            longitude: centerLng
          });
          onNeighborhoodSelect(value.neighborhood);
        }
      } else if (value.type === 'listing' && value.listing) {
        onLocationSelect({
          latitude: value.listing.latitude,
          longitude: value.listing.longitude
        });
        onNeighborhoodSelect(null);
      }
    }, 100),
    [onLocationSelect, onNeighborhoodSelect]
  );

  const selectedOption = selectedNeighborhood
    ? searchOptions.find(opt => opt.type === 'neighborhood' && opt.neighborhood === selectedNeighborhood)
    : null;

  return (
    <Autocomplete
      placeholder="Search by neighborhood or listing"
      options={searchOptions}
      value={selectedOption}
      sx={{ width: 300 }}
      onChange={handleSelect}
      getOptionLabel={(option) => option.label}
    />
  );
}

export default SearchBar; 