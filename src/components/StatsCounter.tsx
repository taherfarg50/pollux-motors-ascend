
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { DigitalCounter } from '@/components/ui/digital-counter';
import { Separator } from '@/components/ui/separator';
import { useReducedMotion } from '@/lib/animation';

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface StatsCounterProps {
  stats: StatItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const StatsCounter = ({ stats, title, subtitle, className }: StatsCounterProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Improved intersection observer with higher threshold for better trigger timing
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: '10px', // Trigger slightly earlier
  });

  return (
    <div 
      ref={ref}
      className={`py-12 ${className}`}
    >
      {/* Title section */}
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-sm font-medium tracking-wider text-pollux-red uppercase">
              {subtitle}
            </p>
          )}
          
          {title && (
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">
              {title}
            </h2>
          )}
        </div>
      )}
      
      {/* Stats grid with optimized animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        {/* Background effect */}
        <div className="absolute inset-0 smoke opacity-20 pointer-events-none"></div>
        
        {/* Stats items */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`text-center p-4 transform transition-all duration-500 ${
              inView && !prefersReducedMotion 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
            style={{ 
              transitionDelay: `${index * 100}ms`,
              willChange: 'transform, opacity' // Performance optimization
            }}
          >
            <div className="relative mb-3">
              <Separator className="separator-glow w-16 mx-auto" />
            </div>
            
            <div className="text-4xl font-bold mb-2 digital-readout">
              {inView ? (
                <DigitalCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  className="animate-digital-flicker"
                />
              ) : (
                <span>0</span>
              )}
            </div>
            
            <p className="text-sm text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;
