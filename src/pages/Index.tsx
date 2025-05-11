
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedCars from '@/components/FeaturedCars';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }
    
    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  const testimonials = [
    {
      quote: "Driving a Pollux is unlike any other automotive experience. The blend of performance, comfort, and cutting-edge technology is simply unmatched in the luxury market.",
      author: "James Wilson",
      position: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      quote: "The attention to detail in every aspect of my Astra GT-X is remarkable. From the hand-stitched interior to the responsive driving dynamics, it exceeds all expectations.",
      author: "Emily Chen",
      position: "Design Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      quote: "As someone who values both performance and environmental responsibility, the Celestial S-500's hybrid system offers the perfect balance without compromising on the luxury experience.",
      author: "Michael Thompson",
      position: "Environmental Consultant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCars />
        
        {/* Innovation Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-background to-transparent"></div>
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
                Innovation at the Core
              </h2>
              <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
                The Technology Behind Pollux
              </h3>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Our vehicles are powered by the latest advancements in automotive technology, 
                delivering exceptional performance without compromising on sustainability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Electric Powertrains",
                  description: "Advanced electric drivetrains that deliver instant torque and exhilarating performance with zero emissions.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17h10v-4H7v4Z"></path>
                      <path d="M14 13v-2"></path>
                      <path d="M10 13v-2"></path>
                      <path d="M7 7h10v4h-6.777l1.555-2.777L8.888 7H7v4"></path>
                      <path d="M5 5v14"></path>
                      <path d="M19 5v14"></path>
                    </svg>
                  )
                },
                {
                  title: "Smart Connectivity",
                  description: "Seamless integration with your digital life, providing intuitive control and personalized experiences.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path>
                      <path d="M12 18h0"></path>
                    </svg>
                  )
                },
                {
                  title: "Advanced Driver Assistance",
                  description: "Cutting-edge safety systems that work in harmony to provide protection and peace of mind on every journey.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M12 8v1"></path>
                      <path d="M12 15v1"></path>
                      <path d="M16.24 7.76l-.7.7"></path>
                      <path d="M8.46 15.54l-.7.7"></path>
                      <path d="M16.24 16.24l-.7-.7"></path>
                      <path d="M8.46 8.46l-.7-.7"></path>
                      <path d="M18 12h1"></path>
                      <path d="M5 12h1"></path>
                      <path d="m3 7 3 3"></path>
                      <path d="M3 17h6"></path>
                      <path d="m15 17 6-6-6-6-1 4-5 2 5 2 1 4Z"></path>
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card p-8 rounded-lg transition-all duration-500 hover:translate-y-[-10px]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button
                className="bg-pollux-red hover:bg-red-700 text-white"
                asChild
              >
                <Link to="/technology">
                  Discover Our Technology
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section 
          ref={testimonialsRef}
          className={`py-24 bg-pollux-dark-gray relative overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
                Customer Experiences
              </h2>
              <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold">
                What Our Clients Say
              </h3>
            </div>
            
            <Carousel className="max-w-3xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="glass-card p-8 md:p-10 text-center">
                      <div className="mb-6">
                        <svg className="w-10 h-10 text-pollux-red mx-auto" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.41-3 .96-3.22 1.83-5.08 3.47-5.91.02-.01.03-.03.04-.05.03-.04.01-.08-.03-.11-.04-.02-.08-.03-.11-.01-.74.22-1.37.74-1.86 1.58-.39.66-.67 1.49-.84 2.5-.16.98-.23 1.83-.23 2.53 0 .55.08 1.13.25 1.71.17.59.49 1.09.95 1.51.48.42 1.06.63 1.73.63.79 0 1.39-.23 1.81-.7.41-.47.62-1.09.62-1.84zm10.03 0c0-.88-.23-1.618-.69-2.217-.326-.41-.77-.683-1.327-.812-.56-.128-1.07-.137-1.54-.028-.16-.95.1-1.94.41-3 .96-3.22 1.83-5.08 3.47-5.91.02-.01.03-.03.04-.05.03-.04.01-.08-.03-.11-.04-.02-.08-.03-.12-.01-.73.22-1.37.74-1.86 1.58-.39.66-.67 1.49-.84 2.5-.16.98-.23 1.83-.23 2.53 0 .55.08 1.13.25 1.71.17.59.49 1.09.95 1.51.48.42 1.06.63 1.73.63.79 0 1.39-.23 1.81-.7.41-.47.62-1.09.62-1.84z" />
                        </svg>
                      </div>
                      <p className="text-xl italic mb-8">{testimonial.quote}</p>
                      <div className="flex items-center justify-center">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author} 
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div className="text-left">
                          <h4 className="font-bold">{testimonial.author}</h4>
                          <p className="text-gray-400 text-sm">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex justify-center space-x-4">
                <CarouselPrevious className="relative inset-0 translate-y-0 !bg-white/5 border-gray-700 hover:bg-white/10 text-white" />
                <CarouselNext className="relative inset-0 translate-y-0 !bg-white/5 border-gray-700 hover:bg-white/10 text-white" />
              </div>
            </Carousel>
            
            <div className="mt-16 text-center">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10"
                asChild
              >
                <Link to="/testimonials">
                  View All Testimonials
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
