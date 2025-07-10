import React, { useEffect, Suspense, lazy } from 'react';
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

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

// Lazy load page components for better code splitting
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
const DatabaseAdmin = lazy(() => import('@/pages/DatabaseAdmin'));
const NotFound = lazy(() => import('@/pages/NotFound'));



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
              <div className="App dark min-h-screen bg-black text-white">
                <SimpleNavbar />
                
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
                      <Route path="/admin/database" element={<DatabaseAdmin />} />
                      
                      {/* Fallback route for 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
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
