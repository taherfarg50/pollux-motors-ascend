
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="group relative flex flex-col bg-secondary rounded-lg overflow-hidden h-full transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
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
        <h3 className="text-xl font-bold mb-3">
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
