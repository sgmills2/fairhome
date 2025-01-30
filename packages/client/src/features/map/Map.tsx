import { useEffect, useMemo, useState, forwardRef } from 'react';
import Map, { Popup, Source, Layer, ViewStateChangeEvent, MapLayerMouseEvent } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { Typography, Card } from '@mui/joy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { config } from '../../config';
import { fetchGeoData } from '../../services/geo';
import type { MapViewProps } from '../../types/map';
import { formatPrice, formatBedBath, formatArea, formatAddress } from '../../utils/formatting';
import { useQuery } from 'react-query';
import { LoadingState } from '../../components/LoadingState';

const MapView = forwardRef<MapRef, MapViewProps>(({ 
  listings = [], 
  selectedListing, 
  onListingClick,
  onViewportChange,
  selectedNeighborhood,
  selectedWard
}, ref) => {
  const [zoom, setZoom] = useState(11);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch geo data
  const { data: neighborhoods, isLoading: loadingNeighborhoods, error: neighborhoodsError } = useQuery(
    'neighborhoods',
    () => fetchGeoData('neighborhoods'),
    {
      retry: 3,
      onError: (error) => {
        console.error('Error fetching neighborhoods:', error);
      }
    }
  );

  const { data: wards, isLoading: loadingWards, error: wardsError } = useQuery(
    'wards',
    () => fetchGeoData('wards'),
    {
      retry: 3,
      onError: (error) => {
        console.error('Error fetching wards:', error);
      }
    }
  );

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
  const geojsonListings: FeatureCollection<Point> = useMemo(() => {
    console.log('Converting listings to GeoJSON:', listings.length, 'listings');
    return {
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
          price: listing.price ? `$${listing.price.toLocaleString()}` : 'N/A',
          bedrooms: listing.bedrooms
        }
      }))
    };
  }, [listings]);

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

  const handleClick = (event: MapLayerMouseEvent) => {
    const features = event.features;
    if (!features || features.length === 0) return;

    const feature = features[0];
    const properties = feature.properties;

    if (properties?.cluster) {
      const clusterId = properties.cluster_id;
      const mapInstance = typeof ref === 'function' ? null : ref?.current;
      const source = mapInstance?.getSource('listings');

      if (source && 'getClusterExpansionZoom' in source) {
        source.getClusterExpansionZoom(clusterId, (error: Error | null | undefined, zoom: number | null | undefined) => {
          if (!zoom || error) return;

          mapInstance?.flyTo({
            center: (feature.geometry as Point).coordinates as [number, number],
            zoom: zoom ?? 11,
            duration: 500
          });
        });
      }
    } else if (properties) {
      const listing = listings.find(l => l.id === properties.id);
      if (listing) {
        onListingClick(listing);
      }
    }
  };

  const handleMouseEnter = (event: MapLayerMouseEvent) => {
    if (event.features?.length) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Show loading state while geo data loads
  if (loadingNeighborhoods || loadingWards) {
    return <LoadingState message="Loading map data..." />;
  }

  // Show error state if there's an error
  if (neighborhoodsError || wardsError) {
    const error = neighborhoodsError || wardsError;
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '1rem',
        color: 'red' 
      }}>
        <Typography>
          Error loading map data. Please try refreshing the page.
          {import.meta.env.DEV && error instanceof Error && (
            <pre style={{ fontSize: '0.8em' }}>
              {error.message}
            </pre>
          )}
        </Typography>
      </div>
    );
  }

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
      attributionControl={false}
      cursor={isHovering ? 'pointer' : isDragging ? 'grabbing' : 'grab'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Ward boundaries layer */}
      {wards && (
        <Source id="wards" type="geojson" data={wards}>
          <Layer
            id="ward-fills"
            type="fill"
            paint={{
              'fill-color': [
                'case',
                ['==', ['get', 'ward'], selectedWard || ''],
                'rgba(0, 159, 227, 0.2)',
                'rgba(0, 0, 0, 0)'
              ],
              'fill-outline-color': [
                'case',
                ['==', ['get', 'ward'], selectedWard || ''],
                '#009FE3',
                'rgba(0, 0, 0, 0.1)'
              ]
            }}
          />
        </Source>
      )}

      {/* Neighborhood boundaries layer */}
      {neighborhoods && (
        <Source id="neighborhoods" type="geojson" data={neighborhoods}>
          <Layer
            id="neighborhood-fills"
            type="fill"
            paint={{
              'fill-color': [
                'case',
                ['==', ['get', 'community'], selectedNeighborhood || ''],
                'rgba(195, 39, 43, 0.2)',
                'rgba(0, 0, 0, 0)'
              ],
              'fill-outline-color': [
                'case',
                ['==', ['get', 'community'], selectedNeighborhood || ''],
                '#C3272B',
                'rgba(0, 0, 0, 0.1)'
              ]
            }}
          />
        </Source>
      )}

      <Source
        id="listings"
        type="geojson"
        data={geojsonListings}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={clusterRadius}
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
              '#C3272B',  // Chicago flag red
              10,
              '#C3272B',  // Chicago flag red
              25,
              '#74C2E1',  // Chicago flag light blue
              50,
              '#74C2E1'   // Chicago flag light blue
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
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
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
            'circle-color': '#C3272B',
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }}
        />

        {/* Point labels */}
        <Layer
          id="unclustered-point-label"
          type="symbol"
          filter={['!', ['has', 'point_count']]}
          layout={{
            'text-field': ['get', 'price'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 11,
            'text-offset': [0, -1.5]
          }}
          paint={{
            'text-color': '#ffffff'
          }}
        />
      </Source>

      {selectedListing && (
        <Popup
          longitude={selectedListing.longitude}
          latitude={selectedListing.latitude}
          anchor="bottom"
          onClose={() => onListingClick(null)}
          closeButton={true}
          closeOnClick={false}
          offset={25}
        >
          <Card
            variant="outlined"
            sx={{
              p: 1.5,
              minWidth: 250,
              '--Card-radius': 'var(--joy-radius-lg)',
              boxShadow: 'md',
              bgcolor: 'background.popup',
              borderColor: 'neutral.outlinedBorder'
            }}
          >
            <Typography level="title-lg" sx={{ color: 'primary.500', mb: 0.5 }}>
              {formatPrice(selectedListing.price)}
            </Typography>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              {formatBedBath(selectedListing.bedrooms, selectedListing.bathrooms)}
              {selectedListing.squareFeet && ` · ${formatArea(selectedListing.squareFeet)}`}
            </Typography>
            <Typography level="body-sm" sx={{ color: 'neutral.600' }}>
              {formatAddress(selectedListing.address)}
            </Typography>
          </Card>
        </Popup>
      )}
    </Map>
  );
});

export default MapView; 