import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  href,
}) => {
  // Base styles
  const baseClasses = cn(
    "relative inline-flex items-center justify-center font-medium rounded-full overflow-hidden transition-all duration-300 transform-gpu",
    fullWidth ? "w-full" : "",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    {
      // Size variations
      'text-xs px-4 py-1.5': size === 'sm',
      'text-sm px-6 py-2.5': size === 'md',
      'text-base px-8 py-3.5': size === 'lg',
      
      // Variant styles
      'bg-luxury-gradient text-white hover:shadow-blue-glow': variant === 'primary',
      'bg-white dark:bg-pollux-dark-gray text-pollux-red border border-pollux-red/30 hover:border-pollux-red': variant === 'secondary',
      'bg-gold-gradient text-black hover:shadow-gold-glow': variant === 'gold',
      'bg-transparent border border-pollux-gold/30 text-pollux-gold hover:bg-pollux-gold/10': variant === 'outline',
      'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30': variant === 'subtle',
    },
    className
  );
  
  const Component = href ? motion.a : motion.button;
  const componentProps = href ? { href } : { type };

  return (
    <Component
      {...componentProps}
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Accent shine effect */}
      <span 
        className={cn(
          "absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity group-hover:opacity-100",
          variant === 'gold' || variant === 'outline' ? 'gold-shine' : 'blue-shine'
        )}
        style={{
          background: variant === 'gold' || variant === 'outline' 
            ? 'linear-gradient(45deg, transparent 45%, rgba(212, 175, 55, 0.4) 50%, transparent 55%)' 
            : 'linear-gradient(45deg, transparent 45%, rgba(25, 55, 227, 0.3) 50%, transparent 55%)',
          backgroundSize: '250% 250%',
          animation: 'luxury-shimmer 3s ease-in-out infinite',
        }}
      />
      
      {/* Icon on left if specified */}
      {icon && iconPosition === 'left' && (
        <span className="mr-2 relative z-10">{icon}</span>
      )}
      
      {/* Button text */}
      <span className="relative z-10">{children}</span>
      
      {/* Icon on right if specified */}
      {icon && iconPosition === 'right' && (
        <motion.span 
          className="ml-2 relative z-10"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* Bottom accent line for gold and outline variants */}
      {(variant === 'outline' || variant === 'secondary') && (
        <motion.span 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pollux-gold/80 via-pollux-gold to-pollux-gold/80"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "center" }}
        />
      )}
    </Component>
  );
};

export default LuxuryButton; 