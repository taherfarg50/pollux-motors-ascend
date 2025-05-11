
import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      
      // Trigger fade-in animation for hero content after video starts
      videoRef.current.addEventListener('playing', () => {
        if (heroContentRef.current) {
          heroContentRef.current.classList.add('opacity-100');
          heroContentRef.current.classList.remove('opacity-0');
        }
      });
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
    <div className="relative h-screen overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 bg-black">
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
        {/* Overlay gradient */}
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black"></div>
      </div>

      {/* Hero content */}
      <div 
        ref={heroContentRef}
        className="relative h-full flex flex-col justify-center transition-opacity duration-1000 opacity-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start space-y-8">
          <h2 className="animate-on-scroll text-pollux-red font-medium text-sm md:text-base uppercase tracking-wider">
            Experience Luxury Redefined
          </h2>
          <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-8xl font-bold text-gradient max-w-4xl leading-tight">
            The New Era of Automotive Excellence
          </h1>
          <p className="animate-on-scroll text-gray-300 max-w-lg text-base md:text-lg mt-4">
            Discover a perfect blend of power, innovation, and design with Pollux Motors' 
            cutting-edge lineup of luxury vehicles engineered for the modern driver.
          </p>
          <div className="animate-on-scroll flex flex-wrap gap-4 mt-8">
            <Link
              to="/cars"
              className="px-6 py-3 bg-pollux-red hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors group"
            >
              Explore Models
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/models"
              className="px-6 py-3 bg-transparent hover:bg-white/10 backdrop-blur border border-white/20 text-white rounded-md font-medium transition-all"
            >
              View in 3D
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
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
