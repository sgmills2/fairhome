import { Autocomplete } from '@mui/joy';
import type { AlderpersonSearchProps, SearchOption } from '../../types/search';
import alderpersonData from '../../data/alderpersons.json';

const ALDERPERSONS: SearchOption[] = alderpersonData.map(alder => {
  // Extract just the name part after the ward prefix
  const name = alder.name.split(' - ')[1];
  return {
    label: `${alder.ward}${getOrdinal(Number(alder.ward))} Ward – ${name}`,
    value: alder.ward,
    details: {
      name: alder.name,
      ward: alder.ward,
      address: alder.address,
      phone: alder.phone,
      website: alder.website
    }
  };
});

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function AlderpersonSearch({ 
  onAlderpersonSelect,
  selectedAlderperson,
  onLocationSelect
}: AlderpersonSearchProps) {
  const selectedOption = selectedAlderperson
    ? ALDERPERSONS.find(opt => opt.value === selectedAlderperson)
    : null;

  return (
    <Autocomplete
      placeholder="Search by Ward and Alderperson"
      options={ALDERPERSONS}
      value={selectedOption}
      sx={{ 
        width: { md: '320px', lg: '360px' }
      }}
      onChange={(_, value) => onAlderpersonSelect(value ? value.value : null, onLocationSelect)}
      getOptionLabel={(option) => option.label}
    />
  );
}

export default AlderpersonSearch; 