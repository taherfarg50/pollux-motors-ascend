import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-gray-400 text-lg mb-8 max-w-md mx-auto"
          >
            Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
            
            <Link to="/">
              <Button size="lg" className="group">
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <p className="text-gray-500 mb-4">Or check out these popular pages:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/cars" 
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Car className="h-4 w-4" />
                Browse Cars
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Search className="h-4 w-4" />
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Home className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </motion.div>

          {/* Fun Animation */}
          <motion.div
            className="mt-16"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              className="w-24 h-24 mx-auto text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
