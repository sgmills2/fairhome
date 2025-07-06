import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const HomePage = lazy(() => import('./pages/HomePage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));

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
        <Route path="/research" element={<ResearchPage />} />
      </RouterRoutes>
    </Suspense>
  );
}

export default Routes; 