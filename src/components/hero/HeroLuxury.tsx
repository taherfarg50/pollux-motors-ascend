import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Award, 
  Users, 
  Calendar,
  ChevronDown,
  Sparkles,
  Eye,
  Brain,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LuxuryParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  cta: string;
  ctaLink: string;
  badge: string;
  color: string;
}

const HeroLuxury: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [particles, setParticles] = useState<LuxuryParticle[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [heroHeight, setHeroHeight] = useState('100vh');
  
  const { scrollY } = useScroll();
  const isInView = useInView(heroRef, { once: true });
  
  // Advanced parallax effects
  const yBackground = useTransform(scrollY, [0, 1000], [0, -300]);
  const yContent = useTransform(scrollY, [0, 800], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  
  // Hero slides data
  const heroSlides: HeroSlide[] = [
    {
      title: "POLLUX MOTORS",
      subtitle: "Redefining Automotive Excellence",
      description: "Experience the future of luxury automotive with AI-powered personalization, AR/VR showrooms, and unparalleled craftsmanship.",
      image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2940&auto=format&fit=crop",
      video: "/media/videos/luxury-hero-1.mp4",
      cta: "Explore Collection",
      ctaLink: "/cars",
      badge: "2024 Collection",
      color: "blue"
    },
    {
      title: "AI-POWERED",
      subtitle: "Intelligent Automotive Solutions",
      description: "Revolutionary machine learning algorithms create personalized experiences tailored to your unique preferences and lifestyle.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
      cta: "Discover AI Features",
      ctaLink: "/profile",
      badge: "AI Technology",
      color: "purple"
    },
    {
      title: "VIRTUAL REALITY",
      subtitle: "Immersive Car Experience",
      description: "Step into the future with our cutting-edge AR/VR technology. Experience vehicles like never before with photorealistic 3D environments.",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2940&auto=format&fit=crop",
      cta: "Try Virtual Showroom",
      ctaLink: "/interactive",
      badge: "AR/VR Ready",
      color: "green"
    }
  ];

  // Stats data with luxury icons
  const luxuryStats = [
    { value: "25+", label: "Years Excellence", icon: <Award className="w-6 h-6" /> },
    { value: "15K+", label: "Satisfied Clients", icon: <Users className="w-6 h-6" /> },
    { value: "100+", label: "Luxury Models", icon: <Zap className="w-6 h-6" /> },
    { value: "24/7", label: "Concierge Service", icon: <Calendar className="w-6 h-6" /> },
  ];

  // Enhanced particle system
  const generateParticles = useCallback(() => {
    const newParticles: LuxuryParticle[] = [];
    const colors = ['#d4af37', '#0066ff', '#3385ff', '#f4e99b'];
    
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setParticles(newParticles);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles and video
  useEffect(() => {
    generateParticles();
    
    // Dynamic hero height based on content
    const updateHeight = () => {
      setHeroHeight(`${window.innerHeight}px`);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [generateParticles]);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Video loading handler
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => setIsVideoLoaded(true);
      video.addEventListener('canplay', handleCanPlay);
      return () => video.removeEventListener('canplay', handleCanPlay);
    }
  }, [currentSlide]);

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#features-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden"
      style={{ height: heroHeight }}
    >
      {/* Advanced Background System */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: yBackground, scale }}
      >
        {/* Video Background */}
        <div className="absolute inset-0">
          {currentSlideData.video && (
            <video
              ref={videoRef}
              key={currentSlide}
              autoPlay
              muted
              loop
              playsInline
              className={cn(
                "w-full h-full object-cover transition-opacity duration-2000",
                isVideoLoaded ? "opacity-25" : "opacity-0"
              )}
              poster={currentSlideData.image}
            >
              <source src={currentSlideData.video} type="video/mp4" />
            </video>
          )}
          
          {/* Fallback Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${currentSlideData.image})`,
              opacity: isVideoLoaded ? 0 : 0.3
            }}
          />
        </div>

        {/* Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-500/10" />
      </motion.div>

      {/* Luxury Particle System */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              opacity: [0, 0.8, 0.8, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] z-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Hero Content */}
      <motion.div 
        className="relative z-20 h-full flex items-center justify-center"
        style={{ y: yContent, opacity }}
      >
        <div className="container mx-auto px-4 pt-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Main Content */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.3}px)`,
              }}
            >
              {/* Animated Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm font-medium text-yellow-500">
                  {currentSlideData.badge}
                </span>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>

              {/* Hero Title */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentSlide}
                    className="heading-hero text-gradient-luxury"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 1.1 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {currentSlideData.title}
                  </motion.h1>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`subtitle-${currentSlide}`}
                    className="heading-2 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {currentSlideData.subtitle}
                  </motion.h2>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${currentSlide}`}
                    className="text-body-hero max-w-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {currentSlideData.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 1.0 }}
              >
                <Button 
                  asChild 
                  size="xl"
                  className="btn-luxury group relative overflow-hidden"
                >
                  <Link to={currentSlideData.ctaLink}>
                    <span className="relative z-10 flex items-center gap-3">
                      {currentSlideData.cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="xl"
                  className="btn-premium group"
                >
                  <Link to="/interactive">
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Experience in VR
                  </Link>
                </Button>
              </motion.div>

              {/* Slide Indicators */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      index === currentSlide 
                        ? "bg-yellow-500 w-12 shadow-yellow-500/50 shadow-lg" 
                        : "bg-white/20 w-6 hover:bg-white/40"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Interactive Stats & Quick Actions */}
            <motion.div
              className="lg:col-span-5 space-y-8"
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.6 }}
              style={{
                transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.2}px)`,
              }}
            >
              {/* Luxury Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {luxuryStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="card-premium p-6 text-center group hover:scale-105 transition-all duration-500"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                  >
                    <div className="text-yellow-500 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="heading-4 text-white mb-1">{stat.value}</div>
                    <div className="text-caption text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Action Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <Link
                    to="/profile"
                    className="card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-500"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="heading-6 text-white mb-1">AI Personalization</h4>
                      <p className="text-body-sm text-gray-400">Tailored automotive experience</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <Link
                    to="/financing"
                    className="card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-500"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="heading-6 text-white mb-1">Smart Financing</h4>
                      <p className="text-body-sm text-gray-400">AI-powered loan calculations</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  <Link
                    to="/market"
                    className="card p-6 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-500"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 text-green-400 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="heading-6 text-white mb-1">Market Intelligence</h4>
                      <p className="text-body-sm text-gray-400">Real-time market insights</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors group z-30"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 2.0 }}
        aria-label="Scroll to next section"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-caption text-yellow-500">Discover More</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-yellow-500 transition-colors duration-300"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.button>

      {/* Luxury Floating Elements */}
      <div className="absolute top-1/4 right-12 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-md animate-float opacity-60" />
      <div className="absolute bottom-1/3 left-12 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-md animate-float opacity-60" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-md animate-float opacity-60" style={{ animationDelay: '3s' }} />
    </section>
  );
};

export default HeroLuxury;
