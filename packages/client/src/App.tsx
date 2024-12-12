import { CssVarsProvider } from '@mui/joy/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider>
        <HashRouter>
          <Layout>
            <Routes />
          </Layout>
        </HashRouter>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}

export default App; 