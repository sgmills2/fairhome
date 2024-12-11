import { Box, Slider, Typography, Select, Option } from '@mui/joy';

interface MapFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  bedrooms: number | null;
  onBedroomsChange: (bedrooms: number | null) => void;
  maxPrice: number;
}

function MapFilters({
  priceRange,
  onPriceRangeChange,
  bedrooms,
  onBedroomsChange,
  maxPrice
}: MapFiltersProps) {
  const bedroomValue = bedrooms === null ? "" : bedrooms.toString();
  
  const handleBedroomChange = (_: any, value: string | null) => {
    onBedroomsChange(value === "" || value === null ? null : parseInt(value, 10));
  };

  return (
    <Box sx={{ 
      p: 2, 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }}>
      <Box sx={{ flexGrow: 1 }}>
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
        />
      </Box>

      <Box sx={{ minWidth: 120 }}>
        <Select
          placeholder="Bedrooms"
          value={bedroomValue}
          onChange={handleBedroomChange}
          sx={{ minWidth: 120 }}
        >
          <Option value="">Any</Option>
          <Option value="1">1+</Option>
          <Option value="2">2+</Option>
          <Option value="3">3+</Option>
          <Option value="4">4+</Option>
        </Select>
      </Box>
    </Box>
  );
}

export default MapFilters; 