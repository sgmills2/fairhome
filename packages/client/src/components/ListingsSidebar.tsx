import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { Listing } from '@fairhome/shared/src/types';

interface ListingsSidebarProps {
  listings?: Listing[];
  isLoading: boolean;
}

function ListingsSidebar({ listings, isLoading }: ListingsSidebarProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: 360, borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
      {listings?.map(listing => (
        <Box key={listing.id} sx={{ mb: 2 }}>
          {listing.title}
        </Box>
      ))}
    </Box>
  );
}

export default ListingsSidebar; 