import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

function Navbar() {
  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
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
  );
}

export default Navbar; 