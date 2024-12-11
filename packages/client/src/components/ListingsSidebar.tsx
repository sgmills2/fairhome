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
          {listings.length} visible {listings.length === 1 ? 'listing' : 'listings'} in view
        </Typography>
        <Typography level="body-sm" color="neutral">
          Showing listings visible on the map
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
              transition: 'all 0.3s ease-in-out',
              opacity: 1,
              animation: 'fadeIn 0.3s ease-in',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              },
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(10px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
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