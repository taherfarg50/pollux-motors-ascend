import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';

import ShareModal from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Clock, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  ArrowRight, 
  Twitter, 
  Facebook, 
  Linkedin 
} from 'lucide-react';
import { useReducedMotion } from '@/lib/animation';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Sample blog posts data
const blogs = [
  {
    id: 1,
    title: "The Future of Electric Luxury Vehicles",
    excerpt: "As the world moves towards sustainable transportation, Pollux Motors is leading the charge with innovative electric luxury vehicles that don't compromise on performance or style.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Alexandra Reynolds",
    authorRole: "Chief Executive Officer",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "May 8, 2025",
    readTime: "8 min read",
    tags: ["Electric", "Innovation", "Sustainability"]
  },
  {
    id: 2,
    title: "Designing the Perfect Cabin: The Art of Automotive Interior",
    excerpt: "Explore the meticulous process behind creating luxurious, comfortable, and technologically advanced interiors that define the Pollux Motors experience.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Marcus Chen",
    authorRole: "Chief Design Officer",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "May 2, 2025",
    readTime: "6 min read",
    tags: ["Design", "Luxury", "Craftsmanship"]
  },
  {
    id: 3,
    title: "Advanced Driver Assistance Systems: Safety Meets Luxury",
    excerpt: "How Pollux Motors is integrating cutting-edge safety technologies with the luxury driving experience, creating vehicles that protect as well as they perform.",
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Sophia Patel",
    authorRole: "Chief Technology Officer",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "April 28, 2025",
    readTime: "10 min read",
    tags: ["Technology", "Safety", "Innovation"]
  },
  {
    id: 4,
    title: "The Story Behind the Atlas SUV-X: From Concept to Reality",
    excerpt: "Get an exclusive look at the journey of our newest model, from the initial design sketches to the production line.",
    image: "https://images.unsplash.com/photo-1669215420005-917c8c19a654?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "David Johnson",
    authorRole: "Product Development Director",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "April 20, 2025",
    readTime: "7 min read",
    tags: ["Behind the Scenes", "Design", "SUV"]
  },
  {
    id: 5,
    title: "The Perfect Road Trip: Five Destinations for Luxury Driving",
    excerpt: "Planning your next adventure? Discover five spectacular routes that are perfect for experiencing the full capabilities of your Pollux vehicle.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2908&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Emma Wilson",
    authorRole: "Lifestyle Editor",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "April 15, 2025",
    readTime: "5 min read",
    tags: ["Lifestyle", "Travel", "Experience"]
  },
  {
    id: 6,
    title: "Sustainable Luxury: Our Commitment to Environmental Responsibility",
    excerpt: "Learn about Pollux Motors' ongoing initiatives to reduce our environmental footprint while continuing to deliver the luxury experience our customers expect.",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Michael Greene",
    authorRole: "Sustainability Director",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "April 10, 2025",
    readTime: "8 min read",
    tags: ["Sustainability", "Corporate Responsibility", "Future"]
  }
];

// Featured posts slider data
const featuredPosts = [
  {
    id: 101,
    title: "Introducing the Next Generation: The 2026 Pollux Lineup",
    excerpt: "Get an exclusive preview of our upcoming models that are set to redefine luxury automotive standards with revolutionary design and groundbreaking technology.",
    image: "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "May 10, 2025",
    readTime: "12 min read",
    tags: ["Featured", "New Models", "Innovation"]
  },
  {
    id: 102,
    title: "The Evolution of Automotive Luxury: Pollux Through the Years",
    excerpt: "A retrospective look at how our commitment to excellence has shaped the automotive industry and redefined what luxury means for discerning drivers.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "May 5, 2025",
    readTime: "10 min read",
    tags: ["Featured", "History", "Luxury"]
  },
  {
    id: 103,
    title: "Sustainable Performance: The Future of Pollux Motors",
    excerpt: "Discover how we're leading the industry in combining uncompromising performance with environmental responsibility in our next generation of vehicles.",
    image: "https://images.unsplash.com/photo-1552519507-7abe3deb74df?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: "May 3, 2025",
    readTime: "9 min read",
    tags: ["Featured", "Sustainability", "Innovation"]
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Blog = () => {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [showShareModal, setShowShareModal] = useState<number | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuredSliderRef = useRef<HTMLDivElement>(null);
  
  const [filtersRef, filtersInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [blogGridRef, blogGridInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [newsletterRef, newsletterInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const prefersReducedMotion = useReducedMotion();
  
  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  // Auto rotate featured posts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter blogs based on active tag and search query
  const filteredBlogs = blogs.filter(blog => {
    const matchesTag = activeTag === 'all' || blog.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase());
    const matchesSearch = !searchQuery || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Get unique tags from all blogs
  const allTags = ['all', ...Array.from(new Set(blogs.flatMap(blog => blog.tags.map(tag => tag.toLowerCase()))))];

  // Navigation functions
  const navigateToPost = (id: number) => {
    navigate(`/blog/${id}`);
  };

  const sharePost = (id: number) => {
    setShowShareModal(id);
  };

  const toggleSavePost = (id: number) => {
    setSavedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id) 
        : [...prev, id]
    );
  };

  const nextFeaturedPost = () => {
    setCurrentFeaturedIndex(prev => (prev + 1) % featuredPosts.length);
  };

  const prevFeaturedPost = () => {
    setCurrentFeaturedIndex(prev => 
      prev === 0 ? featuredPosts.length - 1 : prev - 1
    );
  };

  // Initialize animations
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Hero animations
    if (titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(
        titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );
    }
    
    // Featured post animation
    if (featuredSliderRef.current) {
      gsap.fromTo(
        featuredSliderRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: featuredSliderRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Filters animations
    if (filtersRef.current) {
      gsap.fromTo(
        filtersRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Newsletter section animation
    if (newsletterRef.current) {
      gsap.fromTo(
        newsletterRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [prefersReducedMotion, filtersRef, newsletterRef]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section 
          ref={heroRef} 
          className="relative h-[50vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black">
            <motion.div
              className="absolute inset-0 opacity-70"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Pollux Motors Blog" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <motion.h1 
              ref={titleRef} 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Pollux <span className="text-pollux-red">Insights</span>
            </motion.h1>
            <motion.p 
              ref={subtitleRef} 
              className="text-gray-300 max-w-xl text-center px-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Insights, stories, and news from the world of luxury automotive excellence.
            </motion.p>
          </div>
        </motion.section>
        
        {/* Blog Content */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Search */}
            <motion.div 
              ref={filtersRef} 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={filtersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Tag Filter */}
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTag === tag.toLowerCase()
                          ? 'bg-pollux-red text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setActiveTag(tag.toLowerCase())}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </motion.button>
                  ))}
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-64">
                  {showSearch ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="relative"
                    >
                      <input 
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-border rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-pollux-red"
                      />
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      onClick={() => setShowSearch(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Search className="h-4 w-4" />
                      <span className="text-sm font-medium">Search</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Featured Posts Slider */}
            <motion.div 
              ref={featuredRef} 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div ref={featuredSliderRef} className="relative">
                <div className="overflow-hidden rounded-lg">
                  <AnimatePresence mode="wait">
                    {featuredPosts.map((post, index) => (
                      currentFeaturedIndex === index && (
                        <motion.div
                          key={post.id}
                          className="relative group"
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="aspect-[21/9] overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <div className="flex items-center space-x-3 mb-4">
                              <span className="bg-pollux-red text-white px-3 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                              <span className="text-gray-300 text-sm">{post.date}</span>
                              <span className="text-gray-300 text-sm">{post.readTime}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                              {post.title}
                            </h2>
                            <p className="text-gray-300 max-w-3xl mb-6">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4">
                              <Button 
                                className="bg-pollux-red hover:bg-red-700 text-white group"
                                onClick={() => navigateToPost(post.id)}
                              >
                                Read Article <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                              <button 
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                onClick={() => sharePost(post.id)}
                              >
                                <Share2 className="h-5 w-5" />
                              </button>
                              <button 
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                onClick={() => toggleSavePost(post.id)}
                              >
                                {savedPosts.includes(post.id) ? (
                                  <BookmarkCheck className="h-5 w-5 text-pollux-red" />
                                ) : (
                                  <Bookmark className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Pagination dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {featuredPosts.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentFeaturedIndex ? 'bg-pollux-red' : 'bg-gray-600'}`}
                      onClick={() => setCurrentFeaturedIndex(index)}
                    />
                  ))}
                </div>
                
                {/* Navigation arrows */}
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  onClick={prevFeaturedPost}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  onClick={nextFeaturedPost}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </motion.div>
            
            {/* Blog Grid */}
            <motion.div 
              ref={blogGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={blogGridInView ? "visible" : "hidden"}
            >
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    onClick={() => navigateToPost(blog.id)}
                    className="cursor-pointer"
                    variants={itemVariants}
                  >
                    <div className="glass-card rounded-lg overflow-hidden group h-full flex flex-col">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                          <div className="flex space-x-1">
                            {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTag(tag.toLowerCase());
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                sharePost(blog.id);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSavePost(blog.id);
                              }}
                            >
                              {savedPosts.includes(blog.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-pollux-red" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-pollux-red transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img 
                              src={blog.authorImage} 
                              alt={blog.author} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium">{blog.author}</p>
                              <p className="text-xs text-gray-500">{blog.date}</p>
                            </div>
                          </div>
                          <span className="text-gray-300 text-sm">{blog.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-400 mb-4">No articles found matching your criteria</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveTag('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
            
            {/* Load More Button */}
            {filteredBlogs.length > 0 && (
              <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={blogGridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  className="px-8 group"
                >
                  Load More Articles
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Newsletter Section */}
        <motion.section 
          ref={newsletterRef} 
          className="py-24 bg-secondary"
          initial={{ opacity: 0 }}
          animate={newsletterInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
              <p className="text-gray-300 mb-8">
                Subscribe to our newsletter for the latest news, exclusive content, and special offers from Pollux Motors.
              </p>
            </motion.div>
            
            <motion.div 
              className="max-w-md mx-auto glass-card p-8 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col gap-4">
                <input 
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-border rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-pollux-red"
                />
                <Button className="w-full py-6 bg-pollux-red hover:bg-red-700 text-white">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Pollux Motors.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal !== null && (
          <ShareModal 
            postId={showShareModal} 
            onClose={() => setShowShareModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
