
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cars', path: '/cars' },
  { name: 'Compare', path: '/compare' },
  { name: '3D Models', path: '/models' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg",
        isScrolled ? "bg-black/80 py-2 shadow-lg" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                <span className="text-pollux-red">POLLUX</span> MOTORS
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors relative",
                      isActive 
                        ? "text-white after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-pollux-red" 
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pollux-red hover:bg-red-700 transition-colors"
              >
                Test Drive
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "fixed inset-0 bg-black/95 z-40 transform transition-transform duration-300 ease-in-out md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="pt-20 p-5 h-full flex flex-col">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path));
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-xl font-medium transition-colors",
                    isActive ? "text-pollux-red" : "text-gray-300 hover:text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-3 mt-4 border border-transparent text-lg font-medium rounded-md text-white bg-pollux-red hover:bg-red-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Test Drive
            </Link>
          </div>
          <div className="mt-auto pb-8">
            <p className="text-gray-500 text-sm">© 2025 Pollux Motors. All rights reserved.</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
