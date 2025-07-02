import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}

const SocialSidebar: React.FC = () => {
  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      url: 'https://facebook.com/polluxmotors',
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#166FE5]',
      textColor: 'text-white'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://instagram.com/polluxmotors',
      bgColor: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      hoverColor: 'hover:from-[#7A359C] hover:via-[#E91B1B] hover:to-[#E8682F]',
      textColor: 'text-white'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: 'https://twitter.com/polluxmotors',
      bgColor: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#1A91DA]',
      textColor: 'text-white'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://linkedin.com/company/polluxmotors',
      bgColor: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#095AA8]',
      textColor: 'text-white'
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://youtube.com/@polluxmotors',
      bgColor: 'bg-[#FF0000]',
      hoverColor: 'hover:bg-[#E60000]',
      textColor: 'text-white'
    },
    {
      name: 'WhatsApp',
      icon: <Phone className="w-5 h-5" />,
      url: 'https://wa.me/971503866702',
      bgColor: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#20BC5A]',
      textColor: 'text-white'
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      url: 'mailto:info@polluxmotors.com',
      bgColor: 'bg-[#4285F4]',
      hoverColor: 'hover:bg-[#3367D6]',
      textColor: 'text-white'
    },
    {
      name: 'Live Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      url: '/chat',
      bgColor: 'bg-gradient-to-r from-[#667eea] to-[#764ba2]',
      hoverColor: 'hover:from-[#5a6fd8] hover:to-[#6a4190]',
      textColor: 'text-white'
    }
  ];

  const containerVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="fixed left-0 top-1/2 transform -translate-y-1/2 z-[60] ml-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-2 space-y-1">
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`
              flex items-center justify-start w-44 px-4 py-3 rounded-xl
              ${link.bgColor} ${link.hoverColor} ${link.textColor}
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              group relative overflow-hidden
            `}
            variants={itemVariants}
            whileHover={{ 
              x: 8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background gradient overlay for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="flex-shrink-0 mr-3 group-hover:scale-110 transition-transform duration-200 z-10 relative">
              {link.icon}
            </div>
            
            {/* Text */}
            <span className="font-medium text-sm z-10 relative group-hover:translate-x-1 transition-transform duration-200">
              {link.name}
            </span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </motion.a>
        ))}
        
        {/* Decorative bottom element */}
        <motion.div 
          className="mt-4 pt-2 border-t border-white/10"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-xs text-gray-400 font-medium">Follow Pollux Motors</div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-1 rounded-full" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SocialSidebar; 