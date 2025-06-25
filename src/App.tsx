import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ChatbotProvider } from '@/context/ChatbotContext';
import { ScrollProvider } from '@/context/ScrollContext';
import NavbarModern from '@/components/NavbarModern';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { log } from '@/utils/logger';
import { perf } from '@/utils/performance';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/Home'));
const Cars = lazy(() => import('@/pages/Cars'));
const CarDetail = lazy(() => import('@/pages/CarDetail'));
const ExportServices = lazy(() => import('@/pages/ExportServices'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Auth = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const CarComparison = lazy(() => import('@/pages/CarComparison'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const Blog = lazy(() => import('@/pages/Blog'));
const SmartFinancingPage = lazy(() => import('@/pages/SmartFinancingPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

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
                <NavbarModern />
                
                <main className="relative">
                  <Suspense fallback={<LoadingSpinner />}>
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
                      
                      {/* Fallback route for 404 */}
                      <Route path="*" element={
                        <div className="min-h-screen bg-black flex items-center justify-center">
                          <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                            <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                            <a href="/" className="btn-primary btn-lg">
                              Go Home
                            </a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </Suspense>
                </main>
                
                {/* Footer */}
                <Footer />
                
                {/* Scroll to top */}
                <ScrollToTop />
                
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
