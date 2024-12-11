import { useEffect, useMemo, useState, forwardRef } from 'react';
import Map, { Popup, Source, Layer, ViewStateChangeEvent } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { Box, Typography } from '@mui/joy';
import debounce from 'lodash/debounce';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@fairhome/shared/src/types';
import { config } from '../config';
import { chicagoNeighborhoods } from '../data/chicago-neighborhoods';

interface MapViewProps {
  listings?: Listing[];
  selectedListing: Listing | null;
  onListingClick: (listing: Listing | null) => void;
  onViewportChange?: (bounds: [[number, number], [number, number]], zoom: number) => void;
  selectedNeighborhood?: string | null;
}

const MapView = forwardRef<MapRef, MapViewProps>(({ 
  listings = [], 
  selectedListing, 
  onListingClick,
  onViewportChange,
  selectedNeighborhood 
}, ref) => {
  // Track current zoom level
  const [zoom, setZoom] = useState(11);

  // Calculate cluster radius based on zoom
  const clusterRadius = useMemo(() => {
    if (zoom >= 16) return 30;      // Very close
    if (zoom >= 14) return 40;      // Close
    if (zoom >= 12) return 50;      // Medium
    return 70;                      // Far
  }, [zoom]);

  // Handle map movement with debounce
  const debouncedViewportChange = useMemo(
    () => debounce((bounds: [[number, number], [number, number]], zoom: number) => {
      onViewportChange?.(bounds, zoom);
    }, 100),
    [onViewportChange]
  );

  const handleMove = (evt: ViewStateChangeEvent) => {
    setZoom(evt.viewState.zoom);
    
    if (ref && 'current' in ref && ref.current && onViewportChange) {
      const bounds = ref.current.getBounds();
      if (!bounds) return;
      
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      debouncedViewportChange(
        [[sw.lng, sw.lat], [ne.lng, ne.lat]],
        evt.viewState.zoom
      );
    }
  };

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
    if (selectedListing && ref && 'current' in ref && ref.current) {
      ref.current.flyTo({
        center: [selectedListing.longitude, selectedListing.latitude],
        zoom: 15,
        duration: 2000,
        padding: { top: 50, bottom: 50, left: 50, right: 50 }
      });
    }
  }, [selectedListing, ref]);

  const handleClick = (event: any) => {
    const features = event.features;
    if (!features || features.length === 0) return;

    const feature = features[0];
    const properties = feature.properties;

    if (properties.cluster) {
      const clusterId = properties.cluster_id;
      const source = (ref as any)?.current?.getSource('listings');

      source?.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;

        (ref as any)?.current?.flyTo({
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
      ref={ref}
      mapboxAccessToken={config.MAPBOX_TOKEN}
      initialViewState={{
        latitude: 41.8781,  // Chicago's coordinates
        longitude: -87.6298,
        zoom: 11
      }}
      onMove={handleMove}
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      interactiveLayerIds={['clusters', 'unclustered-point']}
      onClick={handleClick}
    >
      <Source id="neighborhoods" type="geojson" data={chicagoNeighborhoods}>
        <Layer
          id="neighborhood-fills"
          type="fill"
          paint={{
            'fill-color': [
              'case',
              ['==', ['get', 'community'], selectedNeighborhood || ''],
              'rgba(195, 39, 43, 0.2)',  // Chicago flag red with transparency
              'rgba(0, 0, 0, 0)'  // transparent
            ],
            'fill-outline-color': [
              'case',
              ['==', ['get', 'community'], selectedNeighborhood || ''],
              '#C3272B',  // Chicago flag red
              'rgba(0, 0, 0, 0.1)'
            ]
          }}
        />
      </Source>

      <Source
        id="listings"
        type="geojson"
        data={geojsonListings}
        cluster={true}
        clusterMaxZoom={16}
        clusterRadius={clusterRadius}
      >
        <Layer
          id="clusters"
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#74C2E1',  // 0-9 points (Light Blue)
              10,
              '#74C2E1',  // 10-24 points (Light Blue)
              25,
              '#C3272B',  // 25-49 points (Red)
              50,
              '#C3272B'   // 50+ points (Red)
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

        <Layer
          id="unclustered-point"
          type="circle"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'circle-color': [
              'case',
              ['==', ['get', 'id'], selectedListing?.id || ''],
              '#C3272B',  // Selected color (Red)
              '#74C2E1'   // Default color (Light Blue)
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
});

MapView.displayName = 'MapView';

export default MapView; 