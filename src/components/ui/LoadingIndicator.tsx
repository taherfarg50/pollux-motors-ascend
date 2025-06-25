import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false,
  transparent = false
}) => {
  // Size mapping
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullScreen ? 'fixed inset-0 z-50' : 'p-4',
    transparent ? 'bg-transparent' : fullScreen ? 'bg-black/80 backdrop-blur-sm' : '',
    className
  );

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <Loader2 className={cn("text-pollux-blue", sizeMap[size])} />
        </motion.div>
        
        {text && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("text-gray-300 font-medium", textSizeMap[size])}
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingIndicator; 