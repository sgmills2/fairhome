import { Box, Slider, Typography, Select, Option } from '@mui/joy';

interface MapFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  bedrooms: number | null;
  onBedroomsChange: (bedrooms: number | null) => void;
  bathrooms: number | null;
  onBathroomsChange: (bathrooms: number | null) => void;
  squareFootageRange: [number, number];
  onSquareFootageRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  maxSquareFootage: number;
}

function MapFilters({
  priceRange,
  onPriceRangeChange,
  bedrooms,
  onBedroomsChange,
  bathrooms,
  onBathroomsChange,
  squareFootageRange,
  onSquareFootageRangeChange,
  maxPrice,
  maxSquareFootage
}: MapFiltersProps) {
  const bedroomValue = bedrooms === null ? "" : bedrooms.toString();
  const bathroomValue = bathrooms === null ? "" : bathrooms.toString();
  
  const handleBedroomChange = (_: any, value: string | null) => {
    onBedroomsChange(value === "" || value === null ? null : parseInt(value, 10));
  };

  const handleBathroomChange = (_: any, value: string | null) => {
    onBathroomsChange(value === "" || value === null ? null : parseInt(value, 10));
  };

  return (
    <Box sx={{ 
      p: 2, 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      display: 'flex',
      gap: { md: 2, lg: 4 },
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }}>
      {/* Price Range Filter */}
      <Box sx={{ 
        flexGrow: 1, 
        minWidth: { md: '180px', lg: '200px' },
        maxWidth: '300px'
      }}>
        <Typography level="body-sm" mb={1}>
          Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, value) => onPriceRangeChange(value as [number, number])}
          min={0}
          max={maxPrice}
          step={100}
          valueLabelDisplay="auto"
          valueLabelFormat={value => `$${value.toLocaleString()}`}
          slotProps={{
            track: {
              style: { backgroundColor: '#74C2E1' }
            },
            thumb: {
              style: { backgroundColor: '#74C2E1' }
            },
            valueLabel: {
              style: { backgroundColor: '#74C2E1' }
            }
          }}
        />
      </Box>

      {/* Square Footage Range Filter */}
      <Box sx={{ 
        flexGrow: 1, 
        minWidth: { md: '180px', lg: '200px' },
        maxWidth: '300px'
      }}>
        <Typography level="body-sm" mb={1}>
          Square Footage: {squareFootageRange[0]} - {squareFootageRange[1]} sq ft
        </Typography>
        <Slider
          value={squareFootageRange}
          onChange={(_, value) => onSquareFootageRangeChange(value as [number, number])}
          min={0}
          max={maxSquareFootage}
          step={100}
          valueLabelDisplay="auto"
          valueLabelFormat={value => `${value} sq ft`}
          slotProps={{
            track: {
              style: { backgroundColor: '#74C2E1' }
            },
            thumb: {
              style: { backgroundColor: '#74C2E1' }
            },
            valueLabel: {
              style: { backgroundColor: '#74C2E1' }
            }
          }}
        />
      </Box>

      {/* Bedrooms Filter */}
      <Box sx={{ width: { md: '100px', lg: '120px' } }}>
        <Typography level="body-sm" mb={1}>
          Bedrooms
        </Typography>
        <Select
          placeholder="Any"
          value={bedroomValue}
          onChange={handleBedroomChange}
          sx={{ width: '100%' }}
        >
          <Option value="">Any</Option>
          <Option value="1">1+</Option>
          <Option value="2">2+</Option>
          <Option value="3">3+</Option>
          <Option value="4">4+</Option>
        </Select>
      </Box>

      {/* Bathrooms Filter */}
      <Box sx={{ width: { md: '100px', lg: '120px' } }}>
        <Typography level="body-sm" mb={1}>
          Bathrooms
        </Typography>
        <Select
          placeholder="Any"
          value={bathroomValue}
          onChange={handleBathroomChange}
          sx={{ width: '100%' }}
        >
          <Option value="">Any</Option>
          <Option value="1">1+</Option>
          <Option value="2">2+</Option>
          <Option value="3">3+</Option>
        </Select>
      </Box>
    </Box>
  );
}

export default MapFilters; 