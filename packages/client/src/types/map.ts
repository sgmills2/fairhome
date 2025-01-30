export interface ViewportBounds {
  sw: [number, number];
  ne: [number, number];
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface MapViewProps {
  listings?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    price: number;
    bedrooms: number;
  }>;
  selectedListing: any | null;
  onListingClick: (listing: any | null) => void;
  onViewportChange?: (bounds: [[number, number], [number, number]], zoom: number) => void;
  selectedNeighborhood?: string | null;
  selectedWard?: string | null;
} 