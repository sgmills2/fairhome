import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { useEffect, useRef } from 'react';
import { Listing } from '@fairhome/shared/src/types';

interface ListingsSidebarProps {
  listings?: Listing[];
  isLoading: boolean;
  selectedListing: Listing | null;
  onListingClick: (listing: Listing) => void;
}

function ListingsSidebar({ 
  listings, 
  isLoading, 
  selectedListing,
  onListingClick 
}: ListingsSidebarProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedListing && selectedRef.current) {
      selectedRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedListing]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: 360, 
        borderRight: '1px solid', 
        borderColor: 'divider',
        overflowY: 'auto'
      }}
    >
      {listings?.map(listing => (
        <Box
          key={listing.id}
          ref={listing.id === selectedListing?.id ? selectedRef : null}
          onClick={() => onListingClick(listing)}
          sx={{
            p: 2,
            mb: 1,
            cursor: 'pointer',
            backgroundColor: listing.id === selectedListing?.id ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover'
            },
            transition: 'background-color 0.2s'
          }}
        >
          <Box sx={{ fontWeight: 'bold' }}>{listing.title}</Box>
          <Box sx={{ fontSize: 'sm', color: 'text.secondary' }}>{listing.address}</Box>
          <Box sx={{ fontSize: 'sm', mt: 1 }}>{listing.description}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default ListingsSidebar; 