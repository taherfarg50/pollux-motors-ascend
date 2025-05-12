
import { useEffect, useRef } from 'react';
import StatsCounter from './StatsCounter';
import { Separator } from '@/components/ui/separator';

const AboutSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const stats = [
    {
      label: "Years of Excellence",
      value: 15
    },
    {
      label: "Global Markets",
      value: 25
    },
    {
      label: "Car Models",
      value: 12
    },
    {
      label: "Happy Customers",
      value: 150000,
      suffix: "+"
    }
  ];
  
  return (
    <section id="about" className="py-24 relative bg-pollux-dark-gray overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pollux-red/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pollux-red/30 to-transparent"></div>
      <div className="absolute inset-0 smoke opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
            About Pollux Motors
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold">
            Driving Innovation Forward
          </h3>
          <Separator className="separator-glow w-24 mx-auto mt-4" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Pollux Motors Facility" 
                className="w-full h-full object-cover hover-scale"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 glass-card p-4 rounded-lg animate-float">
                <span className="text-pollux-red font-medium">Since 2010</span>
                <h4 className="text-xl font-bold mt-1">Excellence in Engineering</h4>
              </div>
            </div>
          </div>
          
          <div ref={contentRef}>
            <h3 className="text-3xl font-bold mb-6">Redefining the Future of Mobility</h3>
            <p className="text-gray-300 mb-6">
              Founded in 2010, Pollux Motors has established itself as a pioneer in the luxury automotive 
              industry. Our commitment to innovation, performance, and sustainability drives everything 
              we do. We combine cutting-edge technology with unparalleled craftsmanship to create 
              vehicles that deliver exceptional driving experiences.
            </p>
            <p className="text-gray-300 mb-8">
              At Pollux, we believe that luxury and responsibility can coexist. That's why we invest 
              heavily in sustainable manufacturing practices and alternative power technologies, 
              ensuring our carbon footprint is minimized without compromising on performance or style.
            </p>
            
            <StatsCounter stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
