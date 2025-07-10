import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Ship, 
  Info, 
  MessageCircle, 
  Search, 
  Phone, 
  Mail, 
  Bot, 
  Menu, 
  X, 
  ChevronDown,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimpleNavbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Vehicles', href: '/cars', icon: Car },
    { name: 'Export', href: '/export', icon: Ship },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleWhatsApp = () => {
    const message = "Hello! I'm interested in Pollux Motors vehicles and services.";
    const url = `https://wa.me/971503866702?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="navbar-container w-full fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Always Visible */}
      <div className="w-full bg-blue-600 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="font-medium">Premium Vehicles</span>
              </span>
              <span className="hidden md:flex items-center gap-2">
                <Ship className="h-4 w-4" />
                <span>Global Export</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/export" className="hover:underline">
                Free Export Quote →
              </Link>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Force Visible with Strong Styling */}
      <nav 
        className="navbar-main w-full bg-black text-white border-b border-gray-700 shadow-lg"
        style={{ 
          backgroundColor: '#000000',
          display: 'block',
          visibility: 'visible',
          opacity: 1,
          position: 'relative',
          zIndex: 40
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16" style={{ minHeight: '64px' }}>
            
            {/* Logo - Always Visible */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Pollux Motors Logo" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hidden">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Always Visible on Desktop */}
            <div 
              className="desktop-nav flex items-center space-x-6"
              style={{
                display: 'flex',
                visibility: 'visible',
                opacity: 1,
                minWidth: '300px'
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    style={{ 
                      color: isActive(item.href) ? '#ffffff' : '#d1d5db',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons - Always Visible */}
            <div className="flex items-center space-x-3">
              {/* Essential buttons - Always show */}
              <Link
                to="/cars"
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                title="Search Vehicles"
                style={{ color: '#d1d5db' }}
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                to="/chat"
                className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white relative transition-colors"
                title="AI Assistant"
                style={{ backgroundColor: '#7c3aed' }}
              >
                <Bot className="w-5 h-5" style={{ color: '#ffffff' }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </Link>
              
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                title="WhatsApp"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Desktop only buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  title="Your Profile"
                  style={{ color: '#d1d5db' }}
                >
                  <User className="w-5 h-5" />
                </Link>
                
                <a
                  href="mailto:info@polluxmotors.com"
                  className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                  title="Email Us"
                  style={{ backgroundColor: '#4b5563', color: '#ffffff' }}
                >
                  <Mail className="w-4 h-4" />
                </a>

                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                >
                  <Link to="/contact">Get Quote</Link>
                </Button>
              </div>

              {/* Mobile Menu Button - Show on small screens */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mobile-menu-btn p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
                style={{ color: '#d1d5db' }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only show on small screens */}
        {isMobileMenuOpen && (
          <div className="mobile-menu bg-gray-900 border-t border-gray-700" style={{ backgroundColor: '#111827' }}>
            <div className="px-4 py-6 space-y-3">
              
              {/* Mobile Navigation Links */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      color: isActive(item.href) ? '#ffffff' : '#d1d5db',
                      backgroundColor: isActive(item.href) ? '#2563eb' : 'transparent'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-700">
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ backgroundColor: '#4b5563', color: '#ffffff' }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Contact</span>
                </Link>
              </div>

              {/* Mobile Contact Info */}
              <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+971 50 286 6702</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@polluxmotors.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SimpleNavbar; 