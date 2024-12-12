import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import { useEffect, useRef, useState } from 'react';
import type { Listing } from '@fairhome/shared/src/types';
import { formatPrice, formatArea, formatBedBath, formatAddress } from '../../utils/formatting';
import { getNearestImage } from '../../services/mapillary';

interface ListingWithImage extends Listing {
  imageUrl?: string | null;
}

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
  const [listingsWithImages, setListingsWithImages] = useState<ListingWithImage[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const withImages = await Promise.all(
        listings.map(async (listing) => {
          const imageUrl = await getNearestImage(listing.latitude, listing.longitude);
          return { ...listing, imageUrl };
        })
      );
      setListingsWithImages(withImages);
    }
    fetchImages();
  }, [listings]);

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
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none'
      }}>
        {listingsWithImages.map(listing => (
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
            {listing.imageUrl && (
              <AspectRatio ratio="16/9" sx={{ mb: 1 }}>
                <img
                  src={listing.imageUrl}
                  alt={`Street view of ${listing.address}`}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  loading="lazy"
                />
              </AspectRatio>
            )}
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