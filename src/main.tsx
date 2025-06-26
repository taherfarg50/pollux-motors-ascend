import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { log } from './utils/logger'
import { performanceMonitor } from './utils/performance'
import './index.css'
import './styles/animations.css'
import './styles/global.css'
import './styles/chat.css'
import './styles/responsive.css'

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime in v4)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Error boundary component interface
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error boundary component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    log.error("Application failed to render", { error: error.message, stack: error.stack, componentStack: info.componentStack }, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when app fails
      return (
        <div style={{ 
          background: '#0A0A0A', 
          color: 'white', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#1937E3', marginBottom: '20px' }}>Pollux Motors</h1>
          <p>We're experiencing a temporary issue. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#1937E3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
            {this.state.error && this.state.error.toString()}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Force a background color on the body to avoid black screen
document.body.style.backgroundColor = '#0A0A0A';
document.body.style.color = '#ffffff';

// Create root with error handling
const root = ReactDOM.createRoot(document.getElementById('root'));

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, reload the page
              window.location.reload();
            }
          });
        }
      });
      
      log.info('Service Worker registered successfully', { scope: registration.scope }, 'ServiceWorker');
    } catch (error) {
      log.error('Service Worker registration failed', { error: error.message }, 'ServiceWorker');
    }
  });
}

// Render with error boundary and QueryClient provider
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
