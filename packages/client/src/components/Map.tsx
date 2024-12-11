import { useEffect, useRef, useMemo } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { Box, Typography, Badge } from '@mui/joy';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@fairhome/shared/src/types';
import { config } from '../config';

interface MapViewProps {
  listings?: Listing[];
  selectedListing: Listing | null;
  onListingClick: (listing: Listing | null) => void;
}

interface ClusterProperties {
  cluster?: boolean;
  cluster_id?: number;
  point_count?: number;
}

function MapView({ listings = [], selectedListing, onListingClick }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  // Convert listings to GeoJSON for clustering
  const geojsonListings: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: listings.map((listing): Feature<Point> => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [listing.longitude, listing.latitude]
      },
      properties: {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        bedrooms: listing.bedrooms
      }
    }))
  }), [listings]);

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

  const handleClick = (event: any) => {
    const features = event.features;
    if (!features || features.length === 0) return;

    const feature = features[0];
    const properties = feature.properties as ClusterProperties;

    if (properties.cluster) {
      const clusterId = properties.cluster_id;
      const source = mapRef.current?.getSource('listings');

      // Need to cast source to any because the type definitions are incomplete
      (source as any)?.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;

        mapRef.current?.flyTo({
          center: feature.geometry.coordinates as [number, number],
          zoom,
          duration: 500
        });
      });
    } else {
      // Handle single listing click
      const listing = listings.find(l => l.id === feature.properties.id);
      if (listing) {
        onListingClick(listing);
      }
    }
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={config.MAPBOX_TOKEN}
      initialViewState={{
        latitude: 41.8781,  // Chicago's coordinates
        longitude: -87.6298,
        zoom: 11
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      interactiveLayerIds={['clusters', 'unclustered-point']}
      onClick={handleClick}
    >
      <Source
        id="listings"
        type="geojson"
        data={geojsonListings}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        {/* Clustered points */}
        <Layer
          id="clusters"
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',  // 0-9 points
              10,
              '#f1f075',  // 10-49 points
              50,
              '#f28cb1'   // 50+ points
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,         // 0-9 points
              10,
              30,        // 10-49 points
              50,
              40         // 50+ points
            ]
          }}
        />
        
        {/* Cluster count */}
        <Layer
          id="cluster-count"
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }}
          paint={{
            'text-color': '#ffffff'
          }}
        />

        {/* Individual points */}
        <Layer
          id="unclustered-point"
          type="circle"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'circle-color': [
              'case',
              ['==', ['get', 'id'], selectedListing?.id || ''],
              '#4CAF50',  // Selected color
              '#FF5A5F'   // Default color
            ],
            'circle-radius': [
              'case',
              ['==', ['get', 'id'], selectedListing?.id || ''],
              12,         // Selected size
              8          // Default size
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }}
        />
      </Source>

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