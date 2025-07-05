import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple error logging
const simpleLog = (message: string, error?: any) => {
  console.log(`[Pollux Motors] ${message}`, error || '');
};

// Try to load dependencies gradually with error catching
const loadAppGradually = async () => {
  try {
    simpleLog('Step 1: Loading basic React...');
    
    // Test basic React first
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    const root = ReactDOM.createRoot(rootElement);
    
    simpleLog('Step 2: Loading React Query...');
    const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
    
    simpleLog('Step 3: Loading CSS...');
    await import('./index.css');
    await import('./styles/animations.css');
    await import('./styles/global.css');
    await import('./styles/chat.css');
    await import('./styles/responsive.css');
    
    simpleLog('Step 4: Loading App component...');
    const { default: App } = await import('./App.tsx');
    
    simpleLog('Step 5: Creating QueryClient...');
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });

    simpleLog('Step 6: Rendering app...');
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    );

    // Hide loading screen
    const hideFunction = (window as any).hideLoadingScreen;
    if (hideFunction && typeof hideFunction === 'function') {
      hideFunction();
    }
    
    simpleLog('✅ App loaded successfully!');
    
  } catch (error) {
    simpleLog('❌ App loading failed at step:', error);
    
    // Show a simple fallback app
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <div style={{ 
          background: '#0A0A0A', 
          color: 'white', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#1937E3', marginBottom: '20px' }}>Pollux Motors</h1>
          <p style={{ marginBottom: '20px' }}>Loading failed. Please try refreshing or check the console for details.</p>
          <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '20px' }}>
            Error: {error instanceof Error ? error.message : String(error)}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#1937E3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Refresh Page
          </button>
          <a 
            href="/test.html"
            style={{
              background: '#666',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Test Page
          </a>
        </div>
      );
      
      // Hide loading screen even on error
      const hideFunction = (window as any).hideLoadingScreen;
      if (hideFunction && typeof hideFunction === 'function') {
        hideFunction();
      }
    }
  }
};

// Force a background color on the body
document.body.style.backgroundColor = '#0A0A0A';
document.body.style.color = '#ffffff';

// Start loading
simpleLog('🚀 Starting Pollux Motors app...');
loadAppGradually();

// Global error handling
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Service worker registration with proper error handling
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration: ServiceWorkerRegistration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError: Error) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
