import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Gauge, Clock, Zap, Battery, ArrowUpRight, Star } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import TiltCard from '@/components/ui/TiltCard';
import OptimizedCarImage from '@/components/OptimizedCarImage';

interface CarSpecs {
  speed: string;
  acceleration: string;
  power: string;
  range: string;
  featured?: boolean;
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
  hideNameAndPrice?: boolean; // New prop to hide name and price overlay
  viewMode?: 'grid' | 'list'; // New prop for display mode
}

const CarCard = ({ id, name, category, year, price, image, specs, index = 0, hideNameAndPrice = false, viewMode = 'grid' }: CarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Create a radial gradient for the spotlight effect
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(320px circle at ${spotlightX}px ${spotlightY}px, rgba(var(--pollux-blue-rgb), 0.15), transparent 80%)`;
  
  // Handle mouse move for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
    
    spotlightX.set(mouseX.get());
    spotlightY.set(mouseY.get());
    spotlightOpacity.set(1);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    spotlightOpacity.set(0);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 * index
      }
    }
  };
  
  const imageVariants = {
    initial: { scale: 1, filter: "brightness(0.95)" },
    hover: { 
      scale: 1.05,
      filter: "brightness(1.05)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const specsContainerVariants = {
    initial: { opacity: 0, y: 10 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05
      }
    }
  };
  
  const specItemVariants = {
    initial: { opacity: 0, x: -5 },
    hover: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    hover: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10,
        delay: 0.1
      }
    }
  };
  
  const categoryVariants = {
    initial: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        delay: 0.2 + (0.1 * index)
      }
    }
  };
  
  const glowVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 0.6, 
      transition: { duration: 0.5 }
    }
  };
  
  const specItems = [
    { icon: <Gauge size={16} className="text-pollux-blue" />, label: "Top Speed", value: specs.speed },
    { icon: <Clock size={16} className="text-pollux-blue" />, label: "0-100 km/h", value: specs.acceleration },
    { icon: <Zap size={16} className="text-pollux-blue" />, label: "Power", value: specs.power },
    { icon: <Battery size={16} className="text-pollux-blue" />, label: "Range", value: specs.range }
  ];

  // If in list view mode, render a different layout
  if (viewMode === 'list') {
    return (
      <motion.div 
        className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-md border border-white/10"
        style={{
          boxShadow: isHovered 
            ? '0 10px 30px -10px rgba(25, 55, 227, 0.2), 0 0 15px rgba(25, 55, 227, 0.1)'
            : '0 4px 20px -4px rgba(0, 0, 0, 0.1)'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={cardVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight effect */}
        <motion.div 
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: spotlightBackground, opacity: spotlightOpacity }}
          aria-hidden="true"
        />
        
        {/* Glassmorphism overlay */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ 
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(10, 10, 10, 0.65)",
            borderRadius: "inherit"
          }}
        />
        
        {/* Glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-pollux-blue/10 to-pollux-blue-dark/15 z-0 opacity-0"
          variants={glowVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        />
        
        <div className="flex flex-col md:flex-row relative z-10">
          {/* Car image */}
          <div className="md:w-1/3 h-[250px] md:h-auto overflow-hidden relative">
            <motion.div
              className="w-full h-full"
              variants={imageVariants}
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
            >
              <OptimizedCarImage 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover"
                loading="eager"
                priority={index < 6}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          {/* Car info */}
          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            {!hideNameAndPrice && (
              <div>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold tracking-tight text-white group-hover:text-pollux-blue transition-colors">
                    {name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="ml-2 text-white border-white/20 bg-white/5 backdrop-blur-sm"
                  >
                    {year}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-4">
                <motion.p 
                    className="text-xl font-bold text-gradient-blue"
                    variants={categoryVariants}
                    initial="initial"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                  {price}
                </motion.p>
                  <Badge variant="secondary" className="bg-pollux-blue/10 text-pollux-blue border border-pollux-blue/20">
                    {category}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Specs section */}
            <div className="grid grid-cols-2 gap-4 my-4">
              {specItems.map((spec, i) => (
                <motion.div 
                  key={spec.label}
                  className="flex items-center space-x-2"
                  variants={specItemVariants}
                  initial="initial"
                  animate={isHovered ? "hover" : "initial"}
                  custom={i}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    {spec.icon}
                  </div>
                  <div>
                    <p className="text-xs text-white/70">{spec.label}</p>
                    <p className="text-sm font-medium text-white">{spec.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Button section */}
            <div className="flex justify-end mt-2">
              <Link to={`/cars/${id}`}>
                <motion.button
                  className="flex items-center space-x-1 text-sm text-white hover:text-pollux-blue px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                  variants={buttonVariants}
                  initial="initial"
                  animate={isHovered ? "hover" : "initial"}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Details</span>
                  <ArrowUpRight size={14} className="text-pollux-blue" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default grid view with TiltCard implementation
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={cardVariants}
    >
      <TiltCard
        className="overflow-hidden rounded-xl transition-all"
        glareEnabled={true}
        glareColor="rgba(25, 55, 227, 0.2)"
        tiltMaxAngleX={7}
        tiltMaxAngleY={7}
        scale={1.02}
        perspective={1200}
        glint={isHovered}
      >
        <div 
          className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
          style={{
            boxShadow: isHovered 
              ? '0 20px 40px -20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(25, 55, 227, 0.15)'
              : '0 10px 30px -15px rgba(0, 0, 0, 0.2)',
          }}
    >
      {/* Spotlight effect */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: spotlightBackground, opacity: spotlightOpacity }}
        aria-hidden="true"
      />
      
          {/* Featured indicator */}
      {specs.featured && (
            <div className="absolute top-3 left-3 z-20 flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-white">Featured</span>
            </div>
      )}
      
      {/* Car image */}
          <div className="relative h-[240px] overflow-hidden">
        <motion.div
          className="w-full h-full"
          variants={imageVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        >
          <OptimizedCarImage 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            loading="eager"
            priority={index < 6}
          />
        </motion.div>
            
            {/* Glassmorphic overlay for specs that appears on hover */}
            <AnimatePresence>
              {isHovered && (
          <motion.div
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-end p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
            >
          <motion.div 
            className="grid grid-cols-2 gap-3"
            variants={specsContainerVariants}
            initial="initial"
                    animate="hover"
          >
                    {specItems.map((spec, i) => (
              <motion.div 
                        key={spec.label}
                className="flex items-center space-x-2"
                variants={specItemVariants}
                        custom={i}
              >
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          {spec.icon}
                </div>
                <div>
                          <p className="text-xs text-white/70">{spec.label}</p>
                          <p className="text-xs font-medium text-white">{spec.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Car info with glassmorphism effect */}
          <div className="relative">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-t border-white/10"></div>
            
            {/* Content */}
            <div className="relative p-4 z-10">
              {!hideNameAndPrice && (
                <>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold tracking-tight text-white line-clamp-1 group-hover:text-pollux-blue transition-colors">
                      {name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className="ml-2 text-xs text-white/80 border-white/10 bg-white/5"
                    >
                      {year}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <motion.p 
                      className="text-sm font-bold text-gradient-blue"
                      variants={categoryVariants}
                      initial="initial"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {price}
                    </motion.p>
                    <Badge variant="secondary" className="text-xs bg-pollux-blue/10 text-pollux-blue border border-pollux-blue/20">
                      {category}
                    </Badge>
                  </div>
                </>
              )}
              
              <div className="mt-3 flex justify-between items-center">
                <Link 
                  to={`/cars/${id}`}
                  className="text-xs text-white/70 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} className="text-pollux-blue" />
                </Link>
                
                {/* Animated button that appears on hover */}
                <AnimatePresence>
                  {isHovered && (
          <motion.div 
            variants={buttonVariants}
            initial="initial"
                      animate="hover"
                      exit="initial"
          >
            <Link 
              to={`/cars/${id}`} 
                        className="bg-pollux-blue hover:bg-pollux-blue-dark text-white text-xs px-3 py-1.5 rounded-full transition-colors flex items-center space-x-1"
                      >
                        <span>Explore</span>
                        <ArrowUpRight size={14} />
            </Link>
          </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// Optimize with memo to prevent unnecessary re-renders
export default memo(CarCard);
