export interface SearchLocation {
  latitude: number;
  longitude: number;
}

export interface SearchBarProps {
  onLocationSelect: (location: SearchLocation) => void;
  onNeighborhoodSelect: (neighborhood: string | null) => void;
  selectedNeighborhood: string | null;
}

export interface AlderpersonSearchProps {
  onAlderpersonSelect: (alderperson: string | null) => void;
  selectedAlderperson: string | null;
}

export interface SearchOption {
  label: string;
  value: string;
} 