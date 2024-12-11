import Box from '@mui/joy/Box';
import { useQuery } from 'react-query';
import { useState, useMemo, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Map from '../components/Map';
import MapFilters from '../components/MapFilters';
import SearchBar from '../components/SearchBar';
import ListingsSidebar from '../components/ListingsSidebar';
import { fetchListings } from '../api/listings';
import type { Listing } from '@fairhome/shared/src/types';
import type { MapRef } from 'react-map-gl';

function HomePage() {
  const { data: listings = [], isLoading } = useQuery('listings', fetchListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const mapRef = useRef<MapRef>(null);
  
  // Calculate max values for filters - memoized and only updates when listings change
  const { maxPrice, maxSquareFootage } = useMemo(() => ({
    maxPrice: Math.max(...listings.map(l => l.price), 5000),
    maxSquareFootage: Math.max(...listings.map(l => l.squareFeet), 1000)
  }), [listings]);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [squareFootageRange, setSquareFootageRange] = useState<[number, number]>([0, maxSquareFootage]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);

  // Debounced filter updates for sliders
  const debouncedSetPriceRange = useCallback(
    debounce((range: [number, number]) => setPriceRange(range), 100),
    []
  );

  const debouncedSetSquareFootageRange = useCallback(
    debounce((range: [number, number]) => setSquareFootageRange(range), 100),
    []
  );

  // Memoized filter function
  const filterListings = useCallback((listings: Listing[]) => {
    return listings.filter(listing => {
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const matchesSquareFootage = listing.squareFeet >= squareFootageRange[0] && 
                                  listing.squareFeet <= squareFootageRange[1];
      const matchesBedrooms = bedrooms ? listing.bedrooms >= bedrooms : true;
      const matchesBathrooms = bathrooms ? listing.bathrooms >= bathrooms : true;

      return matchesPrice && matchesSquareFootage && matchesBedrooms && matchesBathrooms;
    });
  }, [priceRange, squareFootageRange, bedrooms, bathrooms]);

  // Apply all filters with memoization
  const filteredListings = useMemo(() => 
    filterListings(listings),
    [listings, filterListings]
  );

  const handleLocationSelect = useCallback((location: { latitude: number; longitude: number }) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 14,
      duration: 2000
    });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        gap: 2,
        flexDirection: 'column'
      }}>
        <SearchBar 
          listings={listings}
          onLocationSelect={handleLocationSelect}
        />
        <MapFilters
          priceRange={priceRange}
          onPriceRangeChange={debouncedSetPriceRange}
          squareFootageRange={squareFootageRange}
          onSquareFootageRangeChange={debouncedSetSquareFootageRange}
          bedrooms={bedrooms}
          onBedroomsChange={setBedrooms}
          bathrooms={bathrooms}
          onBathroomsChange={setBathrooms}
          maxPrice={maxPrice}
          maxSquareFootage={maxSquareFootage}
        />
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <ListingsSidebar 
          listings={filteredListings} 
          isLoading={isLoading}
          selectedListing={selectedListing}
          onListingClick={setSelectedListing}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Map 
            ref={mapRef}
            listings={filteredListings}
            selectedListing={selectedListing}
            onListingClick={setSelectedListing}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage; 