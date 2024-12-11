import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import { useState, useMemo, useRef } from 'react';
import { Map, MapFilters } from '../features/map';
import { SearchBar, AlderpersonSearch } from '../features/search';
import { ListingsSidebar } from '../features/listings';
import { fetchListings } from '../services/listings';
import type { Listing } from '@fairhome/shared/src/types';
import type { MapRef } from 'react-map-gl';
import { useMapViewport } from '../features/map/hooks/useMapViewport';
import { useSearch } from '../features/search/hooks/useSearch';

function HomePage() {
  const { data: listings = [], isLoading } = useQuery('listings', fetchListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const mapRef = useRef<MapRef>(null);
  
  const {
    mapBounds,
    zoom,
    clusterRadius,
    handleViewportChange,
    isInViewport
  } = useMapViewport();

  const {
    selectedNeighborhood,
    selectedAlderperson,
    handleNeighborhoodSelect,
    handleAlderpersonSelect
  } = useSearch();

  // Calculate max values for filters
  const { maxPrice, maxSquareFootage } = useMemo(() => ({
    maxPrice: Math.max(...listings.map(l => l.price), 5000),
    maxSquareFootage: Math.max(...listings.map(l => l.squareFeet), 1000)
  }), [listings]);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [squareFootageRange, setSquareFootageRange] = useState<[number, number]>([0, maxSquareFootage]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);

  // Memoized filter function
  const filterListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const matchesSquareFootage = listing.squareFeet >= squareFootageRange[0] && 
                                  listing.squareFeet <= squareFootageRange[1];
      const matchesBedrooms = bedrooms ? listing.bedrooms >= bedrooms : true;
      const matchesBathrooms = bathrooms ? listing.bathrooms >= bathrooms : true;
      const matchesViewport = isInViewport(listing.latitude, listing.longitude);

      return matchesPrice && matchesSquareFootage && matchesBedrooms && matchesBathrooms && matchesViewport;
    });
  }, [listings, priceRange, squareFootageRange, bedrooms, bathrooms, isInViewport]);

  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 14,
      duration: 2000
    });
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 108px)',
        overflow: 'hidden'
      }}
    >
      {/* Search and Filters Container */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          flexDirection: 'column'
        }}
      >
        {/* Search Bars Container */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
        <MapFilters
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          squareFootageRange={squareFootageRange}
          onSquareFootageRangeChange={setSquareFootageRange}
          bedrooms={bedrooms}
          onBedroomsChange={setBedrooms}
          bathrooms={bathrooms}
          onBathroomsChange={setBathrooms}
          maxPrice={maxPrice}
          maxSquareFootage={maxSquareFootage}
        />
      </Box>

      {/* Map and Sidebar Container */}
      <Box 
        sx={{ 
          display: 'flex', 
          flex: 1,
          minHeight: 0,
          position: 'relative'
        }}
      >
        <ListingsSidebar 
          listings={filterListings} 
          isLoading={isLoading}
          selectedListing={selectedListing}
          onListingClick={setSelectedListing}
        />
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Map 
            ref={mapRef}
            listings={filterListings}
            selectedListing={selectedListing}
            onListingClick={setSelectedListing}
            onViewportChange={handleViewportChange}
            selectedNeighborhood={selectedNeighborhood}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage; 