import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const HomePage = lazy(() => import('./pages/HomePage'));

function LoadingSpinner() {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <CircularProgress />
    </Box>
  );
}

function Routes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterRoutes>
        <Route path="/" element={<HomePage />} />
      </RouterRoutes>
    </Suspense>
  );
}

export default Routes; 