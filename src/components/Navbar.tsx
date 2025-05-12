import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  
  // Scroll effect to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  return (
    <nav className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300',
      hasScrolled || isMenuOpen ? 'bg-background/90 backdrop-blur-lg border-b border-border shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-xl font-bold text-pollux-red">POLLUX</span>
            <span className="ml-1 text-xl font-light">Motors</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`transition-colors hover:text-pollux-red ${pathname === '/' ? 'text-pollux-red' : 'text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/cars" 
              className={`transition-colors hover:text-pollux-red ${pathname === '/cars' ? 'text-pollux-red' : 'text-foreground'}`}
            >
              Cars
            </Link>
            <Link 
              to="/compare" 
              className={`transition-colors hover:text-pollux-red ${pathname === '/compare' ? 'text-pollux-red' : 'text-foreground'}`}
            >
              Compare
            </Link>
            <Link 
              to="/models" 
              className={`transition-colors hover:text-pollux-red ${pathname === '/models' ? 'text-pollux-red' : 'text-foreground'}`}
            >
              3D Models
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center transition-colors hover:text-pollux-red ${['/about', '/blog', '/contact'].includes(pathname) ? 'text-pollux-red' : 'text-foreground'}`}>
                About
                <ChevronDown size={16} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link 
                    to="/about"
                    className="w-full"
                    onClick={closeMenu}
                  >
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link 
                    to="/blog" 
                    className="w-full"
                    onClick={closeMenu}
                  >
                    Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link 
                    to="/contact" 
                    className="w-full"
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* User menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center transition-colors hover:text-pollux-red gap-2">
                  <User size={20} />
                  <span className="text-sm">My Account</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link 
                      to="/profile"
                      className="w-full"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth" 
                className="transition-colors hover:text-pollux-red flex items-center gap-2"
              >
                <User size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-foreground focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-50 bg-background transform transition-transform ease-in-out duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center h-16 px-4 border-b border-border">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-xl font-bold text-pollux-red">POLLUX</span>
            <span className="ml-1 text-xl font-light">Motors</span>
          </Link>
          <button 
            onClick={toggleMenu}
            className="text-foreground focus:outline-none"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-6 space-y-6">
          <Link 
            to="/" 
            className={`block text-lg font-medium ${pathname === '/' ? 'text-pollux-red' : 'text-foreground'}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/cars" 
            className={`block text-lg font-medium ${pathname === '/cars' ? 'text-pollux-red' : 'text-foreground'}`}
            onClick={closeMenu}
          >
            Cars
          </Link>
          <Link 
            to="/compare" 
            className={`block text-lg font-medium ${pathname === '/compare' ? 'text-pollux-red' : 'text-foreground'}`}
            onClick={closeMenu}
          >
            Compare
          </Link>
          <Link 
            to="/models" 
            className={`block text-lg font-medium ${pathname === '/models' ? 'text-pollux-red' : 'text-foreground'}`}
            onClick={closeMenu}
          >
            3D Models
          </Link>
          <div className="py-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Company</p>
            <div className="space-y-4">
              <Link 
                to="/about" 
                className={`block ${pathname === '/about' ? 'text-pollux-red' : 'text-foreground'}`}
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link 
                to="/blog" 
                className={`block ${pathname === '/blog' ? 'text-pollux-red' : 'text-foreground'}`}
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className={`block ${pathname === '/contact' ? 'text-pollux-red' : 'text-foreground'}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="py-4 border-t border-border">
            {user ? (
              <div className="space-y-4">
                <Link
                  to="/profile"
                  className="block text-lg font-medium"
                  onClick={closeMenu}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="block text-lg font-medium text-pollux-red"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block text-lg font-medium text-pollux-red"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
