
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/animation';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  authorImage: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface BlogCardProps {
  blog: BlogPost;
  index?: number; // For staggered animations
}

const BlogCard = ({ blog, index = 0 }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entry animation
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion) return;
    
    gsap.set(cardRef.current, { y: 30, opacity: 0 });
    
    const animation = gsap.to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1 * index, // Stagger based on index
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom-=100',
        toggleActions: 'play none none none'
      }
    });
    
    return () => {
      animation.kill();
    };
  }, [index, prefersReducedMotion]);

  // Hover animations
  useEffect(() => {
    if (!cardRef.current || !imageRef.current || !titleRef.current || prefersReducedMotion) return;
    
    if (isHovered) {
      // Image zoom effect
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.7,
        ease: 'power2.out'
      });
      
      // Title color change
      gsap.to(titleRef.current, {
        color: '#e31937', // Pollux red color
        duration: 0.3
      });
      
      // Subtle card lift
      gsap.to(cardRef.current, {
        y: -8,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      // Reset animations
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: 'power2.out'
      });
      
      gsap.to(titleRef.current, {
        color: 'white', // Reset to original color
        duration: 0.3
      });
      
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: 'none',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isHovered, prefersReducedMotion]);

  return (
    <article 
      ref={cardRef}
      className="group relative flex flex-col bg-secondary rounded-lg overflow-hidden h-full transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          ref={imageRef}
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs font-medium px-2 py-1 bg-white/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 ref={titleRef} className="text-xl font-bold mb-3">
          <Link 
            to={`/blog/${blog.id}`}
            className="hover:text-pollux-red transition-colors"
          >
            {blog.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-400 text-sm mb-4 flex-1">
          {blog.excerpt}
        </p>
        
        {/* Author and Date */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <img 
              src={blog.authorImage} 
              alt={blog.author} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{blog.author}</p>
              <p className="text-xs text-gray-400">{blog.date}</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">{blog.readTime}</span>
        </div>
        
        {/* Read More Button */}
        <Link 
          to={`/blog/${blog.id}`}
          className={`absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-pollux-red transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
