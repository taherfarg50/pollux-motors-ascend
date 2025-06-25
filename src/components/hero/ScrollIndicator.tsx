import { motion } from 'framer-motion';
import { ChevronDown, MousePointerClick } from 'lucide-react';

interface ScrollIndicatorProps {
  onClick: () => void;
}

const ScrollIndicator = ({ onClick }: ScrollIndicatorProps) => {
  return (
    <motion.div
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div 
        className="relative glass-card-subtle rounded-full px-5 py-3 border border-white/10 hover:border-pollux-blue/30 transition-colors duration-300"
        animate={{ 
          y: [0, 5, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5, 
          ease: "easeInOut" 
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
            className="text-white"
          >
            <MousePointerClick size={16} />
          </motion.div>
          
          <motion.span
            className="text-white/80 text-sm font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Explore
          </motion.span>
          
          <motion.div
            animate={{
              y: [0, 3, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          >
            <ChevronDown size={16} className="text-pollux-blue" />
          </motion.div>
        </div>
        
        {/* Animated glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            boxShadow: ['0 0 0px rgba(25, 55, 227, 0)', '0 0 10px rgba(25, 55, 227, 0.5)', '0 0 0px rgba(25, 55, 227, 0)']
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Ripple effect on hover */}
      <motion.div 
        className="absolute w-16 h-16 rounded-full border border-pollux-blue/30 opacity-0 group-hover:opacity-100"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0, 0.2, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2, 
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
};

export default ScrollIndicator; 