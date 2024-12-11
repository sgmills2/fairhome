import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import { useState, useMemo } from 'react';
import Map from '../components/Map';
import MapFilters from '../components/MapFilters';
import ListingsSidebar from '../components/ListingsSidebar';
import { fetchListings } from '../api/listings';
import type { Listing } from '@fairhome/shared/src/types';

function HomePage() {
  const { data: listings = [], isLoading } = useQuery('listings', fetchListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Filter states
  const maxPrice = useMemo(() => 
    Math.max(...listings.map(l => l.price), 5000), 
    [listings]
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);

  // Apply filters
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const matchesBedrooms = bedrooms ? listing.bedrooms >= bedrooms : true;
      return matchesPrice && matchesBedrooms;
    });
  }, [listings, priceRange, bedrooms]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <MapFilters
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        bedrooms={bedrooms}
        onBedroomsChange={setBedrooms}
        maxPrice={maxPrice}
      />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <ListingsSidebar 
          listings={filteredListings} 
          isLoading={isLoading}
          selectedListing={selectedListing}
          onListingClick={setSelectedListing}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Map 
            listings={filteredListings}
            selectedListing={selectedListing}
            onListingClick={setSelectedListing}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage; 