import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

console.log('Environment:', {
  VITE_MAPBOX_TOKEN: !!import.meta.env.VITE_MAPBOX_TOKEN,
  VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

function ErrorFallback({error}: {error: Error}) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong.</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {error.message}
      </pre>
    </div>
  );
}

class AppErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <React.Suspense fallback={<div>Loading...</div>}>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>,
) 