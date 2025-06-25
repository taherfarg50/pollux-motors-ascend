import { ReactNode } from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animation';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  glareColor?: string;
  glarePosition?: 'all' | 'top' | 'bottom' | 'left' | 'right';
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  transitionEasing?: string;
  transitionDuration?: number;
  gyroscope?: boolean;
  glint?: boolean;
}

const TiltCard = ({
  children,
  className,
  glareEnabled = true,
  glareColor = 'rgba(25, 55, 227, 0.2)',
  glarePosition = 'all',
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 1000,
  transitionEasing = 'cubic-bezier(.03,.98,.52,.99)',
  transitionDuration = 500,
  gyroscope = false,
  glint = false
}: TiltCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Skip effect if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  
  // Tilt options
  const tiltOptions = {
    max: tiltMaxAngleX,
    scale: scale,
    speed: speed,
    glare: glareEnabled,
    'max-glare': 0.2,
    'glare-prerender': false,
    perspective: perspective,
    gyroscope: gyroscope,
    transition: true,
    easing: transitionEasing,
    'transition-duration': transitionDuration,
  };

  return (
    <Tilt options={tiltOptions} className={cn('tilt-card-container', className)}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Main content */}
        {children}
        
        {/* Glare effect */}
        {glareEnabled && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: `linear-gradient(135deg, ${glareColor} 0%, transparent 65%)`,
              opacity: 0.4,
              mixBlendMode: 'overlay' 
            }}
          />
        )}
        
        {/* Optional glint animation */}
        {glint && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{
              opacity: [0, 0.4, 0],
              x: ['100%', '100%', '200%'],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 3,
              repeatDelay: 5,
              ease: 'easeInOut'
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </div>
    </Tilt>
  );
};

export default TiltCard; 