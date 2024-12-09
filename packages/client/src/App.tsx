import { CssVarsProvider } from '@mui/joy/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}

export default App; 