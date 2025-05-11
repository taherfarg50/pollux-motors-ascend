
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const Models3D = () => {
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedColor, setSelectedColor] = useState('red');
  
  const models = [
    {
      id: 1,
      name: "Astra GT-X",
      description: "Our flagship sports car with unparalleled performance and cutting-edge design.",
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3",
      colors: [
        { name: "Crimson Red", hex: "#E31937" },
        { name: "Midnight Black", hex: "#0A0A0A" },
        { name: "Pearl White", hex: "#F5F5F5" },
        { name: "Cobalt Blue", hex: "#0047AB" }
      ]
    },
    {
      id: 2,
      name: "Celestial S-500",
      description: "Luxury sedan that combines elegant design with state-of-the-art technology.",
      image: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      colors: [
        { name: "Midnight Blue", hex: "#2C3E50" },
        { name: "Silver Frost", hex: "#E0E0E0" },
        { name: "Emerald Green", hex: "#046A38" },
        { name: "Champagne Gold", hex: "#F7E7CE" }
      ]
    },
    {
      id: 3,
      name: "Atlas SUV-X",
      description: "A premium SUV designed for adventure without compromising on luxury.",
      image: "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      colors: [
        { name: "Graphite Gray", hex: "#3C4142" },
        { name: "Desert Sand", hex: "#EDC9AF" },
        { name: "Arctic White", hex: "#F5F5F5" },
        { name: "Forest Green", hex: "#2C5E1A" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover opacity-70"
            >
              <source 
                src="https://cdn.coverr.co/videos/coverr-car-in-motion-5722/1080p.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center">
              Experience in 3D
            </h1>
            <p className="text-gray-300 max-w-xl text-center px-4">
              Explore our vehicles in immersive 3D and customize them to your preferences.
            </p>
          </div>
        </section>
        
        {/* 3D Model Viewer Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Sidebar - Model Selection */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Choose a Model</h3>
                <div className="space-y-4">
                  {models.map((model, index) => (
                    <Card 
                      key={model.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedModel === index 
                          ? 'border-pollux-red ring-2 ring-pollux-red/50' 
                          : 'hover:border-white/30'
                      }`}
                      onClick={() => setSelectedModel(index)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img 
                            src={model.image} 
                            alt={model.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">{model.name}</h4>
                          <p className="text-sm text-gray-400">Click to view</p>
                        </div>
                        {selectedModel === index && (
                          <ChevronRight className="ml-auto h-5 w-5 text-pollux-red" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Color Options</h3>
                  <div className="flex flex-wrap gap-3">
                    {models[selectedModel].colors.map((color) => (
                      <button
                        key={color.hex}
                        className={`w-10 h-10 rounded-full transition-all duration-300 ${
                          selectedColor === color.name.toLowerCase().replace(/\s+/g, '-')
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                            : ''
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.name.toLowerCase().replace(/\s+/g, '-'))}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Model Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium">{models[selectedModel].name}</h4>
                      <p className="text-gray-400 mt-2">
                        {models[selectedModel].description}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-pollux-red hover:bg-red-700"
                    >
                      View Full Specifications
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      Configure & Order
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 3D Viewer Area */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-lg p-6 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    {/* This is where a real 3D model would be shown using Three.js or similar */}
                    <div className="max-w-2xl mx-auto shine rounded-lg overflow-hidden">
                      <img 
                        src={models[selectedModel].image} 
                        alt={models[selectedModel].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-6 text-gray-400">
                      In a real implementation, this would be an interactive 3D model using Three.js or React Three Fiber.
                      <br/>
                      The model would respond to controls and color changes in real-time.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-400">Rotate</p>
                    <div className="mt-2 flex justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 2v6h-6"></path>
                          <path d="M2.5 12.5l5-5c1.7-1.7 4.3-1.7 6 0 1.7 1.7 1.7 4.3 0 6l-5 5c-1.7 1.7-4.3 1.7-6 0-1.7-1.7-1.7-4.3 0-6z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-400">Zoom</p>
                    <div className="mt-2 flex justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-400">Pan</p>
                    <div className="mt-2 flex justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="5 9 2 12 5 15"></polyline>
                          <polyline points="9 5 12 2 15 5"></polyline>
                          <polyline points="15 19 12 22 9 19"></polyline>
                          <polyline points="19 9 22 12 19 15"></polyline>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <line x1="12" y1="2" x2="12" y2="22"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-400">Reset</p>
                    <div className="mt-2 flex justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 2v6h6"></path>
                          <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                          <path d="M21 22v-6h-6"></path>
                          <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Highlight */}
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              Interactive Experience
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "360° Rotation",
                  description: "Explore every angle of our vehicles with a fully interactive 3D model that you can rotate in any direction.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6"></path>
                      <path d="M2.5 12.5l5-5c1.7-1.7 4.3-1.7 6 0 1.7 1.7 1.7 4.3 0 6l-5 5c-1.7 1.7-4.3 1.7-6 0-1.7-1.7-1.7-4.3 0-6z"></path>
                    </svg>
                  )
                },
                {
                  title: "Dynamic Color Options",
                  description: "See your vehicle in different colors with real-time rendering to help you choose your perfect finish.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a10 10 10 0 1 10 10"></path>
                      <path d="M12 12V2"></path>
                      <path d="m7.1 7.1 9.9 9.9"></path>
                    </svg>
                  )
                },
                {
                  title: "Interior Exploration",
                  description: "Step inside our vehicles and experience the luxury interior with detailed views of every feature.",
                  icon: (
                    <svg className="w-12 h-12 text-pollux-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9h18v10H3z"></path>
                      <path d="M21 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4"></path>
                      <circle cx="12" cy="14" r="3"></circle>
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8 rounded-lg transition-all duration-500 hover:translate-y-[-10px]"
                >
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Models3D;
