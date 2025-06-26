import React, { Suspense, useState, useCallback } from 'react';
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
import FeaturedCars from '@/components/FeaturedCars';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import BrandPartners from '@/components/BrandPartners';
import Spline from '@splinetool/react-spline';

// Error Boundary for Spline component
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Spline Error:', error, errorInfo);
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

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.error('Spline loading error:', error);
    setSplineError(true);
  }, []);

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
    <div className="min-h-screen bg-background">
      {/* Hero Section with 3D Car */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Spline 3D Car Background or Fallback */}
        {splineError ? (
          <HeroFallback />
        ) : (
          <div className="absolute inset-0 z-0">
            <SplineErrorBoundary fallback={<HeroFallback />}>
              <Suspense 
                fallback={
                  <div className="w-full h-full bg-gradient-to-b from-pollux-blue/20 to-background flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pollux-blue"></div>
                  </div>
                }
              >
                <Spline
                  scene="https://prod.spline.design/S2dwW4Psu4b9wyXE/scene.splinecode"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                  }}
                  onLoad={handleSplineLoad}
                  onError={handleSplineError}
                />
              </Suspense>
            </SplineErrorBoundary>
            
            {/* Gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"></div>
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Pollux Motors
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your trusted partner for premium vehicles and international export services.
            Quality cars, global reach, professional service.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/cars">
              <Button size="lg" className="bg-pollux-blue hover:bg-pollux-blue-dark text-white shadow-2xl backdrop-blur-sm">
                Browse Vehicles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/export">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black shadow-2xl backdrop-blur-sm">
                Export Services
                <Ship className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronRight className="w-6 h-6 rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From local sales to international exports, we provide comprehensive automotive solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={service.link}>
                  <Card className="bg-gray-900 border-gray-700 h-full hover:border-pollux-blue/50 transition-all hover:scale-105 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-pollux-blue/20 rounded-full flex items-center justify-center text-pollux-blue mx-auto mb-4 group-hover:bg-pollux-blue/30 transition-colors">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-pollux-blue to-pollux-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Vehicles
            </h2>
            <p className="text-gray-400 text-lg">
              Discover our handpicked selection of premium vehicles
            </p>
          </div>
          <FeaturedCars />
          <div className="text-center mt-12">
            <Link to="/cars">
              <Button size="lg" variant="outline" className="group">
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
              <Button size="lg" className="bg-white text-pollux-blue hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Link to="/cars">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pollux-blue">
                Browse Inventory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 