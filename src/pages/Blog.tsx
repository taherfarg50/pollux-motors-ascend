
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

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

const Blog = () => {
  const [activeTag, setActiveTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Pollux Motors Blog" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center">
              Pollux Blog
            </h1>
            <p className="text-gray-300 max-w-xl text-center px-4">
              Insights, stories, and news from the world of luxury automotive excellence.
            </p>
          </div>
        </section>
        
        {/* Blog Content */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Search */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Tag Filter */}
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTag === tag.toLowerCase()
                          ? 'bg-pollux-red text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setActiveTag(tag.toLowerCase())}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Search */}
                <div className="w-full md:w-64">
                  <input 
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pollux-red"
                  />
                </div>
              </div>
            </div>
            
            {/* Featured Post */}
            <div className="mb-16">
              <div className="relative group rounded-lg overflow-hidden">
                <div className="aspect-[21/9] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Featured Post" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-pollux-red text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                    <span className="text-gray-300 text-sm">May 10, 2025</span>
                    <span className="text-gray-300 text-sm">12 min read</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                    Introducing the Next Generation: The 2026 Pollux Lineup
                  </h2>
                  <p className="text-gray-300 max-w-3xl mb-6">
                    Get an exclusive preview of our upcoming models that are set to redefine luxury automotive standards with revolutionary design and groundbreaking technology.
                  </p>
                  <Button className="bg-pollux-red hover:bg-red-700 text-white group">
                    Read Article <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="mt-16 text-center">
              <Button variant="outline" className="px-8">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-24 bg-secondary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for the latest news, exclusive content, and special offers from Pollux Motors.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-white/5 border border-border rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-pollux-red"
                />
                <Button className="bg-pollux-red hover:bg-red-700 text-white">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Pollux Motors.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
