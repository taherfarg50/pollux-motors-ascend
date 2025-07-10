import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'luxury' | 'minimal' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  animated?: boolean;
  className?: string;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  glow = false,
  animated = true,
  className,
  ...props
}, ref) => {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 focus:ring-purple-500",
    accent: "bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 text-white shadow-lg shadow-pink-500/25 focus:ring-pink-500",
    luxury: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 focus:ring-amber-500",
    minimal: "bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 text-white shadow-lg focus:ring-white/50",
    ghost: "bg-transparent border border-current hover:bg-current/10 text-current"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };
  
  const motionVariants = {
    initial: { scale: 1 },
    hover: !disabled && !loading ? { 
      scale: 1.02,
      y: -1
    } : {},
    tap: !disabled && !loading ? { 
      scale: 0.98 
    } : {}
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%"
    }
  };

  const shimmerTransition = {
    repeat: Infinity,
    duration: 2,
    ease: "linear" as const
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && "shadow-xl",
        "group",
        className
      )}
      variants={animated ? motionVariants : undefined}
      initial={animated ? "initial" : undefined}
      whileHover={animated ? "hover" : undefined}
      whileTap={animated ? "tap" : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {/* Glow effect */}
      {glow && !disabled && (
        <div className="absolute -inset-px bg-gradient-to-r from-current via-transparent to-current rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      )}
      
      {/* Shimmer effect */}
             <motion.div 
         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
         variants={shimmerVariants}
         initial="initial"
         animate={!disabled && !loading ? "animate" : "initial"}
         transition={shimmerTransition}
       />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {children}
      </span>
      
      {/* Ripple effect container */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300 rounded-full" />
      </div>
    </motion.button>
  );
});

GradientButton.displayName = "GradientButton";

export { GradientButton }; 