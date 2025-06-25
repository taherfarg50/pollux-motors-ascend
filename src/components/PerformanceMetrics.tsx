import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gauge, Zap, Fuel, Battery, 
  TrendingUp, BarChart3, Activity, Target, 
  Play, Pause, RotateCcw, Settings, Info
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

// Performance data interfaces
interface PerformanceData {
  acceleration: Array<{ time: number; speed: number }>;
  powerCurve: Array<{ rpm: number; power: number; torque: number }>;
  fuelEfficiency: { city: number; highway: number; combined: number };
  drivingModes: Array<{ 
    mode: string; 
    power: number; 
    response: number; 
    efficiency: number;
    description?: string;
  }>;
}

interface VehicleMetrics {
  name: string;
  data: PerformanceData;
  specs?: {
    topSpeed: number;
    acceleration: string;
    power: string;
    torque: string;
    weight: number;
    engine: string;
  };
}

// Animated Gauge Component
const AnimatedGauge: React.FC<{
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}> = ({ value, max, label, unit, color, size = 120 }) => {
  const percentage = (value / max) * 100;
  const strokeDasharray = `${percentage * 2.51} 251`;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 251 - (percentage * 2.51) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-2xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-gray-400">{unit}</div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-white">{label}</div>
      </div>
    </div>
  );
};

// Enhanced Speedometer Component
const SpeedometerGauge: React.FC<{
  speed: number;
  maxSpeed: number;
  animated?: boolean;
}> = ({ speed, maxSpeed, animated = true }) => {
  const angle = (speed / maxSpeed) * 180 - 90;
  
  return (
    <div className="relative w-64 h-32 mx-auto">
      <svg width="256" height="128" viewBox="0 0 256 128" className="absolute inset-0">
        {/* Speedometer arc */}
        <path
          d="M 20 128 A 108 108 0 0 1 236 128"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="8"
        />
        
        {/* Speed zones */}
        <path
          d="M 20 128 A 108 108 0 0 0 128 20"
          fill="none"
          stroke="#10B981"
          strokeWidth="6"
        />
        <path
          d="M 128 20 A 108 108 0 0 0 236 128"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="6"
        />
        
        {/* Needle */}
        <motion.line
          x1="128"
          y1="128"
          x2="128"
          y2="40"
          stroke="#DC2626"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: animated ? angle : -90 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "128px 128px" }}
        />
        
        {/* Center dot */}
        <circle
          cx="128"
          cy="128"
          r="8"
          fill="#DC2626"
        />
        
        {/* Speed markings */}
        {Array.from({ length: 7 }, (_, i) => {
          const markAngle = (i * 30) - 90;
          const markSpeed = (i * maxSpeed) / 6;
          const x1 = 128 + 100 * Math.cos((markAngle * Math.PI) / 180);
          const y1 = 128 + 100 * Math.sin((markAngle * Math.PI) / 180);
          const x2 = 128 + 85 * Math.cos((markAngle * Math.PI) / 180);
          const y2 = 128 + 85 * Math.sin((markAngle * Math.PI) / 180);
          
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
              />
              <text
                x={128 + 75 * Math.cos((markAngle * Math.PI) / 180)}
                y={128 + 75 * Math.sin((markAngle * Math.PI) / 180)}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.8)"
                className="text-xs"
                dy="3"
              >
                {Math.round(markSpeed)}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Digital display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-lg">
        <div className="text-center">
          <motion.div 
            className="text-3xl font-bold text-white"
            key={speed}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {speed}
          </motion.div>
          <div className="text-xs text-gray-400">km/h</div>
        </div>
      </div>
    </div>
  );
};

const PerformanceMetrics: React.FC<{ vehicle?: VehicleMetrics }> = ({ 
  vehicle = {
    name: "Pollux Celestial S-500",
    data: {
      acceleration: [
        { time: 0, speed: 0 },
        { time: 1, speed: 28 },
        { time: 2, speed: 56 },
        { time: 3, speed: 84 },
        { time: 4, speed: 100 },
        { time: 4.5, speed: 112 },
        { time: 6, speed: 140 },
        { time: 8, speed: 180 },
        { time: 10, speed: 220 },
        { time: 12, speed: 250 }
      ],
      powerCurve: [
        { rpm: 1000, power: 150, torque: 480 },
        { rpm: 1500, power: 200, torque: 520 },
        { rpm: 2000, power: 280, torque: 550 },
        { rpm: 2500, power: 350, torque: 580 },
        { rpm: 3000, power: 420, torque: 600 },
        { rpm: 3500, power: 480, torque: 620 },
        { rpm: 4000, power: 520, torque: 640 },
        { rpm: 4500, power: 550, torque: 620 },
        { rpm: 5000, power: 580, torque: 600 },
        { rpm: 5500, power: 600, torque: 580 },
        { rpm: 6000, power: 590, torque: 560 },
        { rpm: 6500, power: 570, torque: 540 }
      ],
      fuelEfficiency: {
        city: 11.2,
        highway: 6.8,
        combined: 8.4
      },
      drivingModes: [
        { mode: "Eco", power: 70, response: 50, efficiency: 95, description: "Maximum fuel efficiency" },
        { mode: "Comfort", power: 85, response: 70, efficiency: 80, description: "Balanced performance and comfort" },
        { mode: "Sport", power: 95, response: 90, efficiency: 60, description: "Enhanced performance and dynamics" },
        { mode: "Track", power: 100, response: 100, efficiency: 40, description: "Maximum performance for track use" }
      ]
    },
    specs: {
      topSpeed: 250,
      acceleration: "4.2s",
      power: "580 HP",
      torque: "640 Nm",
      weight: 1850,
      engine: "4.0L V8 Twin-Turbo"
    }
  }
}) => {
  const [activeMode, setActiveMode] = useState('Comfort');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Acceleration simulation
  useEffect(() => {
    if (simulationRunning) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= 12) {
            setSimulationRunning(false);
            return 0;
          }
          
          // Find corresponding speed for current time
          const dataPoint = vehicle.data.acceleration.find(point => 
            Math.abs(point.time - newTime) < 0.5
          );
          
          if (dataPoint) {
            setCurrentSpeed(dataPoint.speed);
          }
          
          return newTime;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [simulationRunning, vehicle.data.acceleration]);

  const resetSimulation = () => {
    setSimulationRunning(false);
    setCurrentTime(0);
    setCurrentSpeed(0);
  };

  const currentModeData = vehicle.data.drivingModes.find(mode => mode.mode === activeMode);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pollux-blue/10 text-pollux-blue mb-4"
        >
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">PERFORMANCE ANALYTICS</span>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-4">Vehicle Performance Metrics</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore detailed performance characteristics, acceleration curves, and driving dynamics 
          through interactive visualizations and real-time simulations.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="acceleration">Acceleration</TabsTrigger>
          <TabsTrigger value="power">Power & Torque</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Key Metrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Gauges */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Performance Overview
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <AnimatedGauge
                    value={580}
                    max={700}
                    label="Power"
                    unit="HP"
                    color="#1937E3"
                  />
                  <AnimatedGauge
                    value={640}
                    max={800}
                    label="Torque"
                    unit="Nm"
                    color="#D4AF37"
                  />
                  <AnimatedGauge
                    value={250}
                    max={300}
                    label="Top Speed"
                    unit="km/h"
                    color="#10B981"
                  />
                  <AnimatedGauge
                    value={4.2}
                    max={10}
                    label="0-100 km/h"
                    unit="sec"
                    color="#F59E0B"
                  />
                </div>
              </Card>

              {/* Driving Modes */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Driving Modes
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.data.drivingModes.map((mode, index) => (
                    <motion.button
                      key={mode.mode}
                      onClick={() => setActiveMode(mode.mode)}
                      className={`
                        p-4 rounded-lg border transition-all text-left
                        ${activeMode === mode.mode
                          ? 'border-pollux-blue bg-pollux-blue/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{mode.mode}</h4>
                        {activeMode === mode.mode && (
                          <Badge className="bg-pollux-blue/20 text-pollux-blue border-0 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      
                      {mode.description && (
                        <p className="text-sm text-gray-400 mb-3">{mode.description}</p>
                      )}
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-400">Power</div>
                          <div className="font-semibold">{mode.power}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Response</div>
                          <div className="font-semibold">{mode.response}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Efficiency</div>
                          <div className="font-semibold">{mode.efficiency}%</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Live Speedometer */}
            <div className="space-y-6">
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Live Simulation
                </h3>
                
                <SpeedometerGauge
                  speed={currentSpeed}
                  maxSpeed={280}
                  animated={simulationRunning}
                />
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span>{currentTime.toFixed(1)}s</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSimulationRunning(!simulationRunning)}
                      className="flex-1 bg-pollux-blue hover:bg-pollux-blue/90"
                      disabled={simulationRunning && currentTime >= 12}
                    >
                      {simulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      size="icon"
                      className="border-white/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Vehicle Specs */}
              <Card className="glass-premium border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                
                <div className="space-y-3">
                  {vehicle.specs && Object.entries(vehicle.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Acceleration Tab */}
        <TabsContent value="acceleration">
          <Card className="glass-premium border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-6">Acceleration Analysis</h3>
            
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vehicle.data.acceleration}>
                  <defs>
                    <linearGradient id="accelerationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1937E3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1937E3" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.6)"
                    label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.6)"
                    label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#1937E3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#accelerationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-pollux-blue">4.2s</div>
                <div className="text-sm text-gray-400">0-100 km/h</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-pollux-gold">8.7s</div>
                <div className="text-sm text-gray-400">0-200 km/h</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">250</div>
                <div className="text-sm text-gray-400">Top Speed (km/h)</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Power & Torque Tab */}
        <TabsContent value="power">
          <Card className="glass-premium border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-6">Power & Torque Curves</h3>
            
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vehicle.data.powerCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="rpm" 
                    stroke="rgba(255,255,255,0.6)"
                    label={{ value: 'RPM', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.6)"
                    label={{ value: 'Power (HP) / Torque (Nm)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#1937E3"
                    strokeWidth={3}
                    dot={{ fill: '#1937E3', strokeWidth: 2, r: 4 }}
                    name="Power (HP)"
                  />
                  <Line
                    type="monotone"
                    dataKey="torque"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                    name="Torque (Nm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pollux-blue">580 HP</div>
                <div className="text-sm text-gray-400">Max Power @ 5,500 RPM</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pollux-gold">640 Nm</div>
                <div className="text-sm text-gray-400">Max Torque @ 4,000 RPM</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Efficiency Tab */}
        <TabsContent value="efficiency">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-premium border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6">Fuel Efficiency</h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'City', efficiency: vehicle.data.fuelEfficiency.city },
                    { name: 'Highway', efficiency: vehicle.data.fuelEfficiency.highway },
                    { name: 'Combined', efficiency: vehicle.data.fuelEfficiency.combined }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="efficiency" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="glass-premium border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6">Mode Comparison</h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="20%"
                    outerRadius="90%"
                    data={vehicle.data.drivingModes}
                    startAngle={90}
                    endAngle={450}
                  >
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      dataKey="efficiency"
                      fill="#1937E3"
                    />
                    <Legend 
                      iconSize={10}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics; 