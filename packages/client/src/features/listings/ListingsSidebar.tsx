import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useEffect, useRef, useState } from 'react';
import type { Listing } from '@fairhome/shared/src/types';
import { formatPrice, formatArea, formatBedBath, formatAddress } from '../../utils/formatting';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        position: 'relative',
        width: isCollapsed ? '0px' : '360px',
        minWidth: isCollapsed ? '0px' : '360px',
        height: '100%',
        borderRight: isCollapsed ? 'none' : '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        bgcolor: isCollapsed ? 'transparent' : 'background.surface',
        pointerEvents: 'all',
        zIndex: 1100
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          position: 'fixed',
          left: isCollapsed ? 16 : 340,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1200,
          bgcolor: 'background.surface',
          borderRadius: '50%',
          boxShadow: 'md',
          pointerEvents: 'all',
          '&:hover': {
            bgcolor: 'background.level1'
          }
        }}
      >
        {isCollapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
      </IconButton>

      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', whiteSpace: 'nowrap' }}>
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
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none'
      }}>
        {listings.map(listing => (
          <Card
            key={listing.id}
            ref={listing.id === selectedListing?.id ? selectedRef : null}
            onClick={() => onListingClick(listing)}
            variant={listing.id === selectedListing?.id ? "solid" : "soft"}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              opacity: 1,
              animation: 'fadeIn 0.3s ease-in',
              whiteSpace: 'nowrap',
              ...(listing.id === selectedListing?.id && {
                bgcolor: '#74C2E1',
                color: 'white'
              }),
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
              {formatPrice(listing.price)}
            </Typography>
            <Typography level="body-sm">
              {formatBedBath(listing.bedrooms, listing.bathrooms)} • {formatArea(listing.squareFeet)}
            </Typography>
            <Typography level="body-sm" color={listing.id === selectedListing?.id ? 'neutral' : 'neutral'}>
              {formatAddress(listing.address)}
            </Typography>
            {listing.description && (
              <Typography level="body-sm" noWrap color={listing.id === selectedListing?.id ? 'neutral' : 'neutral'}>
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