import { useRef, useEffect, useState } from 'react';
import lottie, { AnimationItem, AnimationConfigWithData } from 'lottie-web';
import { cn } from '@/lib/utils';

interface LottieAnimationProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  onClick?: () => void;
  speed?: number;
  width?: number | string;
  height?: number | string;
  initialSegment?: [number, number];
  segments?: [number, number][];
  direction?: 1 | -1;
  preserveAspectRatio?: string;
}

const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
  onComplete,
  onClick,
  speed = 1,
  width = "100%",
  height = "100%",
  initialSegment,
  segments,
  direction = 1,
  preserveAspectRatio = "xMidYMid meet",
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    // Cleanup previous animation if it exists
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Initialize animation
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData,
      initialSegment,
      rendererSettings: {
        preserveAspectRatio,
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    // Set speed
    animation.setSpeed(speed);

    // Set direction
    animation.setDirection(direction);

    // Handle onComplete callback
    if (onComplete) {
      animation.addEventListener('complete', onComplete);
    }

    // Handle segments if provided
    if (segments && segments.length > 0) {
      let currentSegmentIndex = 0;
      
      const playNextSegment = () => {
        if (currentSegmentIndex < segments.length) {
          const [startFrame, endFrame] = segments[currentSegmentIndex];
          animation.playSegments([startFrame, endFrame], true);
          currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
        }
      };
      
      animation.addEventListener('complete', playNextSegment);
      playNextSegment();
    }

    // Set loaded state
    animation.addEventListener('DOMLoaded', () => {
      setIsLoaded(true);
    });

    // Store animation instance
    animationRef.current = animation;

    // Clean up
    return () => {
      if (onComplete) {
        animation.removeEventListener('complete', onComplete);
      }
      animation.destroy();
      animationRef.current = null;
    };
  }, [animationData, loop, autoplay, onComplete, speed, initialSegment, segments, direction, preserveAspectRatio]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (animationRef.current) {
      // Toggle play/pause if no click handler provided
      if (animationRef.current.isPaused) {
        animationRef.current.play();
      } else {
        animationRef.current.pause();
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={cn("lottie-animation", className)}
      style={{
        width,
        height,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...style,
      }}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    />
  );
};

export default LottieAnimation; 