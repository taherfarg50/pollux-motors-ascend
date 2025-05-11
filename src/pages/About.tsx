
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.timeline-item');
    animatedElements.forEach((el) => observer.observe(el));
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="About Pollux Motors" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient max-w-4xl leading-tight">
                Our Story
              </h1>
              <p className="text-gray-300 max-w-xl text-base md:text-lg mt-6">
                From a vision of automotive excellence to a global symbol of luxury innovation — 
                discover the journey of Pollux Motors.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-300 mb-6">
                  At Pollux Motors, we are committed to redefining the luxury automotive experience 
                  through innovative design, cutting-edge technology, and uncompromising performance.
                </p>
                <p className="text-gray-300 mb-6">
                  We strive to create vehicles that not only meet the highest standards of engineering 
                  excellence but also resonate with the desires and aspirations of our discerning customers.
                </p>
                <p className="text-gray-300">
                  Our mission is to push the boundaries of what's possible in automotive design while 
                  maintaining a steadfast commitment to sustainability and responsibility.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shine">
                  <img 
                    src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Pollux Motors Factory" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 glass-card p-6 max-w-xs">
                  <h3 className="text-xl font-bold mb-2">Innovation First</h3>
                  <p className="text-sm text-gray-300">
                    We believe in constantly pushing the boundaries of technology and design to create 
                    vehicles that inspire and excite.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Our Journey</h2>
            
            <div ref={timelineRef} className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700"></div>
              
              {/* Timeline events */}
              <div className="space-y-24">
                <div className="timeline-item opacity-0 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <h3 className="text-2xl font-bold text-pollux-red">2010</h3>
                    <h4 className="text-xl font-bold mb-3">Foundation</h4>
                    <p className="text-gray-300">
                      Pollux Motors was established with a vision to create luxury vehicles that combine 
                      cutting-edge technology with exceptional design.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3" 
                        alt="Company Foundation" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1/2 left-0 md:left-auto md:right-full transform -translate-y-1/2 md:-translate-x-4 w-10 h-10 rounded-full border-4 border-pollux-red bg-background z-10"></div>
                  </div>
                </div>
                
                <div className="timeline-item opacity-0 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2">
                    <h3 className="text-2xl font-bold text-pollux-red">2015</h3>
                    <h4 className="text-xl font-bold mb-3">First Flagship Model</h4>
                    <p className="text-gray-300">
                      The launch of our first flagship model, the Astra GT, which set new standards in the 
                      luxury automotive market and garnered critical acclaim.
                    </p>
                  </div>
                  <div className="relative md:order-1 md:text-right">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3" 
                        alt="First Flagship Model" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1/2 left-0 md:left-full transform -translate-y-1/2 md:-translate-x-6 w-10 h-10 rounded-full border-4 border-pollux-red bg-background z-10"></div>
                  </div>
                </div>
                
                <div className="timeline-item opacity-0 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <h3 className="text-2xl font-bold text-pollux-red">2020</h3>
                    <h4 className="text-xl font-bold mb-3">Global Expansion</h4>
                    <p className="text-gray-300">
                      Expanded operations to 25 countries worldwide, establishing Pollux as a truly global 
                      brand with showrooms in major cities across Europe, Asia, and North America.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1610647752706-3bb12232b3e6?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3" 
                        alt="Global Expansion" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1/2 left-0 md:left-auto md:right-full transform -translate-y-1/2 md:-translate-x-4 w-10 h-10 rounded-full border-4 border-pollux-red bg-background z-10"></div>
                  </div>
                </div>
                
                <div className="timeline-item opacity-0 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2">
                    <h3 className="text-2xl font-bold text-pollux-red">2025</h3>
                    <h4 className="text-xl font-bold mb-3">Future Forward</h4>
                    <p className="text-gray-300">
                      Introduction of our revolutionary electric lineup, combining sustainable mobility 
                      with the performance and luxury that define the Pollux brand.
                    </p>
                  </div>
                  <div className="relative md:order-1 md:text-right">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3" 
                        alt="Future Forward" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1/2 left-0 md:left-full transform -translate-y-1/2 md:-translate-x-6 w-10 h-10 rounded-full border-4 border-pollux-red bg-background z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Leadership Team</h2>
            <p className="text-gray-300 mb-16 text-center max-w-2xl mx-auto">
              Our leadership team brings decades of experience in automotive design, engineering, and innovation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alexandra Reynolds",
                  position: "Chief Executive Officer",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3",
                  bio: "With over 20 years of experience in the automotive industry, Alexandra leads Pollux Motors with a vision for innovation and excellence."
                },
                {
                  name: "Marcus Chen",
                  position: "Chief Design Officer",
                  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3",
                  bio: "Award-winning automotive designer with a passion for creating vehicles that blend aesthetics with cutting-edge technology."
                },
                {
                  name: "Sophia Patel",
                  position: "Chief Technology Officer",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3",
                  bio: "Former aerospace engineer who brings her expertise in advanced materials and propulsion systems to the automotive world."
                }
              ].map((member, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-pollux-red mb-2">{member.position}</p>
                    <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-pollux-dark-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Pollux Family</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Become a part of our journey as we continue to redefine luxury automotive excellence.
              Visit one of our showrooms or schedule a virtual consultation today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-pollux-red hover:bg-red-700 text-white px-6 py-3 text-lg"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button 
                variant="outline"
                className="px-6 py-3 text-lg"
                asChild
              >
                <Link to="/careers">Careers</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
