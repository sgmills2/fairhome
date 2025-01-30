export interface SearchLocation {
  latitude: number;
  longitude: number;
}

export interface SearchBarProps {
  onLocationSelect: (location: SearchLocation) => void;
  onNeighborhoodSelect: (neighborhood: string | null) => void;
  selectedNeighborhood: string | null;
}

export interface AlderpersonData {
  ward: string;
  name: string;
  address: string;
  phone: string;
  website: string;
}

export interface AlderpersonSearchProps {
  onAlderpersonSelect: (alderperson: string | null, onLocationSelect: (location: SearchLocation) => void) => void;
  selectedAlderperson: string | null;
  onLocationSelect: (location: SearchLocation) => void;
}

export interface AlderpersonDetails {
  name: string;
  ward: string;
  address: string;
  phone: string;
  website: string;
}

export interface SearchOption {
  label: string;
  value: string;
  details?: AlderpersonDetails;
} 