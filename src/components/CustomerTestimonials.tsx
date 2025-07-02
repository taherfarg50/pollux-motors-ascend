import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  role?: string;
  rating: number;
  review: string;
  car_purchased?: string;
  purchase_date?: string;
  verified?: boolean;
  created_at?: string;
}

const CustomerTestimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Static testimonials data - ready for database integration
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Al-Mansouri",
      location: "Dubai, UAE",
      role: "Business Executive",
      rating: 5,
      review: "Exceptional service and quality vehicles. The team at Pollux Motors made the entire car buying process smooth and professional. Highly recommend!",
      car_purchased: "Mercedes-Benz S-Class",
      purchase_date: "December 2023",
      verified: true
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      location: "Abu Dhabi, UAE",
      role: "Tech Entrepreneur",
      rating: 5,
      review: "Outstanding experience from start to finish. Professional staff, quality vehicles, and excellent after-sales service. Will definitely buy again.",
      car_purchased: "BMW X6",
      purchase_date: "November 2023",
      verified: true
    },
    {
      id: 3,
      name: "Dr. Fatima Al-Zahra",
      location: "Sharjah, UAE",
      role: "Medical Professional",
      rating: 5,
      review: "The financing options were very helpful and the staff was extremely knowledgeable. Found exactly what I was looking for at a great price.",
      car_purchased: "Audi Q7",
      purchase_date: "January 2024",
      verified: true
    },
    {
      id: 4,
      name: "Omar Al-Rashid",
      location: "Ajman, UAE",
      role: "Investment Manager",
      rating: 5,
      review: "Great selection of vehicles and competitive pricing. The export documentation service for my international purchase was handled perfectly.",
      car_purchased: "Porsche 911",
      purchase_date: "October 2023",
      verified: true
    },
    {
      id: 5,
      name: "Layla Abdullah",
      location: "Ras Al Khaimah, UAE",
      role: "Fashion Designer",
      rating: 5,
      review: "Professional service and beautiful vehicles. The team understood exactly what I needed and delivered beyond expectations. Thank you!",
      car_purchased: "Range Rover Evoque",
      purchase_date: "September 2023",
      verified: true
    },
    {
      id: 6,
      name: "Mohammed Al-Zaabi",
      location: "Fujairah, UAE",
      role: "Engineer",
      rating: 5,
      review: "The export process to Egypt was seamless. All documentation was handled professionally and the car arrived in perfect condition. Excellent service!",
      car_purchased: "Toyota Land Cruiser",
      purchase_date: "August 2023",
      verified: true
    }
  ];

  // TODO: Replace with actual database fetch when testimonials table is created
  // const fetchTestimonials = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('testimonials')
  //       .select('*')
  //       .eq('is_active', true)
  //       .order('created_at', { ascending: false })
  //       .limit(10);
  //     
  //     if (data) setTestimonials(data);
  //   } catch (error) {
  //     console.error('Error fetching testimonials:', error);
  //   }
  // };

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
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

  if (testimonials.length === 0) {
    return null;
  }

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
            Real experiences from our valued customers who've chosen Pollux Motors for their automotive needs.
          </p>
        </motion.div>

        {/* Main Testimonial Display - Simplified without photos */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`testimonial-${currentTestimonial}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="p-12 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden">
                {/* Quote Icon */}
                <Quote className="w-16 h-16 text-yellow-500/30 mx-auto mb-8" />
                
                {/* Review Text */}
                <blockquote className="text-xl md:text-2xl leading-relaxed text-gray-200 mb-8 max-w-4xl mx-auto">
                  "{currentData.review}"
                </blockquote>
                
                {/* Customer Info */}
                <div className="flex flex-col items-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{currentData.name}</h3>
                  <div className="flex items-center space-x-4 text-gray-400 mb-4">
                    {currentData.role && <span>{currentData.role}</span>}
                    <span>•</span>
                    <span>{currentData.location}</span>
                      {currentData.verified && (
                      <>
                        <span>•</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                      </>
                      )}
                    </div>
                    
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                        className={`w-6 h-6 ${
                              i < currentData.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  
                  {/* Purchase Details */}
                {(currentData.car_purchased || currentData.purchase_date) && (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto">
                    <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Purchase Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentData.car_purchased && (
                        <div className="text-center">
                        <p className="text-sm text-gray-500">Vehicle</p>
                          <p className="text-white font-medium">{currentData.car_purchased}</p>
                      </div>
                      )}
                      {currentData.purchase_date && (
                        <div className="text-center">
                        <p className="text-sm text-gray-500">Date</p>
                          <p className="text-white font-medium">{currentData.purchase_date}</p>
                      </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-12 max-w-2xl mx-auto">
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