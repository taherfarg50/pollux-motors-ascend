import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface ParticleEffectProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

const ParticleEffect = ({ count = 60, mousePosition }: ParticleEffectProps) => {
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    blur: number;
    color: string;
  }>>([]);
  
  // Mouse follower effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  
  const particleX = useTransform(smoothMouseX, value => value * 10);
  const particleY = useTransform(smoothMouseY, value => value * 10);

  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);
  
  // Generate random particles
  useEffect(() => {
    const generatedParticles = Array.from({ length: count }, () => {
      // Color variations - mostly red/orange with some blue/white accents
      const colors = [
        'rgba(227, 25, 55, 0.3)',  // Pollux red
        'rgba(255, 100, 50, 0.2)', // Orange
        'rgba(255, 150, 100, 0.2)', // Light orange
        'rgba(50, 100, 255, 0.15)', // Blue accent
        'rgba(255, 255, 255, 0.3)', // White
      ];
      
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 1,
        duration: Math.random() * 15 + 20,
        delay: Math.random() * 10,
        blur: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    
    setParticles(generatedParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full mix-blend-screen"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: `blur(${particle.blur}px)`,
            x: particleX,
            y: particleY,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      ))}
      
      {/* Central glow effect that follows mouse */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(227, 25, 55, 0.15) 0%, rgba(227, 25, 55, 0) 70%)',
          left: '50%',
          top: '50%',
          x: particleX,
          y: particleY,
          opacity: 0.8,
          translateX: '-50%',
          translateY: '-50%',
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default ParticleEffect; 