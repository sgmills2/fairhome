import { useEffect, useMemo, useState, forwardRef } from 'react';
import Map, { Popup, Source, Layer, ViewStateChangeEvent } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { Box, Typography, Card } from '@mui/joy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { config } from '../../config';
import { chicagoNeighborhoods } from '../../data/chicago-neighborhoods';
import type { MapViewProps } from '../../types/map';
import { formatPrice, formatBedBath, formatArea, formatAddress } from '../../utils/formatting';

const MapView = forwardRef<MapRef, MapViewProps>(({ 
  listings = [], 
  selectedListing, 
  onListingClick,
  onViewportChange,
  selectedNeighborhood 
}, ref) => {
  const [zoom, setZoom] = useState(11);

  // Calculate cluster radius based on zoom
  const clusterRadius = useMemo(() => {
    if (zoom >= 16) return 30;      // Very close
    if (zoom >= 14) return 40;      // Close
    if (zoom >= 12) return 50;      // Medium
    return 70;                      // Far
  }, [zoom]);

  const handleMove = (evt: ViewStateChangeEvent) => {
    setZoom(evt.viewState.zoom);
    
    if (ref && 'current' in ref && ref.current && onViewportChange) {
      const bounds = ref.current.getBounds();
      if (!bounds) return;
      
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onViewportChange(
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
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      interactiveLayerIds={['clusters', 'unclustered-point']}
      onClick={handleClick}
      dragRotate={false}
      cursor="pointer"
      attributionControl={false}
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
        clusterMaxZoom={14}
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
              '#74C2E1',  // Chicago flag light blue
              10,
              '#74C2E1',  // Chicago flag light blue
              25,
              '#C3272B',  // Chicago flag red
              50,
              '#C3272B'   // Chicago flag red
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              10,
              25,
              25,
              30,
              50,
              35
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
            'circle-color': '#74C2E1',  // Chicago flag light blue
            'circle-radius': 12,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }}
        />
      </Source>

      {selectedListing && (
        <Popup
          longitude={selectedListing.longitude}
          latitude={selectedListing.latitude}
          anchor="bottom"
          onClose={() => onListingClick(null)}
          closeButton={false}
          className="mapboxgl-popup-no-shadow"
        >
          <Card
            variant="outlined"
            sx={{
              p: 1.5,
              boxShadow: 'md',
              minWidth: 200,
              bgcolor: 'background.surface',
              '--Card-radius': '8px'
            }}
          >
            <Typography level="title-lg" sx={{ color: '#74C2E1' }}>
              {formatPrice(selectedListing.price)}
            </Typography>
            <Typography level="body-sm">
              {formatBedBath(selectedListing.bedrooms, selectedListing.bathrooms)} • {formatArea(selectedListing.squareFeet)}
            </Typography>
            <Typography level="body-sm" color="neutral">
              {formatAddress(selectedListing.address)}
            </Typography>
          </Card>
        </Popup>
      )}
    </Map>
  );
});

export default MapView; 