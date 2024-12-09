export interface Developer {
  id: string;
  name: string;
  state: string;
  contactInfo: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  developerId: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  photos: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChicagoHousingData {
  community_area: string;
  property_type: string;
  property_name: string;
  address: string;
  zip_code: string;
  phone_number: string;
  management_company: string;
  units: string;
  latitude: string;
  longitude: string;
} 