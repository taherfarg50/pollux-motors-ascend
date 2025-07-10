import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  variant?: 'stars' | 'luxury' | 'floating' | 'connected' | 'aurora';
  className?: string;
  speed?: number;
  interactive?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  variant = 'luxury',
  className = '',
  speed = 1,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  const particleConfig = useMemo(() => {
    switch (variant) {
      case 'stars':
        return {
          minSize: 1,
          maxSize: 3,
          minSpeed: 0.1,
          maxSpeed: 0.5,
          color: 'rgba(255, 255, 255, 0.8)',
          fadeSpeed: 0.02
        };
      case 'luxury':
        return {
          minSize: 2,
          maxSize: 6,
          minSpeed: 0.2,
          maxSpeed: 1,
          color: 'rgba(59, 130, 246, 0.6)',
          fadeSpeed: 0.01
        };
      case 'floating':
        return {
          minSize: 3,
          maxSize: 8,
          minSpeed: 0.1,
          maxSpeed: 0.3,
          color: 'rgba(168, 85, 247, 0.4)',
          fadeSpeed: 0.005
        };
      case 'connected':
        return {
          minSize: 2,
          maxSize: 4,
          minSpeed: 0.3,
          maxSpeed: 0.8,
          color: 'rgba(34, 197, 94, 0.5)',
          fadeSpeed: 0.015
        };
      case 'aurora':
        return {
          minSize: 1,
          maxSize: 5,
          minSpeed: 0.1,
          maxSpeed: 0.6,
          color: 'rgba(147, 51, 234, 0.3)',
          fadeSpeed: 0.008
        };
      default:
        return {
          minSize: 2,
          maxSize: 6,
          minSpeed: 0.2,
          maxSpeed: 1,
          color: 'rgba(59, 130, 246, 0.6)',
          fadeSpeed: 0.01
        };
    }
  }, [variant]);

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const config = particleConfig;
    return {
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.maxSpeed * speed,
      vy: (Math.random() - 0.5) * config.maxSpeed * speed,
      size: config.minSize + Math.random() * (config.maxSize - config.minSize),
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: 1000 + Math.random() * 2000
    };
  };

  const initParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = Array.from({ length: particleCount }, () => 
      createParticle(canvas)
    );
  };

  const updateParticle = (particle: Particle, canvas: HTMLCanvasElement, mouse: { x: number; y: number }) => {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Interactive effect with mouse
    if (interactive) {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= (dx / distance) * force * 0.01;
        particle.vy -= (dy / distance) * force * 0.01;
      }
    }

    // Boundary wrapping
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Fade effect
    if (particle.life > particle.maxLife * 0.8) {
      particle.opacity -= particleConfig.fadeSpeed;
    }

    // Reset particle if it's too old or faded
    if (particle.life > particle.maxLife || particle.opacity <= 0) {
      Object.assign(particle, createParticle(canvas));
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;

    switch (variant) {
      case 'stars':
        ctx.fillStyle = particleConfig.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'luxury':
        // Gradient circle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'floating':
        // Soft glow
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = particleConfig.color;
        ctx.fillStyle = particleConfig.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'connected':
        // Draw connections to nearby particles
        ctx.strokeStyle = particleConfig.color;
        ctx.lineWidth = 0.5;
        particlesRef.current.forEach(otherParticle => {
          if (otherParticle.id !== particle.id) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.globalAlpha = (120 - distance) / 120 * 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particleConfig.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'aurora':
        // Aurora-like effect
        const auroraGradient = ctx.createLinearGradient(
          particle.x - particle.size, particle.y - particle.size,
          particle.x + particle.size, particle.y + particle.size
        );
        auroraGradient.addColorStop(0, 'rgba(147, 51, 234, 0.6)');
        auroraGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
        auroraGradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
        
        ctx.fillStyle = auroraGradient;
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 0.6, 
                   particle.life * 0.01, 0, Math.PI * 2);
        ctx.fill();
        break;

      default:
        ctx.fillStyle = particleConfig.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      updateParticle(particle, canvas, mouseRef.current);
      drawParticle(ctx, particle);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initParticles(canvas);

    // Start animation
    animate();

    // Event listeners
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, particleCount, speed, interactive]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

export default ParticleBackground; 