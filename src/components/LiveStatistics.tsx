import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Car, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  Heart, 
  Zap, 
  Globe,
  Star,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend: number;
  isLive: boolean;
}

interface LiveMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'positive' | 'neutral' | 'negative';
}

const LiveStatistics: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Update time every second for live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Main statistics with animated counters
  const statistics: StatItem[] = [
    {
      id: 'vehicles',
      label: 'Premium Vehicles',
      value: 15847,
      suffix: '+',
      prefix: '',
      icon: <Car className="w-8 h-8" />,
      color: 'blue',
      description: 'Available in inventory',
      trend: 12.5,
      isLive: true
    },
    {
      id: 'customers',
      label: 'Satisfied Customers',
      value: 89234,
      suffix: '+',
      prefix: '',
      icon: <Users className="w-8 h-8" />,
      color: 'green',
      description: 'Worldwide community',
      trend: 8.3,
      isLive: true
    },
    {
      id: 'sales',
      label: 'Cars Sold This Year',
      value: 12456,
      suffix: '',
      prefix: '',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'yellow',
      description: '2024 performance',
      trend: 23.7,
      isLive: false
    },
    {
      id: 'countries',
      label: 'Countries Served',
      value: 47,
      suffix: '',
      prefix: '',
      icon: <Globe className="w-8 h-8" />,
      color: 'purple',
      description: 'Global presence',
      trend: 5.2,
      isLive: false
    },
    {
      id: 'rating',
      label: 'Customer Rating',
      value: 4.9,
      suffix: '/5',
      prefix: '',
      icon: <Star className="w-8 h-8" />,
      color: 'orange',
      description: 'Based on 50K+ reviews',
      trend: 2.1,
      isLive: false
    },
    {
      id: 'uptime',
      label: 'System Uptime',
      value: 99.9,
      suffix: '%',
      prefix: '',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'emerald',
      description: 'Platform reliability',
      trend: 0.1,
      isLive: true
    }
  ];

  // Live metrics that update in real-time
  const liveMetrics: LiveMetric[] = [
    {
      label: 'Active Users Online',
      value: `${2847 + Math.floor(Math.sin(Date.now() / 10000) * 100)}`,
      icon: <Users className="w-5 h-5" />,
      status: 'positive'
    },
    {
      label: 'VR Sessions Today',
      value: `${156 + Math.floor(currentTime.getMinutes() / 2)}`,
      icon: <Zap className="w-5 h-5" />,
      status: 'positive'
    },
    {
      label: 'AI Recommendations',
      value: `${8923 + Math.floor(Math.cos(Date.now() / 8000) * 50)}`,
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'positive'
    },
    {
      label: 'Support Response',
      value: '< 2 min',
      icon: <Clock className="w-5 h-5" />,
      status: 'positive'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0,102,255,0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(212,175,55,0.1) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0,102,255,0.1) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(212,175,55,0.1) 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }}
          animate={{
            backgroundPosition: [
              '0 0, 0 30px, 30px -30px, -30px 0px',
              '60px 60px, 60px 90px, 90px 30px, 30px 60px'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
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
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <BarChart3 className="w-4 h-4 mr-2" />
            Live Statistics
          </Badge>
          <h2 className="heading-2 mb-8">
            Real-Time
            <span className="block text-gradient-luxury">Performance Metrics</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Live data showcasing our global impact and the trust placed in us by customers worldwide.
          </p>
        </motion.div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Live Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          <Card className="p-8 bg-gradient-to-r from-black/40 to-gray-900/40 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h3 className="heading-5 text-white">Live Metrics</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  LIVE
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Updated: {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 group-hover:scale-110 transition-transform duration-300">
                      {metric.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievement Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="p-6 text-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h4 className="heading-6 text-white mb-2">Industry Leader</h4>
            <p className="text-body-sm text-gray-300">
              Recognized as the #1 luxury automotive platform in the region
            </p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
            <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h4 className="heading-6 text-white mb-2">Customer Love</h4>
            <p className="text-body-sm text-gray-300">
              98% customer satisfaction rate with 5-star service experiences
            </p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
            <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="heading-6 text-white mb-2">Innovation First</h4>
            <p className="text-body-sm text-gray-300">
              First to integrate AI, AR/VR, and smart financing in automotive
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

// Individual Stat Card Component with Animated Counter
interface StatCardProps {
  stat: StatItem;
  index: number;
  isInView: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, isInView }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { 
    stiffness: 100, 
    damping: 30,
    mass: 1
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Add random variation for live stats
      const finalValue = stat.isLive 
        ? stat.value + Math.floor(Math.random() * 100)
        : stat.value;
      
      motionValue.set(finalValue);
    }
  }, [isInView, motionValue, stat.value, stat.isLive]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });

    return unsubscribe;
  }, [spring]);

  const formatValue = (value: number) => {
    if (stat.id === 'rating') {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  const getStatColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
      emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="group"
    >
      <Card className={`p-8 h-full bg-gradient-to-br border-2 ${getStatColorClasses(stat.color)} hover:shadow-luxury-lg transition-all duration-500 relative overflow-hidden`}>
        {/* Live indicator */}
        {stat.isLive && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">LIVE</span>
            </div>
          </div>
        )}

        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            
            {stat.trend > 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                +{stat.trend}%
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl font-bold text-white">
              {stat.prefix}
              {formatValue(displayValue)}
              {stat.suffix}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-200">
              {stat.label}
            </h3>
            
            <p className="text-sm text-gray-400">
              {stat.description}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LiveStatistics; 