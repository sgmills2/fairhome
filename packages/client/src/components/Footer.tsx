import { Box, Typography, Link } from '@mui/joy';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.surface'
      }}
    >
      <Typography level="body-sm">
        FairHome
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Link href="/" level="body-sm">
          Home
        </Link>
        <Typography level="body-sm" textColor="neutral.500">
          © {currentYear} FairHome. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer; 