import { CssVarsProvider } from '@mui/joy/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <Layout>
          <Routes />
        </Layout>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}

export default App; 