import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

interface ScrollRevealPremiumProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  cascade?: boolean;
  once?: boolean;
}

const ScrollRevealPremium: React.FC<ScrollRevealPremiumProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  type = 'fade',
  direction = 'up',
  cascade = false,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const controls = useAnimation();

  const variants: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }
    },
    slide: {
      hidden: {
        opacity: 0,
        x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
        y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }
    },
    scale: {
      hidden: {
        opacity: 0,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }
    },
    rotate: {
      hidden: {
        opacity: 0,
        rotate: direction === 'left' ? -90 : 90,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }
    },
    blur: {
      hidden: {
        opacity: 0,
        filter: 'blur(10px)',
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  if (cascade && React.Children.count(children) > 1) {
    return (
      <div ref={ref} className={className}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={variants[type]}
            custom={index}
            transition={{
              duration,
              delay: delay + (index * 0.1),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants[type]}
    >
      {children}
    </motion.div>
  );
};

// Specialized reveal components for common use cases
export const FadeIn: React.FC<Omit<ScrollRevealPremiumProps, 'type'>> = (props) => (
  <ScrollRevealPremium {...props} type="fade" />
);

export const SlideIn: React.FC<Omit<ScrollRevealPremiumProps, 'type'>> = (props) => (
  <ScrollRevealPremium {...props} type="slide" />
);

export const ScaleIn: React.FC<Omit<ScrollRevealPremiumProps, 'type'>> = (props) => (
  <ScrollRevealPremium {...props} type="scale" />
);

export const BlurIn: React.FC<Omit<ScrollRevealPremiumProps, 'type'>> = (props) => (
  <ScrollRevealPremium {...props} type="blur" />
);

// Text reveal animation component
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: delay + (wordIndex * words.length + charIndex) * staggerDelay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }
                }
              }}
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </div>
  );
};

export default ScrollRevealPremium; 