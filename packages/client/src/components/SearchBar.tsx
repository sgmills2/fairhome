import { Autocomplete } from '@mui/joy';
import type { Listing } from '@fairhome/shared/src/types';

interface SearchBarProps {
  listings: Listing[];
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

interface SearchOption {
  label: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
}

function SearchBar({ listings, onLocationSelect }: SearchBarProps) {
  // Extract unique neighborhoods from listings
  const searchOptions = listings.reduce<SearchOption[]>((acc, listing) => {
    const neighborhood = extractNeighborhood(listing.address);
    const existingOption = acc.find(opt => opt.neighborhood === neighborhood);
    
    if (!existingOption && neighborhood) {
      acc.push({
        label: `${neighborhood}, Chicago`,
        neighborhood,
        latitude: listing.latitude,
        longitude: listing.longitude
      });
    }
    return acc;
  }, []);

  const handleSelect = (_: any, value: SearchOption | null) => {
    if (value) {
      onLocationSelect({
        latitude: value.latitude,
        longitude: value.longitude
      });
    }
  };

  return (
    <Autocomplete
      placeholder="Search by neighborhood"
      options={searchOptions}
      sx={{ width: 300 }}
      onChange={handleSelect}
    />
  );
}

// Helper function to extract neighborhood from address
function extractNeighborhood(address: string): string {
  // This is a simple example - we might need a more sophisticated approach
  // Currently assumes format: "123 Street Name, Neighborhood, Chicago, IL"
  const parts = address.split(',');
  if (parts.length >= 3) {
    return parts[1].trim();
  }
  return '';
}

export default SearchBar; 