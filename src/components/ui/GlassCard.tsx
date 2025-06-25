import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gold' | 'blue';
  hoverEffect?: boolean;
  className?: string;
  borderHighlight?: boolean;
  glareEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  className,
  borderHighlight = true,
  glareEffect = true,
  ...props
}) => {
  // Variants for different card styles
  const variantStyles = {
    default: "bg-white/5 backdrop-blur-lg border-white/10",
    dark: "bg-black/40 backdrop-blur-md border-white/5",
    gold: "bg-pollux-gold/5 backdrop-blur-lg border-pollux-gold/20",
    blue: "bg-pollux-red/5 backdrop-blur-lg border-pollux-red/20"
  };
  
  // Variants for different highlight styles
  const highlightStyles = {
    default: "before:bg-white/10",
    dark: "before:bg-white/5",
    gold: "before:bg-pollux-gold/10",
    blue: "before:bg-pollux-red/10"
  };
  
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border overflow-hidden transition-all duration-300",
        variantStyles[variant],
        borderHighlight && "before:absolute before:bottom-0 before:left-[5%] before:right-[5%] before:h-[1px]",
        highlightStyles[variant],
        hoverEffect && "hover:shadow-lg hover:-translate-y-1",
        variant === 'gold' && hoverEffect && "hover:shadow-gold-glow",
        variant === 'blue' && hoverEffect && "hover:shadow-blue-glow",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Glare effect (glass shine) */}
      {glareEffect && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute -top-[150%] -right-[150%] w-[300%] h-[300%] bg-gradient-to-br from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform rotate-12"></div>
        </div>
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard; 