import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animation';

type AnimationVariant = 
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'
  | 'rotate-left'
  | 'rotate-right';

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
  id?: string;
}

const ScrollRevealSection = ({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  threshold = 0.1,
  triggerOnce = true,
  as: Component = 'div',
  id,
}: ScrollRevealSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });
  
  // Animation variants
  const variants = {
    // Fade animations
    'fade-up': {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
    },
    'fade-down': {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 },
    },
    'fade-left': {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 },
    },
    'fade-right': {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 },
    },
    
    // Zoom animations
    'zoom-in': {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    'zoom-out': {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { opacity: 1, scale: 1 },
    },
    
    // Flip animations
    'flip-up': {
      hidden: { opacity: 0, rotateX: 90, y: distance },
      visible: { opacity: 1, rotateX: 0, y: 0 },
    },
    'flip-down': {
      hidden: { opacity: 0, rotateX: -90, y: -distance },
      visible: { opacity: 1, rotateX: 0, y: 0 },
    },
    
    // Rotate animations
    'rotate-left': {
      hidden: { opacity: 0, rotate: -15, scale: 0.9 },
      visible: { opacity: 1, rotate: 0, scale: 1 },
    },
    'rotate-right': {
      hidden: { opacity: 0, rotate: 15, scale: 0.9 },
      visible: { opacity: 1, rotate: 0, scale: 1 },
    },
  };
  
  // If user prefers reduced motion, use a simple fade animation
  const selectedVariant = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : variants[variant];
  
  return (
    <Component
      id={id}
      className={cn(
        "scroll-reveal-section",
        className
      )}
      ref={ref}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={selectedVariant}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </Component>
  );
};

export default ScrollRevealSection; 