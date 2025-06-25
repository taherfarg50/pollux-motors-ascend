import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, ArrowRight, Star, Zap, Gauge, Fuel, 
  Calendar, DollarSign, Users, Package, Award,
  ChevronDown, Info, BarChart3, PieChart, TrendingUp,
  Eye, Heart, Share2, Download, Check
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Vehicle data interface
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  year: number;
  category: string;
  specifications: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    topSpeed: string;
    fuelEconomy: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
      wheelbase: number;
      weight: number;
    };
    features: string[];
    safety: string[];
  };
  ratings?: {
    performance: number;
    comfort: number;
    efficiency: number;
    technology: number;
    safety: number;
    value: number;
  };
}

// Sample vehicles data
const availableVehicles: Vehicle[] = [
  {
    id: "luxury-sedan-1",
    name: "Pollux Celestial S-500",
    brand: "Pollux",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1536&auto=format&fit=crop",
    price: 89000,
    year: 2024,
    category: "Luxury Sedan",
    specifications: {
      engine: "4.0L V8 Twin-Turbo",
      power: "429 hp",
      torque: "520 Nm",
      transmission: "9-Speed Automatic",
      acceleration: "4.5s",
      topSpeed: "250 km/h",
      fuelEconomy: "8.4 l/100km",
      dimensions: {
        length: 5050,
        width: 1900,
        height: 1450,
        wheelbase: 3000,
        weight: 1950
      },
      features: [
        "Panoramic Sunroof",
        "Adaptive LED Headlights",
        "Heated & Ventilated Seats",
        "Premium Sound System",
        "Ambient Lighting",
        "Wireless Charging"
      ],
      safety: [
        "Adaptive Cruise Control",
        "Lane Keeping Assist",
        "Blind Spot Monitoring",
        "Automated Emergency Braking",
        "360° Camera System",
        "Night Vision"
      ]
    },
    ratings: {
      performance: 9.2,
      comfort: 9.5,
      efficiency: 7.8,
      technology: 9.0,
      safety: 9.3,
      value: 8.5
    }
  },
  {
    id: "luxury-sedan-2",
    name: "Pollux Astra GT-X",
    brand: "Pollux",
    image: "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=1470&auto=format&fit=crop",
    price: 75000,
    year: 2024,
    category: "Sport Sedan",
    specifications: {
      engine: "3.0L I6 Turbo",
      power: "380 hp",
      torque: "480 Nm",
      transmission: "8-Speed Automatic",
      acceleration: "4.8s",
      topSpeed: "240 km/h",
      fuelEconomy: "7.8 l/100km",
      dimensions: {
        length: 4900,
        width: 1870,
        height: 1420,
        wheelbase: 2950,
        weight: 1850
      },
      features: [
        "Sport Seats",
        "LED Headlights",
        "Heated Seats",
        "Sound System",
        "Ambient Lighting",
        "Wireless Charging"
      ],
      safety: [
        "Cruise Control",
        "Lane Departure Warning",
        "Blind Spot Monitoring",
        "Emergency Braking",
        "Rear Camera",
        "Parking Sensors"
      ]
    },
    ratings: {
      performance: 8.8,
      comfort: 8.2,
      efficiency: 8.5,
      technology: 8.0,
      safety: 8.5,
      value: 9.0
    }
  },
  {
    id: "luxury-suv-1",
    name: "Pollux Zenith X7",
    brand: "Pollux",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop",
    price: 92000,
    year: 2024,
    category: "Luxury SUV",
    specifications: {
      engine: "4.4L V8 Twin-Turbo",
      power: "523 hp",
      torque: "700 Nm",
      transmission: "8-Speed Automatic",
      acceleration: "4.3s",
      topSpeed: "250 km/h",
      fuelEconomy: "10.5 l/100km",
      dimensions: {
        length: 5100,
        width: 2000,
        height: 1700,
        wheelbase: 3070,
        weight: 2250
      },
      features: [
        "Panoramic Sunroof",
        "Adaptive LED Headlights",
        "Heated & Ventilated Seats",
        "Premium Sound System",
        "Ambient Lighting",
        "Wireless Charging",
        "Gesture Control"
      ],
      safety: [
        "Adaptive Cruise Control",
        "Lane Keeping Assist",
        "Blind Spot Monitoring",
        "Automated Emergency Braking",
        "360° Camera System",
        "Night Vision",
        "Cross-Traffic Alert"
      ]
    },
    ratings: {
      performance: 9.5,
      comfort: 9.8,
      efficiency: 7.2,
      technology: 9.5,
      safety: 9.7,
      value: 8.0
    }
  },
  {
    id: "sports-car-1",
    name: "Pollux Nebula GT",
    brand: "Pollux",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop",
    price: 120000,
    year: 2024,
    category: "Sports Car",
    specifications: {
      engine: "4.0L Flat-6 Twin-Turbo",
      power: "650 hp",
      torque: "750 Nm",
      transmission: "8-Speed PDK",
      acceleration: "3.2s",
      topSpeed: "320 km/h",
      fuelEconomy: "11.8 l/100km",
      dimensions: {
        length: 4520,
        width: 1940,
        height: 1260,
        wheelbase: 2450,
        weight: 1540
      },
      features: [
        "Carbon Fiber Roof",
        "Adaptive LED Headlights",
        "Sport Bucket Seats",
        "Premium Sound System",
        "Carbon Fiber Interior Trim",
        "Sport Chronograph"
      ],
      safety: [
        "Adaptive Cruise Control",
        "Lane Keeping Assist",
        "Blind Spot Monitoring",
        "Automated Emergency Braking",
        "Rear Camera",
        "Tire Pressure Monitoring"
      ]
    },
    ratings: {
      performance: 9.9,
      comfort: 7.5,
      efficiency: 6.8,
      technology: 8.5,
      safety: 8.8,
      value: 7.5
    }
  },
  {
    id: "electric-sedan-1",
    name: "Pollux Quantum E",
    brand: "Pollux",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    price: 95000,
    year: 2024,
    category: "Electric Sedan",
    specifications: {
      engine: "Dual Electric Motors",
      power: "580 hp",
      torque: "900 Nm",
      transmission: "Single-Speed",
      acceleration: "3.5s",
      topSpeed: "250 km/h",
      fuelEconomy: "0.0 l/100km",
      dimensions: {
        length: 4970,
        width: 1960,
        height: 1440,
        wheelbase: 2960,
        weight: 2100
      },
      features: [
        "Glass Roof",
        "Adaptive LED Headlights",
        "Heated & Ventilated Seats",
        "Premium Sound System",
        "Ambient Lighting",
        "Wireless Charging",
        "17\" Touchscreen"
      ],
      safety: [
        "Autopilot",
        "Lane Keeping Assist",
        "Blind Spot Monitoring",
        "Automated Emergency Braking",
        "360° Camera System",
        "Parking Sensors",
        "Sentry Mode"
      ]
    },
    ratings: {
      performance: 9.6,
      comfort: 9.0,
      efficiency: 10.0,
      technology: 9.8,
      safety: 9.5,
      value: 8.8
    }
  }
];

// Vehicle Card Component
const VehicleCard: React.FC<{
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (vehicle: Vehicle) => void;
  onRemove?: () => void;
  compact?: boolean;
}> = ({ vehicle, isSelected, onSelect, onRemove, compact = false }) => {
  return (
    <motion.div
      layout
      className={`
        relative rounded-xl border transition-all cursor-pointer overflow-hidden
        ${isSelected 
          ? 'border-pollux-blue bg-pollux-blue/10 shadow-lg' 
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }
        ${compact ? 'p-4' : 'p-6'}
      `}
      onClick={() => onSelect(vehicle)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 p-1 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      )}
      
      <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <Badge className="bg-pollux-gold/20 text-pollux-gold border-0 mb-2">
            {vehicle.category}
          </Badge>
          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
          <p className="text-gray-400 text-sm">{vehicle.brand} • {vehicle.year}</p>
        </div>
        
        {!compact && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Power:</span>
              <span>{vehicle.specifications.power}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">0-100 km/h:</span>
              <span>{vehicle.specifications.acceleration}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-2xl font-bold text-pollux-blue">
            ${vehicle.price.toLocaleString()}
          </div>
          {vehicle.ratings && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-pollux-gold fill-current" />
              <span className="text-sm">
                {(Object.values(vehicle.ratings).reduce((a, b) => a + b, 0) / Object.keys(vehicle.ratings).length).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const VehicleComparisonTool: React.FC = () => {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([availableVehicles[0], availableVehicles[1]]);
  const [availableList, setAvailableList] = useState<Vehicle[]>(availableVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter available vehicles
  const filteredVehicles = availableList.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vehicle.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const notSelected = !selectedVehicles.find(selected => selected.id === vehicle.id);
    
    return matchesSearch && matchesCategory && matchesPrice && notSelected;
  });

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < 4) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
      setShowAddModal(false);
    }
  };

  const removeVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  // Generate comparison data for charts
  const getComparisonData = () => {
    if (!selectedVehicles.length) return [];
    
    const metrics = ['performance', 'comfort', 'efficiency', 'technology', 'safety', 'value'];
    
    return metrics.map(metric => {
      const dataPoint: any = { metric: metric.charAt(0).toUpperCase() + metric.slice(1) };
      selectedVehicles.forEach(vehicle => {
        if (vehicle.ratings) {
          dataPoint[vehicle.name] = vehicle.ratings[metric as keyof typeof vehicle.ratings];
        }
      });
      return dataPoint;
    });
  };

  const getSpecificationComparison = () => {
    const specs = [
      { key: 'power', label: 'Power', unit: '' },
      { key: 'torque', label: 'Torque', unit: '' },
      { key: 'acceleration', label: '0-100 km/h', unit: '' },
      { key: 'topSpeed', label: 'Top Speed', unit: '' },
      { key: 'fuelEconomy', label: 'Fuel Economy', unit: '' }
    ];

    return specs.map(spec => {
      const dataPoint: any = { specification: spec.label };
      selectedVehicles.forEach(vehicle => {
        const value = vehicle.specifications[spec.key as keyof typeof vehicle.specifications];
        // Extract numeric value for comparison
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
        dataPoint[vehicle.name] = numericValue;
      });
      return dataPoint;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 mb-4"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium">VEHICLE COMPARISON</span>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-4">Compare Vehicles</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Compare specifications, features, and performance metrics across multiple vehicles 
          to find the perfect match for your needs.
        </p>
      </div>

      {/* Selected Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {selectedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <VehicleCard
                vehicle={vehicle}
                isSelected={true}
                onSelect={() => {}}
                onRemove={() => removeVehicle(vehicle.id)}
                compact={selectedVehicles.length > 2}
              />
            </motion.div>
          ))}
          
          {/* Add Vehicle Button */}
          {selectedVehicles.length < 4 && (
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-12 h-12 mb-4 group-hover:text-pollux-blue transition-colors" />
              <span className="font-medium">Add Vehicle</span>
              <span className="text-sm text-gray-500 mt-1">Compare up to 4 vehicles</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Tabs */}
      {selectedVehicles.length >= 2 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ratings Radar Chart */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6">Performance Ratings</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getComparisonData()}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis 
                        dataKey="metric" 
                        tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 10]}
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                      />
                      {selectedVehicles.map((vehicle, index) => (
                        <Radar
                          key={vehicle.id}
                          name={vehicle.name}
                          dataKey={vehicle.name}
                          stroke={index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'}
                          fill={index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Price Comparison */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6">Price Comparison</h3>
                
                <div className="space-y-4">
                  {selectedVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'
                          }}
                        />
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-gray-400">{vehicle.category}</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-pollux-blue">
                        ${vehicle.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-pollux-blue/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Price Difference:</span>
                    <span className="font-semibold">
                      ${(Math.max(...selectedVehicles.map(v => v.price)) - Math.min(...selectedVehicles.map(v => v.price))).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications">
            <Card className="glass-premium border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6">Detailed Specifications</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-2 text-gray-400">Specification</th>
                      {selectedVehicles.map(vehicle => (
                        <th key={vehicle.id} className="text-center py-4 px-2 text-white">
                          {vehicle.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'engine', label: 'Engine' },
                      { key: 'power', label: 'Power' },
                      { key: 'torque', label: 'Torque' },
                      { key: 'transmission', label: 'Transmission' },
                      { key: 'acceleration', label: '0-100 km/h' },
                      { key: 'topSpeed', label: 'Top Speed' },
                      { key: 'fuelEconomy', label: 'Fuel Economy' }
                    ].map(spec => (
                      <tr key={spec.key} className="border-b border-white/5">
                        <td className="py-4 px-2 text-gray-400 font-medium">{spec.label}</td>
                        {selectedVehicles.map(vehicle => (
                          <td key={vehicle.id} className="py-4 px-2 text-center">
                            {vehicle.specifications[spec.key as keyof typeof vehicle.specifications]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dimensions Comparison */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Dimensions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="bg-white/5 rounded-lg p-4">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'
                          }}
                        />
                        {vehicle.name}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Length:</span>
                          <span>{vehicle.specifications.dimensions.length}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Width:</span>
                          <span>{vehicle.specifications.dimensions.width}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Height:</span>
                          <span>{vehicle.specifications.dimensions.height}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Weight:</span>
                          <span>{vehicle.specifications.dimensions.weight}kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="space-y-8">
              {/* Features Comparison */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6">Features Comparison</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Comfort & Convenience */}
                  <div>
                    <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-pollux-blue" />
                      Comfort & Convenience
                    </h4>
                    
                    {/* Get all unique features */}
                    {Array.from(new Set(selectedVehicles.flatMap(v => v.specifications.features))).map(feature => (
                      <div key={feature} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm">{feature}</span>
                        <div className="flex gap-2">
                          {selectedVehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="flex items-center gap-1">
                              {vehicle.specifications.features.includes(feature) ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Safety Features */}
                  <div>
                    <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-pollux-gold" />
                      Safety Features
                    </h4>
                    
                    {Array.from(new Set(selectedVehicles.flatMap(v => v.specifications.safety))).map(feature => (
                      <div key={feature} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm">{feature}</span>
                        <div className="flex gap-2">
                          {selectedVehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="flex items-center gap-1">
                              {vehicle.specifications.safety.includes(feature) ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Metrics Bar Chart */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSpecificationComparison()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="specification" 
                        stroke="rgba(255,255,255,0.6)"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.6)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {selectedVehicles.map((vehicle, index) => (
                        <Bar
                          key={vehicle.id}
                          dataKey={vehicle.name}
                          fill={index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'}
                          radius={[2, 2, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Value Analysis */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6">Value Analysis</h3>
                
                <div className="space-y-6">
                  {selectedVehicles.map((vehicle, index) => {
                    const avgRating = vehicle.ratings ? 
                      Object.values(vehicle.ratings).reduce((a, b) => a + b, 0) / Object.keys(vehicle.ratings).length : 0;
                    const valueScore = (avgRating / vehicle.price) * 100000; // Normalized value score
                    
                    return (
                      <div key={vehicle.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ 
                                backgroundColor: index === 0 ? '#1937E3' : index === 1 ? '#D4AF37' : index === 2 ? '#10B981' : '#F59E0B'
                              }}
                            />
                            <span className="font-medium">{vehicle.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{valueScore.toFixed(1)}</div>
                            <div className="text-xs text-gray-400">Value Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Average Rating</div>
                            <div className="font-semibold">{avgRating.toFixed(1)}/10</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Price</div>
                            <div className="font-semibold">${vehicle.price.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="glass-premium border-white/10 max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Add Vehicle to Comparison</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAddModal(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex gap-4 mt-4">
                    <Input
                      placeholder="Search vehicles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="sports">Sports Car</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVehicles.map(vehicle => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={false}
                        onSelect={addVehicle}
                        compact
                      />
                    ))}
                  </div>
                  
                  {filteredVehicles.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No vehicles found matching your criteria</p>
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleComparisonTool; 