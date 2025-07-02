import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Zap, 
  Award, 
  Users, 
  ArrowRight,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Sparkles,
  Eye,
  Brain,
  Smartphone,
  DollarSign,
  BarChart3,
  Heart,
  Globe,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Lazy load enhanced components
// TODO: These components need to be created or fixed
// const HeroLuxury = lazy(() => import('@/components/HeroLuxury'));
const BrandPartners = lazy(() => import('@/components/BrandPartners'));
const CustomerTestimonials = lazy(() => import('@/components/CustomerTestimonials'));
// const NewsletterCTA = lazy(() => import('@/components/NewsletterCTA'));
// const ContactSection = lazy(() => import('@/components/ContactSection'));
// const LiveStatistics = lazy(() => import('@/components/LiveStatistics'));
// const ARVRCarViewer = lazy(() => import('@/components/ARVRCarViewer'));
// const SmartFinancing = lazy(() => import('@/components/SmartFinancing'));

// TODO: These components need to be created
// const UserPersonalization = lazy(() => import('@/components/UserPersonalization'));
// const MarketIntelligence = lazy(() => import('@/components/MarketIntelligence'));

interface ModernFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  isNew?: boolean;
  isAI?: boolean;
}

interface TechShowcase {
  title: string;
  description: string;
  features: string[];
  image: string;
  badge: string;
  color: string;
}

const EnhancedIndexPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedShowcase, setSelectedShowcase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced modern features with AI capabilities
  const modernFeatures: ModernFeature[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Personalization",
      description: "Machine learning algorithms create tailored experiences based on your preferences and behavior patterns.",
      href: "/profile",
      color: "luxury-blue",
      isNew: true,
      isAI: true
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "AR/VR Car Experience",
      description: "Revolutionary augmented and virtual reality car viewing with WebXR technology and interactive hotspots.",
      href: "/interactive",
      color: "accent-emerald",
      isNew: true
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Smart Financing Hub",
      description: "AI-powered financing calculations with real-time approval simulations and virtual financial advisors.",
      href: "/financing",
      color: "luxury-gold",
      isNew: true,
      isAI: true
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Market Intelligence",
      description: "Real-time market insights, dynamic pricing optimization, and competitor analysis powered by big data.",
      href: "/market",
      color: "accent-sapphire",
      isNew: true,
      isAI: true
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Vehicle Health Monitor",
      description: "IoT-powered predictive maintenance with real-time diagnostics and intelligent health monitoring.",
      href: "/health",
      color: "accent-ruby",
      isNew: true
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Neural Search Engine",
      description: "Advanced semantic search with natural language processing and visual recognition capabilities.",
      href: "/search",
      color: "accent-amethyst",
      isNew: true,
      isAI: true
    }
  ];

  // Technology showcases
  const techShowcases: TechShowcase[] = [
    {
      title: "AI-Driven Personalization Engine",
      description: "Our machine learning algorithms analyze your browsing patterns, preferences, and interactions to create a uniquely tailored automotive experience.",
      features: ["Behavioral Analysis", "Preference Learning", "Predictive Recommendations", "Dynamic Content"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
      badge: "AI-Powered",
      color: "luxury-blue"
    },
    {
      title: "Next-Gen AR/VR Showroom",
      description: "Experience vehicles like never before with our cutting-edge augmented and virtual reality technology, featuring photorealistic 3D models and interactive hotspots.",
      features: ["WebXR Support", "Real-time Rendering", "Interactive Hotspots", "Mobile Optimized"],
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2940&auto=format&fit=crop",
      badge: "AR/VR Ready",
      color: "accent-emerald"
    },
    {
      title: "Intelligent Market Analytics",
      description: "Real-time market intelligence powered by big data analytics, providing insights into pricing trends, demand patterns, and competitive positioning.",
      features: ["Real-time Data", "Predictive Analytics", "Market Trends", "Competitive Intelligence"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
      badge: "Big Data",
      color: "luxury-gold"
    }
  ];

  const getFeatureColorClasses = (color: string) => {
    const colorMap = {
      "luxury-blue": "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30",
      "luxury-gold": "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-yellow-600/30",
      "accent-emerald": "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-green-600/30",
      "accent-sapphire": "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30",
      "accent-ruby": "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400 hover:from-red-500/30 hover:to-red-600/30",
      "accent-amethyst": "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400 hover:from-purple-500/30 hover:to-purple-600/30"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap["luxury-blue"];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury text-white overflow-x-hidden">
      {/* Enhanced Luxury Hero Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      }>
        {/* <HeroLuxury /> */}
      </Suspense>

      {/* User Personalization Section - Only show if user is logged in */}
      {user && (
        <section id="personalization-section" className="py-24 bg-gradient-to-b from-black/50 to-transparent relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Personalized for You
                </Badge>
                <h2 className="heading-2 mb-6">
                  Your Automotive
                  <span className="block text-gradient-luxury">Dashboard</span>
                </h2>
                <p className="text-body-lg max-w-3xl mx-auto">
                  AI-powered insights and recommendations tailored specifically to your automotive preferences and lifestyle.
                </p>
              </motion.div>

              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-purple-500"></div>
                </div>
              }>
                {/* <UserPersonalization /> */}
              </Suspense>
            </motion.div>
          </div>
        </section>
      )}

      {/* Modern Features Section */}
      <section id="features-section" className="py-32 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(212,175,55,0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(0,102,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Cpu className="w-4 h-4 mr-2" />
                Next-Generation Technology
              </Badge>
              <h2 className="heading-2 mb-8">
                Revolutionary Automotive
                <span className="block text-gradient-luxury">Experience</span>
              </h2>
              <p className="text-body-lg max-w-4xl mx-auto">
                Powered by artificial intelligence, augmented reality, and cutting-edge technology 
                to deliver the most advanced car buying experience in the world.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {modernFeatures.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Link 
                  to={feature.href}
                  className="group block h-full"
                >
                  <div className={cn(
                    "card p-8 h-full transition-all duration-700 hover:scale-105 hover:shadow-luxury-xl",
                    "bg-gradient-to-br border-2 relative overflow-hidden",
                    getFeatureColorClasses(feature.color)
                  )}>
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* New badge */}
                    {feature.isNew && (
                      <Badge className="absolute top-6 right-6 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        NEW
                      </Badge>
                    )}

                    {/* AI badge */}
                    {feature.isAI && (
                      <Badge className="absolute top-6 left-6 bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}

                    <div className="relative z-10">
                      <div className="mb-8">
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex items-center justify-center mb-6",
                          "bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10",
                          "transition-all duration-500 group-hover:scale-110"
                        )}>
                          {feature.icon}
                        </div>
                      </div>
                      
                      <h3 className="heading-5 mb-4 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-body-sm text-gray-400 mb-8 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-medium group-hover:translate-x-3 transition-transform duration-300">
                        Explore Feature
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Showcase Section */}
      <section className="py-32 bg-gradient-to-b from-transparent to-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Technology Showcase
              </Badge>
              <h2 className="heading-2 mb-8">
                Cutting-Edge
                <span className="block text-gradient-luxury">Innovation</span>
              </h2>
              <p className="text-body-lg max-w-4xl mx-auto">
                Discover how we're revolutionizing the automotive industry with breakthrough technologies.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-8"
            >
              {techShowcases.map((showcase, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={cn(
                    "p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500",
                    selectedShowcase === index 
                      ? "bg-white/10 border-blue-500/50 shadow-luxury-lg" 
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                  )}
                  onClick={() => setSelectedShowcase(index)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="heading-5 mb-3">{showcase.title}</h3>
                      <p className="text-body-sm text-gray-400">{showcase.description}</p>
                    </div>
                    <Badge className={`bg-${showcase.color === 'luxury-blue' ? 'blue' : showcase.color === 'accent-emerald' ? 'green' : 'yellow'}-500/20 text-${showcase.color === 'luxury-blue' ? 'blue' : showcase.color === 'accent-emerald' ? 'green' : 'yellow'}-400 px-3 py-1`}>
                      {showcase.badge}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {showcase.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 shadow-luxury-xl">
                <img
                  src={techShowcases[selectedShowcase].image}
                  alt={techShowcases[selectedShowcase].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30 px-3 py-1">
                    {techShowcases[selectedShowcase].badge}
                  </Badge>
                  <h4 className="heading-5 text-white">
                    {techShowcases[selectedShowcase].title}
                  </h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      }>
        {/* <LiveStatistics /> */}
      </Suspense>

      {/* AR/VR Car Viewer Demo Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                Interactive Experience
              </Badge>
              <h2 className="heading-2 mb-8">
                Virtual Showroom
                <span className="block text-gradient-luxury">Experience</span>
              </h2>
              <p className="text-body-lg max-w-3xl mx-auto mb-12">
                Step into the future of car shopping with our revolutionary AR/VR technology.
                Experience vehicles like never before with photorealistic detail.
              </p>
            </motion.div>
          </motion.div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
            </div>
          }>
            {/* <ARVRCarViewer 
              carModel="luxury-sedan"
              carName="Mercedes-Benz S-Class"
              carSpecs={{
                power: "429 HP",
                speed: "250 km/h",
                acceleration: "4.9 sec"
              }}
            /> */}
          </Suspense>
        </div>
      </section>

      {/* Featured Vehicles Section - Call to Action instead of duplicate */}
      <section className="py-32 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Car className="w-4 h-4 mr-2" />
                Premium Collection
              </Badge>
              <h2 className="heading-2 mb-8">
                Discover Our Featured Vehicles
              </h2>
              <p className="text-body-lg max-w-3xl mx-auto mb-12">
                Explore our handpicked selection of luxury vehicles, each enhanced with AI-powered insights and virtual experiences. Visit our main showcase to see the full collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-luxury">
                  <Link to="/">
                    View Featured Vehicles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/cars">
                    Browse All Vehicles
                    <Car className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Partners Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500"></div>
        </div>
      }>
        <BrandPartners />
      </Suspense>

      {/* Smart Financing Demo */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Smart Financing
              </Badge>
              <h2 className="heading-2 mb-8">
                AI-Powered
                <span className="block text-gradient-luxury">Financial Solutions</span>
              </h2>
              <p className="text-body-lg max-w-3xl mx-auto mb-12">
                Experience the future of automotive financing with our intelligent loan calculators and virtual financial advisors.
              </p>
            </motion.div>
          </motion.div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-500"></div>
            </div>
          }>
            {/* <SmartFinancing carPrice={285000} carName="Mercedes-Benz GLE 450" /> */}
          </Suspense>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section className="py-32 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                Market Intelligence
              </Badge>
              <h2 className="heading-2 mb-8">
                Real-Time Market
                <span className="block text-gradient-luxury">Analytics</span>
              </h2>
              <p className="text-body-lg max-w-3xl mx-auto mb-12">
                Stay ahead of the market with our advanced analytics platform providing real-time insights and predictive intelligence.
              </p>
            </motion.div>
          </motion.div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500"></div>
            </div>
          }>
            {/* <MarketIntelligence /> */}
          </Suspense>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500"></div>
        </div>
      }>
        <CustomerTestimonials />
      </Suspense>

      {/* Newsletter CTA Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      }>
        {/* <NewsletterCTA /> */}
      </Suspense>

      {/* Contact Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Get in Touch
              </Badge>
              <h2 className="heading-2 mb-8">
                Experience Luxury
                <span className="block text-gradient-luxury">Service</span>
              </h2>
              <p className="text-body-lg max-w-3xl mx-auto mb-12">
                Connect with our luxury automotive specialists for personalized assistance and exclusive access to our premium collection.
              </p>
            </motion.div>
          </motion.div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500"></div>
            </div>
          }>
            {/* <ContactSection /> */}
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default EnhancedIndexPage; 