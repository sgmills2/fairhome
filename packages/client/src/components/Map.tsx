import { useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { Box, Typography } from '@mui/joy';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@fairhome/shared/src/types';

interface MapViewProps {
  listings?: Listing[];
  selectedListing: Listing | null;
  onListingClick: (listing: Listing | null) => void;
}

function MapView({ listings = [], selectedListing, onListingClick }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (selectedListing && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedListing.longitude, selectedListing.latitude],
        zoom: 15,
        duration: 2000,
        padding: { top: 50, bottom: 50, left: 50, right: 50 }
      });
    }
  }, [selectedListing]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        latitude: 41.8781,  // Chicago's coordinates
        longitude: -87.6298,
        zoom: 11
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {listings.map(listing => (
        <Marker
          key={listing.id}
          latitude={listing.latitude}
          longitude={listing.longitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            onListingClick(listing);
          }}
        >
          <div className="marker" style={{
            backgroundColor: listing.id === selectedListing?.id ? '#4CAF50' : '#FF5A5F',
            width: listing.id === selectedListing?.id ? '32px' : '24px',
            height: listing.id === selectedListing?.id ? '32px' : '24px',
            borderRadius: '50%',
            border: '2px solid white',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease-in-out',
            transform: listing.id === selectedListing?.id ? 'scale(1.1)' : 'scale(1)'
          }} />
        </Marker>
      ))}

      {selectedListing && (
        <Popup
          latitude={selectedListing.latitude}
          longitude={selectedListing.longitude}
          onClose={() => onListingClick(null)}
          closeButton={true}
          closeOnClick={false}
          anchor="top"
        >
          <Box sx={{ p: 1 }}>
            <Typography level="h4">{selectedListing.title}</Typography>
            <Typography>{selectedListing.address}</Typography>
            <Typography>
              ${selectedListing.price.toLocaleString()} · {selectedListing.bedrooms} beds
            </Typography>
          </Box>
        </Popup>
      )}
    </Map>
  );
}

export default MapView; 