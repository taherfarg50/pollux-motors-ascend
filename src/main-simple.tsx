import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
const SimpleApp = () => {
  return (
    <div style={{ 
      background: '#0A0A0A', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#1937E3', marginBottom: '20px' }}>✅ React is Working!</h1>
      <p>Simple React app loaded successfully on Netlify.</p>
      <button 
        onClick={() => window.location.href = '/'}
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
        Go to Full App
      </button>
    </div>
  );
};

// Hide loading screen and render simple app
console.log('[Simple Test] Starting simple React app...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<SimpleApp />);
  
  // Hide loading screen
  const hideFunction = (window as any).hideLoadingScreen;
  if (hideFunction && typeof hideFunction === 'function') {
    hideFunction();
  }
  
  console.log('[Simple Test] Simple React app loaded successfully!');
} catch (error) {
  console.error('[Simple Test] Failed to load simple React app:', error);
} 