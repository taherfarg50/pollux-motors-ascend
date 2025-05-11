
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useHeroAnimation } from '@/lib/animation';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Setup hero animations
  useHeroAnimation({
    container: heroContentRef,
    title: titleRef,
    subtitle: subtitleRef,
    cta: ctaRef
  });
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      
      // Start animating content when video is playing
      videoRef.current.addEventListener('playing', () => {
        setIsLoaded(true);
      });
      
      // Fallback in case video doesn't load
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }

    // Add intersection observer to trigger animations when elements come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={heroContainerRef} className="relative h-screen overflow-hidden">
      {/* Video background with loading overlay */}
      <div className="absolute inset-0 bg-black">
        <div className={`absolute inset-0 z-10 bg-black transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
          {/* Loading animation */}
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-12 w-12 text-pollux-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover opacity-70"
          poster="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3"
        >
          <source 
            src="https://cdn.coverr.co/videos/coverr-car-driving-at-night-5060/1080p.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute h-full w-full">
            {Array.from({ length: 20 }).map((_, index) => (
              <div 
                key={index}
                className="absolute rounded-full bg-white/10 animate-pulse-slow"
                style={{
                  width: `${Math.random() * 5 + 2}px`,
                  height: `${Math.random() * 5 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div 
        ref={heroContentRef}
        className="relative h-full flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start space-y-8">
          <h2 
            ref={titleRef}
            className="text-pollux-red font-medium text-sm md:text-base uppercase tracking-wider"
          >
            Experience Luxury Redefined
          </h2>
          
          <h1 
            ref={subtitleRef}
            className="text-4xl md:text-6xl lg:text-8xl font-bold text-gradient max-w-4xl leading-tight"
          >
            The New Era of Automotive Excellence
          </h1>
          
          <p 
            className="text-gray-300 max-w-lg text-base md:text-lg"
          >
            Discover a perfect blend of power, innovation, and design with Pollux Motors' 
            cutting-edge lineup of luxury vehicles engineered for the modern driver.
          </p>
          
          <div 
            ref={ctaRef}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              to="/cars"
              className="px-6 py-3 bg-pollux-red hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors group hover-glow"
            >
              Explore Models
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/models"
              className="px-6 py-3 bg-transparent hover:bg-white/10 backdrop-blur border border-white/20 text-white rounded-md font-medium transition-all hover-scale"
            >
              View in 3D
            </Link>
          </div>
          
          {/* Floating features badges */}
          <div 
            className="absolute bottom-32 right-10 lg:right-20 max-w-xs hidden md:block"
          >
            <div className="glass-card p-4 rounded-lg animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m8 14-6 6h9v-3"></path>
                    <path d="M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Unmatched Performance</h4>
                  <p className="text-xs text-gray-400">0-100 km/h in 2.8s</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg mt-4 ml-10 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m14.31 8-5.24 6m5.24 0-5.24-6"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Cutting-edge Design</h4>
                  <p className="text-xs text-gray-400">Award-winning aesthetics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <div className="w-5 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
