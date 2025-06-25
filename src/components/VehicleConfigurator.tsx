import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Settings, 
  Zap, 
  Shield, 
  Music, 
  Car,
  Eye,
  Sparkles,
  RotateCcw,
  Share2,
  Download,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { log } from '@/utils/logger';

interface ConfiguratorProps {
  carId?: number;
  onConfigurationChange?: (config: VehicleConfiguration) => void;
}

interface VehicleConfiguration {
  carId: number;
  color: string;
  wheels: string;
  interior: string;
  performance: string;
  features: string[];
  estimatedPrice: number;
}

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'standard' | 'metallic' | 'premium';
  price: number;
}

interface FeatureOption {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'comfort' | 'technology' | 'safety';
  price: number;
  icon: React.ReactNode;
}

// 3D Car Model Component
const CarModel = ({ color, wheelType, ...props }: any) => {
  const groupRef = useRef<any>();
  const { scene } = useGLTF('/media/models/luxury_sedan.glb');
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  useEffect(() => {
    if (scene) {
      // Apply color to the car model
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (child.name.includes('Body')) {
            child.material.color.set(color);
          }
        }
      });
    }
  }, [color, scene]);

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} scale={[2, 2, 2]} />
    </group>
  );
};

const VehicleConfigurator: React.FC<ConfiguratorProps> = ({ 
  carId = 1, 
  onConfigurationChange 
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<VehicleConfiguration>({
    carId,
    color: '#1a1a1a',
    wheels: 'sport',
    interior: 'black-leather',
    performance: 'standard',
    features: [],
    estimatedPrice: 85000
  });

  // Color options
  const colorOptions: ColorOption[] = [
    { id: 'obsidian-black', name: 'Obsidian Black', hex: '#1a1a1a', category: 'standard', price: 0 },
    { id: 'pearl-white', name: 'Pearl White', hex: '#f8f8ff', category: 'standard', price: 0 },
    { id: 'silver-metallic', name: 'Silver Metallic', hex: '#c0c0c0', category: 'metallic', price: 1500 },
    { id: 'midnight-blue', name: 'Midnight Blue', hex: '#191970', category: 'metallic', price: 1500 },
    { id: 'crimson-red', name: 'Crimson Red', hex: '#dc143c', category: 'premium', price: 3000 },
    { id: 'emerald-green', name: 'Emerald Green', hex: '#50c878', category: 'premium', price: 3000 },
    { id: 'champagne-gold', name: 'Champagne Gold', hex: '#d4af37', category: 'premium', price: 4500 },
    { id: 'carbon-fiber', name: 'Carbon Fiber', hex: '#2c2c2c', category: 'premium', price: 8000 }
  ];

  // Feature options
  const featureOptions: FeatureOption[] = [
    {
      id: 'sport-package',
      name: 'Sport Performance Package',
      description: 'Enhanced suspension, sport exhaust, performance brakes',
      category: 'performance',
      price: 12000,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'premium-audio',
      name: 'Premium Audio System',
      description: 'Harman Kardon surround sound with 20 speakers',
      category: 'technology',
      price: 3500,
      icon: <Music className="w-5 h-5" />
    },
    {
      id: 'safety-plus',
      name: 'Advanced Safety Package',
      description: 'Adaptive cruise control, lane keeping assist, night vision',
      category: 'safety',
      price: 4200,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'comfort-package',
      name: 'Executive Comfort Package',
      description: 'Massage seats, ambient lighting, premium climate control',
      category: 'comfort',
      price: 6800,
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const wheelOptions = [
    { id: 'standard', name: '18" Standard Alloy', price: 0 },
    { id: 'sport', name: '20" Sport Wheels', price: 2500 },
    { id: 'performance', name: '21" Performance', price: 4500 },
    { id: 'carbon', name: '22" Carbon Fiber', price: 8000 }
  ];

  const interiorOptions = [
    { id: 'black-leather', name: 'Black Leather', price: 0 },
    { id: 'beige-leather', name: 'Beige Leather', price: 1200 },
    { id: 'red-leather', name: 'Red Leather', price: 2500 },
    { id: 'carbon-alcantara', name: 'Carbon Alcantara', price: 4500 }
  ];

  // Update configuration and price
  const updateConfiguration = (updates: Partial<VehicleConfiguration>) => {
    const newConfig = { ...configuration, ...updates };
    
    // Calculate estimated price
    let price = 85000; // Base price
    
    // Add color price
    const selectedColor = colorOptions.find(c => c.hex === newConfig.color);
    if (selectedColor) price += selectedColor.price;
    
    // Add wheel price
    const selectedWheels = wheelOptions.find(w => w.id === newConfig.wheels);
    if (selectedWheels) price += selectedWheels.price;
    
    // Add interior price
    const selectedInterior = interiorOptions.find(i => i.id === newConfig.interior);
    if (selectedInterior) price += selectedInterior.price;
    
    // Add feature prices
    newConfig.features.forEach(featureId => {
      const feature = featureOptions.find(f => f.id === featureId);
      if (feature) price += feature.price;
    });
    
    newConfig.estimatedPrice = price;
    setConfiguration(newConfig);
    onConfigurationChange?.(newConfig);
  };

  const handleColorSelect = (color: ColorOption) => {
    updateConfiguration({ color: color.hex });
    log.info('Color selected', { colorId: color.id, colorName: color.name }, 'VehicleConfigurator');
  };

  const handleFeatureToggle = (featureId: string) => {
    const features = configuration.features.includes(featureId)
      ? configuration.features.filter(f => f !== featureId)
      : [...configuration.features, featureId];
    
    updateConfiguration({ features });
  };

  const handleReset = () => {
    updateConfiguration({
      color: '#1a1a1a',
      wheels: 'sport',
      interior: 'black-leather',
      performance: 'standard',
      features: [],
      estimatedPrice: 85000
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Custom Vehicle Configuration',
        text: `Check out my custom car configuration! Estimated price: $${configuration.estimatedPrice.toLocaleString()}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      log.info('Configuration shared', { configId: configuration.carId }, 'VehicleConfigurator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Vehicle Configurator
          </h1>
          <p className="text-gray-400 text-lg">Design your perfect luxury vehicle</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-black/40 border-gray-700 backdrop-blur-md">
              <div className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.4} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                  <CarModel color={configuration.color} wheelType={configuration.wheels} />
                  <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
                  <Environment preset="night" />
                </Canvas>
              </div>
              
              {/* 3D Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    <Eye className="w-3 h-3 mr-1" />
                    360° View
                  </Badge>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    <Car className="w-3 h-3 mr-1" />
                    Real-time Preview
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>

            {/* Price Summary */}
            <Card className="p-6 bg-black/40 border-gray-700 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Estimated Price</h3>
                  <p className="text-sm text-gray-400">Includes all selected options</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient-to-r from-blue-400 to-purple-400">
                    ${configuration.estimatedPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-400">Starting from $85,000</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Configure & Order
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-black/40 border-gray-700 backdrop-blur-md">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                  <TabsTrigger value="colors" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="wheels" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Wheels
                  </TabsTrigger>
                  <TabsTrigger value="interior" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Interior
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Features
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Exterior Colors</h3>
                    
                    {['standard', 'metallic', 'premium'].map(category => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                          {category} Colors
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                          {colorOptions
                            .filter(color => color.category === category)
                            .map(color => (
                              <motion.button
                                key={color.id}
                                onClick={() => handleColorSelect(color)}
                                className={`relative group p-4 rounded-xl border-2 transition-all ${
                                  configuration.color === color.hex
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div
                                  className="w-8 h-8 rounded-full mx-auto mb-2 shadow-lg"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div className="text-xs font-medium text-center">
                                  {color.name}
                                </div>
                                {color.price > 0 && (
                                  <div className="text-xs text-gray-400 text-center">
                                    +${color.price.toLocaleString()}
                                  </div>
                                )}
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="wheels" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Wheel Options</h3>
                    <div className="space-y-3">
                      {wheelOptions.map(wheel => (
                        <motion.button
                          key={wheel.id}
                          onClick={() => updateConfiguration({ wheels: wheel.id })}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            configuration.wheels === wheel.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{wheel.name}</div>
                              {wheel.price > 0 && (
                                <div className="text-sm text-gray-400">
                                  +${wheel.price.toLocaleString()}
                                </div>
                              )}
                            </div>
                            {configuration.wheels === wheel.id && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interior" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Interior Options</h3>
                    <div className="space-y-3">
                      {interiorOptions.map(interior => (
                        <motion.button
                          key={interior.id}
                          onClick={() => updateConfiguration({ interior: interior.id })}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            configuration.interior === interior.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{interior.name}</div>
                              {interior.price > 0 && (
                                <div className="text-sm text-gray-400">
                                  +${interior.price.toLocaleString()}
                                </div>
                              )}
                            </div>
                            {configuration.interior === interior.id && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Features</h3>
                    <div className="space-y-3">
                      {featureOptions.map(feature => (
                        <motion.button
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            configuration.features.includes(feature.id)
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-blue-400">
                              {feature.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{feature.name}</div>
                              <div className="text-sm text-gray-400 mt-1">
                                {feature.description}
                              </div>
                              <div className="text-sm text-gray-300 mt-1">
                                +${feature.price.toLocaleString()}
                              </div>
                            </div>
                            {configuration.features.includes(feature.id) && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VehicleConfigurator; 