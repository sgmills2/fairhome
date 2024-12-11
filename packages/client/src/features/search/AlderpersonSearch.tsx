import { Autocomplete } from '@mui/joy';
import type { AlderpersonSearchProps, SearchOption } from '../../types/search';

// Placeholder data - to be replaced with real data later
const PLACEHOLDER_ALDERPERSONS: SearchOption[] = [
  "Pat Dowell - 3rd Ward",
  "Sophia King - 4th Ward",
  "Leslie Hairston - 5th Ward",
  "Roderick Sawyer - 6th Ward",
  "Gregory Mitchell - 7th Ward",
  "Michelle Harris - 8th Ward",
  "Anthony Beale - 9th Ward",
  "Susan Sadlowski Garza - 10th Ward"
].map(name => ({
  label: name,
  value: name
}));

function AlderpersonSearch({ 
  onAlderpersonSelect,
  selectedAlderperson 
}: AlderpersonSearchProps) {
  const selectedOption = selectedAlderperson
    ? PLACEHOLDER_ALDERPERSONS.find(opt => opt.value === selectedAlderperson)
    : null;

  return (
    <Autocomplete
      placeholder="Search by Alderperson"
      options={PLACEHOLDER_ALDERPERSONS}
      value={selectedOption}
      sx={{ width: 300 }}
      onChange={(_, value) => onAlderpersonSelect(value ? value.value : null)}
      getOptionLabel={(option) => option.label}
    />
  );
}

export default AlderpersonSearch; 