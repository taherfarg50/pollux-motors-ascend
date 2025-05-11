
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/animation';

interface CarSpecs {
  speed: string;
  acceleration: string;
  power: string;
  range: string;
}

interface CarCardProps {
  id: number;
  name: string;
  category: string;
  year: string;
  price: string;
  image: string;
  specs: CarSpecs;
  index?: number; // For staggered animations
}

const CarCard = ({ id, name, category, year, price, image, specs, index = 0 }: CarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entry animation
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion) return;
    
    gsap.set(cardRef.current, { y: 50, opacity: 0 });
    
    const animation = gsap.to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      delay: 0.1 * index, // Stagger based on index
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom-=100',
        toggleActions: 'play none none none'
      }
    });
    
    return () => {
      animation.kill();
    };
  }, [index, prefersReducedMotion]);

  // Hover animations
  useEffect(() => {
    if (!cardRef.current || !imageRef.current || prefersReducedMotion) return;
    
    if (isHovered) {
      // Scale the image and add a subtle glow
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.7,
        ease: 'power2.out'
      });
      
      // Add a subtle glow to the card
      gsap.to(cardRef.current, {
        boxShadow: '0 5px 30px rgba(255, 30, 30, 0.15)',
        duration: 0.5
      });
      
      // Animate content
      if (contentRef.current) {
        gsap.to(contentRef.current.querySelector('.specs-container'), {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
        
        gsap.to(contentRef.current.querySelector('.action-button'), {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    } else {
      // Reset the image scale
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: 'power2.out'
      });
      
      // Reset the card glow
      gsap.to(cardRef.current, {
        boxShadow: 'none',
        duration: 0.5
      });
      
      // Reset content
      if (contentRef.current) {
        gsap.to(contentRef.current.querySelector('.specs-container'), {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.in'
        });
        
        gsap.to(contentRef.current.querySelector('.action-button'), {
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [isHovered, prefersReducedMotion]);

  return (
    <div 
      ref={cardRef}
      className="group relative bg-secondary rounded-lg overflow-hidden transition-all duration-500 h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card category tag */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 bg-pollux-red/80 backdrop-blur-sm rounded-full text-xs font-medium uppercase">
          {category}
        </span>
      </div>
      
      {/* Car image */}
      <div className="h-[250px] overflow-hidden">
        <img 
          ref={imageRef}
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          loading="lazy" // Add lazy loading for better performance
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Car info */}
      <div ref={contentRef} className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold mb-1">
          {name}
          <span className="text-sm ml-2 font-normal text-gray-400">{year}</span>
        </h3>
        <p className="text-xl font-medium text-pollux-red mb-4">{price}</p>
        
        <div 
          className="specs-container grid grid-cols-2 gap-3 transition-all duration-500 opacity-0 translate-y-10"
        >
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Top Speed</span>
            <span className="text-sm font-medium">{specs.speed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">0-100 km/h</span>
            <span className="text-sm font-medium">{specs.acceleration}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Power</span>
            <span className="text-sm font-medium">{specs.power}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Range</span>
            <span className="text-sm font-medium">{specs.range}</span>
          </div>
        </div>
        
        <Link 
          to={`/cars/${id}`}
          className="action-button absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-pollux-red transition-all duration-500 opacity-0 scale-50"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
