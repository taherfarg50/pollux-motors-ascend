import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Phone, 
  Car,
  Ship,
  Globe,
  MessageCircle,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlobalSearch from '@/components/GlobalSearch';
import { log } from '@/utils/logger';
import { perf } from '@/utils/performance';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

const NavbarModern: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);

  // Main navigation items - simplified for car dealership business
  const mainNavItems: NavItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <Globe className="w-4 h-4" />
    },
    {
      href: '/cars',
      label: 'Available Cars',
      icon: <Car className="w-4 h-4" />,
      description: 'Browse our vehicle inventory'
    },
    {
      href: '/export',
      label: 'Export Services',
      icon: <Ship className="w-4 h-4" />,
      description: 'International vehicle export'
    },
    {
      href: '/about',
      label: 'About Us',
      icon: <Globe className="w-4 h-4" />,
      description: 'Learn about our company'
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: <Phone className="w-4 h-4" />,
      description: 'Get in touch with us'
    }
  ];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearch(true);
        perf.trackInteraction('keyboard-shortcut', 'search-open');
        log.debug('Search opened via keyboard shortcut', undefined, 'NavbarModern');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleWhatsApp = () => {
    const message = "Hello! I'm interested in learning more about Pollux Motors vehicles and export services.";
    const url = `https://wa.me/971503866702?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
      }}
    >
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-pollux-blue to-pollux-blue-light text-white py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-sm">
            <span className="hidden sm:inline">🚗 Quality Vehicles • Global Export Services • </span>
            <Link to="/export" className="font-medium hover:underline ml-1">
              Export Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className={cn(
        "border-b border-white/10 transition-all duration-300",
        isScrolled && "shadow-lg"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.img
                src="/media/images/whitecolor.png"
                alt="Pollux Motors"
                className="h-8 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <span className="hidden sm:block text-xl font-bold text-white">
                Pollux Motors
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                aria-label="Search vehicles"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Contact buttons */}
              <div className="hidden sm:flex items-center gap-2">
                {/* Email */}
                <a
                  href="mailto:info@polluxmotors.com"
                  className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors text-white"
                  aria-label="Email us"
                >
                  <Mail className="w-5 h-5" />
                </a>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                  className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white"
                aria-label="Contact us on WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </button>
              </div>

              {/* Chat */}
              <Link
                to="/chat"
                className="p-2 rounded-full bg-pollux-blue hover:bg-pollux-blue-dark transition-colors text-white"
                aria-label="Chat with us"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={signOut}
                        className="text-red-400 hover:text-red-300"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/signin">Sign In</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup">Sign Up</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="space-y-4">
                  {/* Mobile navigation items */}
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <div>
                        <div className="text-white">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  {/* Mobile contact buttons */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        WhatsApp
                      </button>
                      <a
                        href="mailto:info@polluxmotors.com"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {showSearch && (
      <GlobalSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
      />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavbarModern; 