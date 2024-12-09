import { Listing } from '@fairhome/shared/src/types';

const CHICAGO_API = 'https://data.cityofchicago.org/resource/s6ha-ppgi.json';

interface ChicagoListing {
  property_name: string;
  address: string;
  phone_number: string;
  property_type: string;
  community_area: string;
  units: string;
  latitude: string;
  longitude: string;
}

export async function fetchListings(): Promise<Listing[]> {
  const response = await fetch(CHICAGO_API);
  const data: ChicagoListing[] = await response.json();
  
  return data.map(item => ({
    id: `${item.latitude}-${item.longitude}`,
    title: item.property_name,
    description: `${item.property_type} in ${item.community_area}`,
    address: item.address,
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    developerId: '',
    price: 0, // Not provided in API
    bedrooms: 0, // Not provided in API
    bathrooms: 0, // Not provided in API
    squareFeet: 0, // Not provided in API
    photos: [],
    amenities: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }));
} 