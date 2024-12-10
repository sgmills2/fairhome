import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import { useState } from 'react';
import Map from '../components/Map';
import ListingsSidebar from '../components/ListingsSidebar';
import { fetchListings } from '../api/listings';
import type { Listing } from '@fairhome/shared/src/types';

function HomePage() {
  const { data: listings, isLoading } = useQuery('listings', fetchListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <ListingsSidebar 
        listings={listings} 
        isLoading={isLoading}
        selectedListing={selectedListing}
        onListingClick={setSelectedListing}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Map 
          listings={listings}
          selectedListing={selectedListing}
          onListingClick={setSelectedListing}
        />
      </Box>
    </Box>
  );
}

export default HomePage; 