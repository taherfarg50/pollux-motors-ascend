import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  variant?: 'default' | 'fullscreen' | 'minimal';
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  variant = 'default',
  text = 'Loading...'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loader-luxury" />
      </div>
    );
  }

  const containerClasses = variant === 'fullscreen' 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background'
    : 'flex items-center justify-center min-h-[400px]';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Animated logo */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="mx-auto"
          >
            {/* Outer ring */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ 
                pathLength: 1,
                rotate: 360
              }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut", repeat: Infinity },
                rotate: { duration: 3, ease: "linear", repeat: Infinity }
              }}
            />
            
            {/* Inner ring */}
            <motion.circle
              cx="60"
              cy="60"
              r="35"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ 
                pathLength: 1,
                rotate: -360
              }}
              transition={{
                pathLength: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
                rotate: { duration: 2.5, ease: "linear", repeat: Infinity }
              }}
            />
            
            {/* Center dot */}
            <motion.circle
              cx="60"
              cy="60"
              r="5"
              fill="#D4AF37"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1937E3" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#1937E3" />
              </linearGradient>
              <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#1937E3" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-1">
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                className="text-lg font-medium text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5 + index * 0.05,
                  duration: 0.3
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-pollux-gold rounded-full"
                initial={{ scale: 0.5, opacity: 0.3 }}
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-full h-full bg-pollux-blue/20 rounded-full filter blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 