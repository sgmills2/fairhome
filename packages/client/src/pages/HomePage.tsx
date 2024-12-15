import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import { useState, useRef, Suspense } from 'react';
import { MapFilters } from '../features/map';
import { SearchBar, AlderpersonSearch } from '../features/search';
import { ListingsSidebar } from '../features/listings';
import { fetchListings } from '../services/listings';
import type { Listing } from '@fairhome/shared/src/types';
import type { MapRef } from 'react-map-gl';
import { useMapViewport } from '../features/map/hooks/useMapViewport';
import { useSearch } from '../features/search/hooks/useSearch';
import CircularProgress from '@mui/joy/CircularProgress';
import IconButton from '@mui/joy/IconButton';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MapView from '../features/map/Map';
import type { SearchLocation } from '../types/search';

function ComponentLoader() {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      width: '100%'
    }}>
      <CircularProgress />
    </Box>
  );
}

function HomePage() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const { handleViewportChange, isInViewport } = useMapViewport();
  const { selectedNeighborhood, selectedAlderperson, handleNeighborhoodSelect, handleAlderpersonSelect } = useSearch();

  const { data: listings = [], isLoading } = useQuery('listings', fetchListings);

  const visibleListings = listings.filter(listing => 
    isInViewport(listing.latitude, listing.longitude)
  );

  const handleLocationSelect = (location: SearchLocation) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 14,
        duration: 2000
      });
    }
  };

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [squareFootageRange, setSquareFootageRange] = useState<[number, number]>([0, 2000]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', // Subtract navbar height
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Map Layer (Bottom) */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        <MapView
          ref={mapRef}
          listings={listings}
          selectedListing={selectedListing}
          onListingClick={setSelectedListing}
          onViewportChange={handleViewportChange}
          selectedNeighborhood={selectedNeighborhood}
        />
      </Box>

      {/* UI Overlay Layer (Top) */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        height: '100%',
        pointerEvents: 'none'
      }}>
        {/* Search and Filters Bar (Desktop Only) */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'flex' },
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          minWidth: { md: '600px', lg: '800px' },
          maxWidth: '60vw',
          bgcolor: 'background.surface',
          borderRadius: '0 0 12px 12px',
          boxShadow: 'md',
          overflow: 'visible',
          pointerEvents: 'auto'
        }}>
          <Box sx={{ 
            position: 'relative',
            py: 2,
            px: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            transition: 'transform 0.3s ease-in-out',
            marginTop: isFiltersCollapsed ? '-120px' : 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
                <SearchBar 
                  onLocationSelect={handleLocationSelect}
                  onNeighborhoodSelect={(n) => handleNeighborhoodSelect(n, handleLocationSelect)}
                  selectedNeighborhood={selectedNeighborhood}
                />
                <AlderpersonSearch
                  onAlderpersonSelect={handleAlderpersonSelect}
                  selectedAlderperson={selectedAlderperson}
                />
              </Box>
            </Box>
            <Box sx={{ 
              maxHeight: isFiltersCollapsed ? '0px' : '500px',
              opacity: isFiltersCollapsed ? 0 : 1,
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden'
            }}>
              <Suspense fallback={<ComponentLoader />}>
                <MapFilters
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  squareFootageRange={squareFootageRange}
                  onSquareFootageRangeChange={setSquareFootageRange}
                  bedrooms={bedrooms}
                  onBedroomsChange={setBedrooms}
                  bathrooms={bathrooms}
                  onBathroomsChange={setBathrooms}
                  maxPrice={5000}
                  maxSquareFootage={2000}
                />
              </Suspense>
            </Box>
          </Box>
          {/* Toggle Button */}
          <IconButton
            onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            variant="soft"
            sx={{ 
              position: 'absolute',
              left: '50%',
              bottom: isFiltersCollapsed ? -20 : -40,
              transform: 'translateX(-50%)',
              zIndex: 1200,
              bgcolor: 'background.surface',
              borderRadius: '50%',
              boxShadow: 'md',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: 'background.level1'
              }
            }}
          >
            {isFiltersCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        </Box>

        {/* Desktop Layout */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' },
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 10
        }}>
          <ListingsSidebar
            listings={visibleListings}
            isLoading={isLoading}
            selectedListing={selectedListing}
            onListingClick={setSelectedListing}
          />
        </Box>

        {/* Mobile Layout */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          height: '100%'
        }}>
          {!showMap && (
            <Box sx={{ 
              width: '100%',
              height: '100%',
              bgcolor: 'background.surface',
              pointerEvents: 'auto'
            }}>
              <ListingsSidebar
                listings={visibleListings}
                isLoading={isLoading}
                selectedListing={selectedListing}
                onListingClick={setSelectedListing}
              />
            </Box>
          )}
        </Box>

        {/* Mobile View Toggle */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 2,
          bgcolor: 'background.surface',
          borderRadius: 'xl',
          boxShadow: 'md',
          pointerEvents: 'auto'
        }}>
          <IconButton
            onClick={() => setShowMap(!showMap)}
            variant="soft"
            sx={{ borderRadius: 'xl' }}
          >
            {showMap ? <ViewListRoundedIcon /> : <MapRoundedIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage; 