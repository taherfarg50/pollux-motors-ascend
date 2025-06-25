import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Instagram, Linkedin, Youtube, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/pollux_motors',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/pollux-motors-95aa1a322/',
      icon: Linkedin,
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/channel/UC7iZZ3r9vN76DMUtQjD3MZQ',
      icon: Youtube,
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@pollux_motors',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
    },
  ];

  // Animation variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const socialIconVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2 + (custom * 0.1),
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }),
    hover: {
      scale: 1.2,
      color: "#1937E3",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-pollux-dark-gray to-black text-gray-400 relative overflow-hidden" role="contentinfo">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pollux-blue/20 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-pollux-blue/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-pollux-gold/5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Newsletter subscription */}
        <motion.div 
          className="w-full mb-16 glass-card rounded-xl p-8 border border-pollux-glass-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariant}
          custom={0}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 max-w-md">Subscribe to our newsletter for exclusive offers and the latest luxury automotive news.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-pollux-glass-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pollux-blue/50 transition-all"
              />
              <Button className="btn-luxury whitespace-nowrap">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariant}
            custom={1}
          >
            <Link 
              to="/" 
              className="inline-block mb-6"
              aria-label="Pollux Motors Home"
            >
              <motion.img 
                src="/media/images/whitecolor.png" 
                alt="Pollux Motors" 
                className="h-20 w-auto filter drop-shadow-md"
                width="160"
                height="80"
                loading="lazy"
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 8px rgba(25,55,227,0.5))" }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              />
            </Link>
            <p className="mb-6 text-gray-400/90 leading-relaxed">
              Luxury car dealership and export company based in UAE, specializing in premium brands like Bentley, Rolls Royce, BMW, Mercedes, and more.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-pollux-blue to-pollux-blue-light rounded-full"></div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariant}
            custom={2}
          >
            <h3 className="text-white text-xl font-semibold mb-5 relative inline-block">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-pollux-blue to-transparent"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/cars', label: 'Cars' },
                { path: '/models', label: '3D Models' },
                { path: '/about', label: 'About Us' },
                { path: '/contact', label: 'Contact' },
                { path: '/blog', label: 'Blog' }
              ].map((link, index) => (
                <motion.li key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                >
                  <Link 
                    to={link.path} 
                    className="hover:text-pollux-blue transition-all flex items-center group"
                    aria-label={link.label}
                  >
                    <motion.span 
                      className="inline-block w-0 h-0.5 bg-pollux-blue mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"
                    />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariant}
            custom={3}
          >
            <h3 className="text-white text-xl font-semibold mb-5 relative inline-block">
              Contact Us
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-pollux-blue to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="p-2 rounded-full bg-pollux-blue/10 group-hover:bg-pollux-blue/20 transition-colors mr-3">
                  <MapPin className="h-5 w-5 text-gradient-subtle" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-white">Dubai UAE</h4>
                  <span className="mt-1">Silicon oasis HQ FG-07-2, Dubai</span>
                  <span className="mt-1">+971502667937</span>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="p-2 rounded-full bg-pollux-blue/10 group-hover:bg-pollux-blue/20 transition-colors mr-3">
                  <Phone className="h-5 w-5 text-gradient-subtle" aria-hidden="true" />
                </div>
                <a 
                  href="tel:+971502667937" 
                  className="hover:text-pollux-blue transition-colors mt-1"
                >
                  Tel: +971502667937
                </a>
              </motion.li>
              <motion.li 
                className="flex items-start group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="p-2 rounded-full bg-pollux-blue/10 group-hover:bg-pollux-blue/20 transition-colors mr-3">
                  <Mail className="h-5 w-5 text-gradient-subtle" aria-hidden="true" />
                </div>
                <a 
                  href="mailto:info@polluxmotors.com" 
                  className="hover:text-pollux-blue transition-colors mt-1"
                >
                  info@polluxmotors.com
                </a>
              </motion.li>
              <motion.li 
                className="flex items-start group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="p-2 rounded-full bg-pollux-blue/10 group-hover:bg-pollux-blue/20 transition-colors mr-3">
                  <Globe className="h-5 w-5 text-gradient-subtle" aria-hidden="true" />
                </div>
                <a 
                  href="https://www.polluxmotors.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pollux-blue transition-colors mt-1"
                >
                  www.polluxmotors.com
                </a>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Social Media */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariant}
            custom={4}
          >
            <h3 className="text-white text-xl font-semibold mb-5 relative inline-block">
              Follow Us
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-pollux-blue to-transparent"></div>
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card p-3 rounded-full hover:border-pollux-blue/30 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                  variants={socialIconVariant}
                  custom={index}
                  whileHover="hover"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
            <div className="mt-6 glass-card rounded-lg p-4 border border-pollux-glass-border">
              <p className="text-sm">Download our mobile app for exclusive offers and real-time inventory updates.</p>
              <div className="flex gap-3 mt-3">
                <motion.a 
                  href="#" 
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-3 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.9 19.9l-5.4-3.1-5.4 3.1 1.4-6.1-4.6-4 6.2-.5 2.4-5.8 2.4 5.8 6.2.5-4.6 4 1.4 6.1z"/>
                  </svg>
                  <span className="text-xs">App Store</span>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-3 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V5H7c-3.87 0-7 3.13-7 7s3.13 7 7 7h4v-3.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 11h8v2H8v-2zm9-8h-4v3.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c3.87 0 7-3.13 7-7s-3.13-7-7-7z"/>
                  </svg>
                  <span className="text-xs">Play Store</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="divider-luxury-blue my-12"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            &copy; {currentYear} Pollux Motors. All rights reserved.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-6 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/privacy" className="text-gray-500 hover:text-pollux-blue transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-pollux-blue transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-gray-500 hover:text-pollux-blue transition-colors">Sitemap</Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
