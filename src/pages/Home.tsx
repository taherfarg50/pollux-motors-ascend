import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Ship, 
  Shield, 
  Globe, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeaturedCars, ComponentLoadingSpinner, preloadCriticalComponents } from '@/components/LazyComponents';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import BrandPartners from '@/components/BrandPartners';
import SocialSidebar from '@/components/SocialSidebar';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import ParticleBackground from '@/components/ui/particle-background';



const Spline = React.lazy(() => import('@splinetool/react-spline'));

// Error Boundary for Spline component
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Spline Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const Home = () => {
  const [splineError, setSplineError] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineTimeout, setSplineTimeout] = useState(false);

  const handleSplineLoad = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Spline loaded successfully');
    }
    setSplineLoaded(true);
  }, []);

  const handleSplineError = useCallback((error: Error | unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Spline loading error:', error);
    }
    setSplineError(true);
  }, []);

  // Add timeout for Spline loading (8 seconds) and preload components
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Starting Spline timeout timer...');
    }
    const timer = setTimeout(() => {
      if (!splineLoaded && !splineError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⏰ Spline loading timeout - switching to fallback');
        }
        setSplineTimeout(true);
      }
    }, 8000);

    // Preload critical components after a short delay
    const preloadTimer = setTimeout(() => {
      preloadCriticalComponents();
    }, 2000);

    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 Cleaning up Spline timeout timer');
      }
      clearTimeout(timer);
      clearTimeout(preloadTimer);
    };
  }, [splineLoaded, splineError]);

  // Log current state for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Spline State:', { 
        loaded: splineLoaded, 
        error: splineError, 
        timeout: splineTimeout 
      });
    }
  }, [splineLoaded, splineError, splineTimeout]);

  // Fallback Hero Background Component
  const HeroFallback = () => (
    <div className="absolute inset-0 z-0">
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"></div>
    </div>
  );

  // Simple loading component
  const SplineLoading = () => (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg mb-2">Loading 3D Experience...</p>
        <p className="text-gray-400 text-sm">Preparing interactive car viewer</p>
      </div>
    </div>
  );

  const services = [
    {
      icon: <Car className="w-12 h-12" />,
      title: "Premium Vehicle Sales",
      description: "Quality pre-owned and new vehicles from trusted brands. Every car inspected and guaranteed.",
      link: "/cars"
    },
    {
      icon: <Ship className="w-12 h-12" />,
      title: "International Export",
      description: "Professional vehicle export services to Egypt, Algeria, and worldwide destinations.",
      link: "/export"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Quality Guarantee",
      description: "Comprehensive inspection, documentation, and warranty on all vehicles we sell.",
      link: "/about"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Global Reach",
      description: "Serving customers locally and internationally with professional service and support.",
      link: "/contact"
    }
  ];

  const stats = [
    { number: "5000+", label: "Vehicles Sold" },
    { number: "50+", label: "Countries Served" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Social Media Sidebar */}
      <SocialSidebar />
      {/* Hero Section with 3D Car */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground 
          variant="luxury" 
          particleCount={80} 
          speed={0.5} 
          interactive={true}
          className="z-0"
        />
        
        {/* 3D Background - Always try to load */}
        <div className="absolute inset-0 z-10">
          {!splineError && !splineTimeout ? (
            <SplineErrorBoundary fallback={<HeroFallback />}>
              <Suspense fallback={<SplineLoading />}>
                <div className="w-full h-full">
                  <Spline
                    scene="https://prod.spline.design/S2dwW4Psu4b9wyXE/scene.splinecode"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 0,
                    }}
                    onLoad={handleSplineLoad}
                    onError={handleSplineError}
                  />
                  {/* Debug info overlay (only in development) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white p-2 text-xs rounded z-50">
                      <div>Loaded: {splineLoaded ? '✅' : '❌'}</div>
                      <div>Error: {splineError ? '❌' : '✅'}</div>
                      <div>Timeout: {splineTimeout ? '❌' : '✅'}</div>
                    </div>
                  )}
                </div>
              </Suspense>
            </SplineErrorBoundary>
          ) : (
            <div>
              <HeroFallback />
              {/* Debug info for fallback reason */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-4 left-4 bg-red-900/80 text-white p-2 text-xs rounded z-50">
                  <div>Using Fallback</div>
                  <div>Reason: {splineError ? 'Error' : splineTimeout ? 'Timeout' : 'Unknown'}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Gradient overlays - always visible for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10"></div>
        </div>
        
        {/* Enhanced Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-medium">Premium Automotive Experience</span>
            <Star className="h-5 w-5 text-yellow-400" />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
              Pollux Motors
            </span>
          </motion.h1>
          
          <motion.div 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Luxury • Performance • Excellence
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto drop-shadow-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your trusted global partner for premium vehicles and international export services.
            <br className="hidden md:block" />
            <span className="text-blue-300">Quality guaranteed • Worldwide delivery • Professional service</span>
          </motion.p>

          {/* Enhanced Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cars">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl backdrop-blur-sm px-8 py-6 text-lg font-semibold relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Browse Premium Vehicles
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/export">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-black shadow-2xl backdrop-blur-sm px-8 py-6 text-lg font-semibold relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Global Export Services
                    <Ship className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { number: "5000+", label: "Vehicles Sold", icon: Car },
              { number: "50+", label: "Countries", icon: Globe },
              { number: "15+", label: "Years Experience", icon: Star },
              { number: "98%", label: "Satisfaction", icon: Shield }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard
                  key={index}
                  variant="minimal"
                  hoverable={true}
                  className="text-center p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </GlassCard>
              );
            })}
          </motion.div>
        </div>

        {/* Enhanced Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center cursor-pointer group"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-sm mb-3 group-hover:text-blue-300 transition-colors">Discover Our World</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center group-hover:border-blue-300 transition-colors">
              <motion.div 
                className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:bg-blue-300"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Photo Debug Test - Temporary */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Photo debugging removed for production */}
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 rounded-full border border-blue-500/20 mb-6">
              <Star className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Premium Services</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Our Services
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From premium vehicle sales to worldwide export services, we deliver excellence 
              in every aspect of automotive commerce
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Link to={service.link}>
                  <GlassCard 
                    variant="gradient" 
                    glow={true} 
                    hoverable={true}
                    className="h-full cursor-pointer group p-8 text-center"
                  >
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10"
                      whileHover={{ rotate: 5 }}
                    >
                      {service.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors relative z-10">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed relative z-10">
                      {service.description}
                    </p>
                    
                    {/* Arrow indicator */}
                    <motion.div 
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="h-5 w-5 text-blue-400" />
                    </motion.div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-700/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands Worldwide
            </h2>
            <p className="text-blue-100 text-lg">
              Our numbers speak for our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.4
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-white mb-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-blue-100 text-lg font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<ComponentLoadingSpinner />}>
            <FeaturedCars />
          </Suspense>
          <div className="text-center mt-12">
            <Link to="/cars">
              <Button size="lg" variant="outline" className="group border-pollux-blue/30 text-pollux-blue hover:bg-pollux-blue/10 hover:border-pollux-blue">
                View All Vehicles
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Export Highlight */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Global Vehicle Export Services
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Specializing in professional vehicle export to Egypt, Algeria, Morocco, Tunisia, 
                and destinations worldwide. We handle everything from documentation to delivery.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-pollux-blue rounded-full mr-3"></div>
                  Professional shipping and logistics
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-pollux-blue rounded-full mr-3"></div>
                  Complete documentation and customs handling
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-pollux-blue rounded-full mr-3"></div>
                  Pre-export inspection and preparation
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-pollux-blue rounded-full mr-3"></div>
                  Financing options for international buyers
                </li>
              </ul>
              <Link to="/export">
                <Button size="lg" className="bg-pollux-blue hover:bg-pollux-blue-dark">
                  Learn More About Export Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Vehicle export shipping"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-pollux-blue text-white p-6 rounded-lg shadow-xl">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Countries Served</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted Brands</h2>
            <p className="text-gray-400">We work with the world's leading automotive manufacturers</p>
          </div>
          <BrandPartners />
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 text-lg">
              Real experiences from satisfied customers worldwide
            </p>
          </div>
          <CustomerTestimonials />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-pollux-blue to-pollux-blue-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Contact us today for personalized service and expert guidance
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white text-lg">+971502667937</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-5 h-5 text-white" />
              <span className="text-white text-lg">info@polluxmotors.com</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <GradientButton size="lg" variant="luxury" glow={true}>
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <Link to="/cars">
              <GradientButton size="lg" variant="secondary">
                Browse Inventory
                <Car className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 