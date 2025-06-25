import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  carPurchased: string;
  purchaseDate: string;
  verified: boolean;
}

const CustomerTestimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Al-Mansouri",
      location: "Dubai, UAE",
      role: "Business Executive",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
      rating: 5,
      review: "The AI-powered personalization completely transformed my car shopping experience. Pollux Motors found the perfect vehicle that matched my lifestyle and preferences before I even knew what I wanted.",
      carPurchased: "Mercedes-Benz S-Class",
      purchaseDate: "December 2023",
      verified: true
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      location: "Abu Dhabi, UAE",
      role: "Tech Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
      rating: 5,
      review: "The AR/VR showroom experience was mind-blowing! I could explore every detail of my future car from home. The virtual reality test drive felt incredibly real and helped me make the right choice.",
      carPurchased: "BMW i8",
      purchaseDate: "November 2023",
      verified: true
    },
    {
      id: 3,
      name: "Dr. Fatima Al-Zahra",
      location: "Sharjah, UAE",
      role: "Medical Professional",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
      rating: 5,
      review: "The smart financing AI calculated the perfect payment plan for my budget instantly. No waiting, no complicated paperwork - just intelligent solutions that work for my financial situation.",
      carPurchased: "Audi Q7",
      purchaseDate: "January 2024",
      verified: true
    },
    {
      id: 4,
      name: "Omar Al-Rashid",
      location: "Ajman, UAE",
      role: "Investment Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
      rating: 5,
      review: "The market intelligence feature saved me thousands! Real-time pricing data and AI insights helped me negotiate the best deal. Pollux Motors' technology gives customers a real advantage.",
      carPurchased: "Porsche 911",
      purchaseDate: "October 2023",
      verified: true
    },
    {
      id: 5,
      name: "Layla Abdullah",
      location: "Ras Al Khaimah, UAE",
      role: "Fashion Designer",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
      rating: 5,
      review: "The personalized dashboard shows everything about my vehicle's health in real-time. The predictive maintenance alerts have already saved me from potential issues. Truly revolutionary service!",
      carPurchased: "Range Rover Evoque",
      purchaseDate: "September 2023",
      verified: true
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section className="py-32 bg-gradient-to-b from-transparent to-black/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 60%, rgba(212,175,55,0.1) 1px, transparent 1px),
              radial-gradient(circle at 70% 40%, rgba(0,102,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Customer Stories
          </Badge>
          <h2 className="heading-2 mb-8">
            Trusted by
            <span className="block text-gradient-luxury">Thousands of Drivers</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Real experiences from our valued customers who've experienced the future of automotive luxury.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Customer Photo & Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/20 to-yellow-500/20 rounded-full blur-3xl opacity-30" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <div className="aspect-square w-80 mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-luxury-xl">
                      <img
                        src={currentData.avatar}
                        alt={currentData.name}
                        className="w-full h-full object-cover"
                      />
                      {currentData.verified && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mt-8">
                      <h3 className="heading-4 text-white mb-2">{currentData.name}</h3>
                      <p className="text-body-sm text-gray-400 mb-1">{currentData.role}</p>
                      <p className="text-body-sm text-gray-500">{currentData.location}</p>
                      
                      <div className="flex items-center justify-center mt-4 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < currentData.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Testimonial Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentTestimonial}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Quote Icon */}
                  <Quote className="w-16 h-16 text-yellow-500/30" />
                  
                  {/* Review Text */}
                  <blockquote className="text-body-lg leading-relaxed text-gray-200">
                    "{currentData.review}"
                  </blockquote>
                  
                  {/* Purchase Details */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Purchase Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="text-white font-medium">{currentData.carPurchased}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-white font-medium">{currentData.purchaseDate}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-12">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-yellow-500 w-8' 
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="text-gray-400 hover:text-white"
                >
                  {isAutoPlaying ? 'Pause' : 'Play'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="heading-3 text-yellow-500">4.9/5</div>
            <p className="text-gray-400">Average Rating</p>
          </div>
          <div className="space-y-2">
            <div className="heading-3 text-blue-500">15,000+</div>
            <p className="text-gray-400">Happy Customers</p>
          </div>
          <div className="space-y-2">
            <div className="heading-3 text-green-500">98%</div>
            <p className="text-gray-400">Satisfaction Rate</p>
          </div>
          <div className="space-y-2">
            <div className="heading-3 text-purple-500">24/7</div>
            <p className="text-gray-400">Support Available</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerTestimonials; 