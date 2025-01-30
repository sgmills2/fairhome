import { CssVarsProvider } from '@mui/joy/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Routes from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      onError: (error) => {
        console.error('Query error:', error);
      }
    }
  }
});

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