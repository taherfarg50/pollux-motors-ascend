import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BrandLogosProps {
  className?: string;
}

const BrandLogos: React.FC<BrandLogosProps> = ({ className = '' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // List of luxury and popular car brands offered by Pollux Motors
  const allBrands = {
    luxury: [
      { name: 'Bentley', logo: '/media/images/brands/Bentley-Logo.wine.svg' },
      { name: 'Bugatti', logo: '/media/images/brands/Bugatti-Logo.wine.svg' },
      { name: 'Porsche', logo: '/media/images/brands/Porsche-Logo.wine.svg' },
      { name: 'Tesla', logo: '/media/images/brands/Tesla,_Inc.-Logo.wine.svg' },
      { name: 'Audi', logo: '/media/images/brands/Audi-Logo.wine.svg' },
      { name: 'Mercedes', logo: '/media/images/brands/Mercedes-Benz-Logo.wine.svg' },
      { name: 'BMW', logo: '/media/images/brands/BMW-Logo.wine.svg' },
      { name: 'Land Rover', logo: '/media/images/brands/Land_Rover-Logo.wine.svg' }
    ],
    popular: [
      { name: 'Toyota', logo: '/media/images/brands/Toyota_Canada_Inc.-Logo.wine.svg' },
      { name: 'Ford', logo: '/media/images/brands/Ford_India_Private_Limited-Logo.wine.svg' },
      { name: 'Volkswagen', logo: '/media/images/brands/Volkswagen_Group-Logo.wine.svg' },
      { name: 'Nissan', logo: '/media/images/brands/Nissan_Motor_India_Private_Limited-Logo.wine.svg' },
      { name: 'Hyundai', logo: '/media/images/brands/Hyundai_Motor_Group-Logo.wine.svg' },
      { name: 'KIA', logo: '/media/images/brands/Kia_Motors-Logo.wine.svg' },
      { name: 'Suzuki', logo: '/media/images/brands/Suzuki-Logo.wine.svg' }
    ]
  };
  
  // Fallback text-based display if images aren't available
  const textFallback = false; // Set to false if logo images are available
  
  // Auto-rotate through brand groups
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">We Offer Renowned Auto Marques</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The foremost autonomous suppliers of world's most sought-after, exclusive collection of premium luxury Cars and SUVs.
          </p>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentSlide === 0 ? 'bg-pollux-red text-white' : 'bg-white/5 hover:bg-white/10'}`}
              onClick={() => setCurrentSlide(0)}
            >
              Luxury Brands
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentSlide === 1 ? 'bg-pollux-red text-white' : 'bg-white/5 hover:bg-white/10'}`}
              onClick={() => setCurrentSlide(1)}
            >
              Popular Brands
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden relative">
          <div 
            className="transition-all duration-500 flex"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Luxury Brands */}
            <div className="min-w-full">
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key="luxury"
              >
                {allBrands.luxury.map((brand, index) => (
                  <motion.div 
                    key={brand.name} 
                    className="glass-card p-6 rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    variants={itemVariants}
                  >
                    {textFallback ? (
                      <p className="font-bold text-xl text-center">{brand.name}</p>
                    ) : (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-20 w-auto object-contain max-w-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackText = document.createElement('p');
                            fallbackText.className = 'font-bold text-xl text-center';
                            fallbackText.textContent = brand.name;
                            parent.appendChild(fallbackText);
                          }
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Popular Brands */}
            <div className="min-w-full">
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key="popular"
              >
                {allBrands.popular.map((brand, index) => (
                  <motion.div 
                    key={brand.name} 
                    className="glass-card p-6 rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    variants={itemVariants}
                  >
                    {textFallback ? (
                      <p className="font-bold text-xl text-center">{brand.name}</p>
                    ) : (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-20 w-auto object-contain max-w-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackText = document.createElement('p');
                            fallbackText.className = 'font-bold text-xl text-center';
                            fallbackText.textContent = brand.name;
                            parent.appendChild(fallbackText);
                          }
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentSlide(0)}
              className={`w-3 h-3 rounded-full ${currentSlide === 0 ? 'bg-pollux-red' : 'bg-gray-500'}`}
            />
            <button 
              onClick={() => setCurrentSlide(1)}
              className={`w-3 h-3 rounded-full ${currentSlide === 1 ? 'bg-pollux-red' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandLogos; 