import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'current';
  text?: string;
  className?: string;
}

const ModernLoader: React.FC<ModernLoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  className
}) => {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', text: 'text-sm' },
    md: { container: 'w-8 h-8', text: 'text-base' },
    lg: { container: 'w-12 h-12', text: 'text-lg' },
    xl: { container: 'w-16 h-16', text: 'text-xl' }
  };

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    accent: 'text-pink-500',
    white: 'text-white',
    current: 'text-current'
  };

  const SpinnerLoader = () => (
    <motion.div
      className={cn("border-2 border-current border-t-transparent rounded-full", sizeClasses[size].container)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div
      className={cn("bg-current rounded-full", sizeClasses[size].container)}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const BarsLoader = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-current rounded-full"
          style={{ height: size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '24px' : '32px' }}
          animate={{
            scaleY: [1, 0.5, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  const RingLoader = () => (
    <div className={cn("relative", sizeClasses[size].container)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-current rounded-full"
          style={{ borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5 + i * 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );

  const LuxuryLoader = () => (
    <div className={cn("relative", sizeClasses[size].container)}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-2 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
        style={{ borderTopColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner pulse */}
      <motion.div
        className="absolute inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full"
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute inset-1/2 w-1 h-1 -ml-0.5 -mt-0.5 bg-white rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  const loaderComponents = {
    spinner: SpinnerLoader,
    dots: DotsLoader,
    pulse: PulseLoader,
    bars: BarsLoader,
    ring: RingLoader,
    luxury: LuxuryLoader
  };

  const LoaderComponent = loaderComponents[variant];

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className={cn(colorClasses[color])}>
        <LoaderComponent />
      </div>
      
      {text && (
        <motion.p
          className={cn("font-medium", colorClasses[color], sizeClasses[size].text)}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export { ModernLoader }; 