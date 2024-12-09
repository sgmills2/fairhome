import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Listing } from '@fairhome/shared/src/types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/joy';

interface MapViewProps {
  listings?: Listing[];
}

function MapView({ listings = [] }: MapViewProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  return (
    <Map
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
            setSelectedListing(listing);
          }}
        >
          <div className="marker" style={{
            backgroundColor: '#FF5A5F',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid white',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
        </Marker>
      ))}

      {selectedListing && (
        <Popup
          latitude={selectedListing.latitude}
          longitude={selectedListing.longitude}
          onClose={() => setSelectedListing(null)}
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