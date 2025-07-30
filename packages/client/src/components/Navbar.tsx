import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';

function Navbar() {
  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography level="h4" component="h1">
          Fairhome
        </Typography>
        <Typography 
          level="body-sm" 
          sx={{ 
            ml: 2,
            color: 'neutral.500',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          This Website is in Alpha & Represents Mock Data of Affordable Housing in Chicago
        </Typography>
      </Box>
      
      <Button
        component={Link}
        to="/research"
        variant="soft"
        startDecorator={<AnalyticsIcon />}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        Cost-Impact
      </Button>
    </Box>
  );
}

export default Navbar; 