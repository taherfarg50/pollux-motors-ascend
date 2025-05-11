
import { useEffect, useRef } from 'react';

const AboutSection = () => {
  const countersRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.5 }
    );
    
    if (countersRef.current) {
      observer.observe(countersRef.current);
    }
    
    return () => {
      if (countersRef.current) observer.unobserve(countersRef.current);
    };
  }, []);
  
  const startCounting = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 16ms per frame (approx 60fps)
      
      let current = 0;
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toString();
        }
      };
      
      updateCounter();
    });
  };
  
  return (
    <section id="about" className="py-24 relative bg-pollux-dark-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
            About Pollux Motors
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold">
            Driving Innovation Forward
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Pollux Motors Facility" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 glass-card p-4 rounded-lg">
                <span className="text-pollux-red font-medium">Since 2010</span>
                <h4 className="text-xl font-bold mt-1">Excellence in Engineering</h4>
              </div>
            </div>
          </div>
          
          <div>
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
            
            <div ref={countersRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="counter text-4xl font-bold mb-2" data-target="15">0</div>
                <p className="text-sm text-gray-400">Years of Excellence</p>
              </div>
              <div className="text-center">
                <div className="counter text-4xl font-bold mb-2" data-target="25">0</div>
                <p className="text-sm text-gray-400">Global Markets</p>
              </div>
              <div className="text-center">
                <div className="counter text-4xl font-bold mb-2" data-target="12">0</div>
                <p className="text-sm text-gray-400">Car Models</p>
              </div>
              <div className="text-center">
                <div className="counter text-4xl font-bold mb-2" data-target="150000">0</div>
                <p className="text-sm text-gray-400">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
