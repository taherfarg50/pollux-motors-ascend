import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ChatbotProvider } from '@/context/ChatbotContext';
import { ScrollProvider } from '@/context/ScrollContext';
import SimpleNavbar from '@/components/SimpleNavbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { log } from '@/utils/logger';
import { perf } from '@/utils/performance';

// Import components directly to fix dynamic import issues
import Home from '@/pages/Home';
import Cars from '@/pages/Cars';
import CarDetail from '@/pages/CarDetail';
import ExportServices from '@/pages/ExportServices';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import CarComparison from '@/pages/CarComparison';
import ChatPage from '@/pages/ChatPage';
import Blog from '@/pages/Blog';
import SmartFinancingPage from '@/pages/SmartFinancingPage';
import DatabaseAdmin from '@/pages/DatabaseAdmin';
import NotFound from '@/pages/NotFound';



function App() {
  // Initialize performance monitoring
  useEffect(() => {
    perf.startMeasure('app-init');
    log.info('Pollux Motors app initializing', undefined, 'App');
    
    return () => {
      perf.endMeasure('app-init');
      log.info('Pollux Motors app cleanup', undefined, 'App');
    };
  }, []);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    log.error('Application error caught by boundary', { error: error.message, stack: error.stack }, 'App');
    perf.trackInteraction('error', 'app-level', { message: error.message });
  };

  return (
    <ErrorBoundary
      onError={handleError}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <AuthProvider>
        <ChatbotProvider>
          <Router>
            <ScrollProvider>
              <div className="App min-h-screen bg-black text-white">
                <SimpleNavbar />
                
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/cars/:id" element={<CarDetail />} />
                    <Route path="/export" element={<ExportServices />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signin" element={<Auth />} />
                    <Route path="/signup" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/compare" element={<CarComparison />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/financing" element={<SmartFinancingPage />} />
                    <Route path="/admin/database" element={<DatabaseAdmin />} />
                    
                    {/* Fallback route for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                
                {/* Footer */}
                <Footer />
                
                {/* Scroll to top */}
                <ScrollToTop />
                
                {/* Performance Monitor (dev only) */}
                <PerformanceMonitor />
                
                <Toaster />
              </div>
            </ScrollProvider>
          </Router>
        </ChatbotProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
