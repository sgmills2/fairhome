import { Routes as RouterRoutes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
    </RouterRoutes>
  );
}

export default Routes; 