import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'minimal' | 'gradient';
  intensity?: 'light' | 'medium' | 'strong';
  glow?: boolean;
  animated?: boolean;
  hoverable?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  variant = 'default',
  intensity = 'medium',
  glow = false,
  animated = true,
  hoverable = true,
  ...props
}, ref) => {
  const baseClasses = "relative overflow-hidden border border-white/10";
  
  const variantClasses = {
    default: "bg-white/5 backdrop-blur-md",
    elevated: "bg-white/10 backdrop-blur-lg shadow-2xl",
    minimal: "bg-white/3 backdrop-blur-sm",
    gradient: "bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg"
  };
  
  const intensityClasses = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    strong: "backdrop-blur-lg"
  };
  
  const motionVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    hover: hoverable ? {
      y: -5,
      scale: 1.02
    } : {},
    tap: hoverable ? {
      scale: 0.98
    } : {}
  };

  const transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as const
  };

  const hoverTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        intensityClasses[intensity],
        glow && "shadow-lg shadow-blue-500/20",
        hoverable && "cursor-pointer",
        className
      )}
      variants={animated ? motionVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated && hoverable ? "hover" : undefined}
      whileTap={animated && hoverable ? "tap" : undefined}
      transition={animated ? transition : undefined}
      {...props}
    >
      {/* Glow overlay */}
      {glow && (
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      )}
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
});

GlassCard.displayName = "GlassCard";

export { GlassCard }; 