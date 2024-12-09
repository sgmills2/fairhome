import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import Map from '../components/Map';
import ListingsSidebar from '../components/ListingsSidebar';
import { fetchListings } from '../api/listings.ts';

function HomePage() {
  const { data: listings, isLoading } = useQuery('listings', fetchListings);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <ListingsSidebar listings={listings} isLoading={isLoading} />
      <Box sx={{ flexGrow: 1 }}>
        <Map listings={listings} />
      </Box>
    </Box>
  );
}

export default HomePage; 