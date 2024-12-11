import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { useEffect, useRef } from 'react';
import { Listing } from '@fairhome/shared/src/types';

interface ListingsSidebarProps {
  listings?: Listing[];
  isLoading: boolean;
  selectedListing: Listing | null;
  onListingClick: (listing: Listing) => void;
}

function ListingsSidebar({ 
  listings = [], 
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
      <Box sx={{ 
        width: 360,
        height: '100%',
        display: 'flex', 
        justifyContent: 'center', 
        p: 2 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: 360, 
        height: '100%',
        borderRight: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography level="h4">
          {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'}
        </Typography>
      </Box>
      
      <Box sx={{ 
        overflowY: 'auto',
        flex: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        // Hide scrollbar for WebKit browsers
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        // Hide scrollbar for Firefox
        scrollbarWidth: 'none',
        // Hide scrollbar for IE/Edge
        '-ms-overflow-style': 'none'
      }}>
        {listings.map(listing => (
          <Card
            key={listing.id}
            ref={listing.id === selectedListing?.id ? selectedRef : null}
            onClick={() => onListingClick(listing)}
            variant={listing.id === selectedListing?.id ? "solid" : "soft"}
            color={listing.id === selectedListing?.id ? "primary" : undefined}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }
            }}
          >
            <Typography level="title-lg">
              ${listing.price.toLocaleString()}
            </Typography>
            <Typography level="body-sm">
              {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.squareFeet.toLocaleString()} sq ft
            </Typography>
            <Typography level="body-sm" color="neutral">
              {listing.address}
            </Typography>
            {listing.description && (
              <Typography level="body-sm" noWrap>
                {listing.description}
              </Typography>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default ListingsSidebar; 