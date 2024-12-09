import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Listing } from '@fairhome/shared/src/types';
import 'mapbox-gl/dist/mapbox-gl.css';

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
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedListing(listing);
          }}
        />
      ))}

      {selectedListing && (
        <Popup
          latitude={selectedListing.latitude}
          longitude={selectedListing.longitude}
          onClose={() => setSelectedListing(null)}
          closeButton={true}
        >
          <div>
            <h3>{selectedListing.title}</h3>
            <p>{selectedListing.address}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default MapView; 