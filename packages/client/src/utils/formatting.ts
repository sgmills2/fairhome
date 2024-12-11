export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

export function formatArea(squareFeet: number): string {
  return `${squareFeet.toLocaleString()} sq ft`;
}

export function formatBedBath(bedrooms: number, bathrooms: number): string {
  return `${bedrooms} bed • ${bathrooms} bath`;
}

export function formatAddress(address: string): string {
  // Remove any extra spaces and standardize format
  return address
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(\d+)([A-Za-z]+)/, '$1 $2'); // Add space between number and street (e.g., "123Main" -> "123 Main")
}

export function formatNeighborhood(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
} 