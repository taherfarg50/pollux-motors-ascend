import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { log } from '@/utils/logger';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ModernLoader } from '@/components/ui/modern-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Trash2, 
  RefreshCw, 
  WifiOff,
  Wifi,
  Download,
  Upload,
  BarChart3,
  FileText,
  Settings,
  Activity,
  Archive,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface Car {
  id: number;
  name: string;
  model: string;
  year: string;
  price: string;
  featured: boolean;
  description?: string;
  gallery?: string[];
  created_at: string;
}

interface DuplicateGroup {
  name: string;
  model: string;
  cars: Car[];
  keepId: number;
  removeIds: number[];
}

const DatabaseManager = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    duplicateGroups: 0,
    duplicateCars: 0,
    recentlyAdded: 0,
    featuredCars: 0,
    totalViews: 0,
    avgPrice: 0,
    categories: 0
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'xlsx'>('json');
  const [importProgress, setImportProgress] = useState(0);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // Test database connection
  // Load database statistics
  const loadStats = useCallback(async () => {
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('id, name, model, price, featured, category, created_at');

      if (error) throw error;

      const total = cars?.length || 0;
      const duplicateGroups = new Map();
      
      cars?.forEach(car => {
        const key = `${car.name}|${car.model}`;
        if (!duplicateGroups.has(key)) {
          duplicateGroups.set(key, []);
        }
        duplicateGroups.get(key).push(car);
      });

      const duplicatesCount = Array.from(duplicateGroups.values())
        .filter(group => group.length > 1);

      // Calculate additional stats
      const recentlyAdded = cars?.filter(car => {
        const createdAt = new Date(car.created_at || Date.now());
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt > sevenDaysAgo;
      }).length || 0;

      const featuredCount = cars?.filter(car => car.featured).length || 0;
      
      const prices = cars?.map(car => {
        const price = parseInt(car.price.replace(/[^0-9]/g, ""));
        return isNaN(price) ? 0 : price;
      }).filter(price => price > 0) || [];
      
      const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
      
      const categories = new Set(cars?.map(car => car.category).filter(Boolean)).size;

      setStats({
        totalCars: total,
        duplicateGroups: duplicatesCount.length,
        duplicateCars: duplicatesCount.reduce((sum, group) => sum + group.length - 1, 0),
        recentlyAdded,
        featuredCars: featuredCount,
        totalViews: 0, // Would need to track this separately
        avgPrice: Math.round(avgPrice),
        categories
      });
    } catch (error) {
      log.error('Failed to load stats', error, 'DatabaseManager');
    }
  }, []);

  // Load duplicate cars
  const loadDuplicates = useCallback(async () => {
    setLoading(true);
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .order('id');

      if (error) throw error;

      // Group cars by name and model
      const groups = new Map<string, Car[]>();
      cars?.forEach(car => {
        const key = `${car.name}|${car.model}`;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(car);
      });

      // Find duplicates and determine which to keep
      const duplicateGroups: DuplicateGroup[] = [];
      groups.forEach((groupCars, key) => {
        if (groupCars.length > 1) {
          // Score cars to determine which to keep
          const scoredCars = groupCars.map(car => ({
            car,
            score: calculateCarScore(car)
          })).sort((a, b) => b.score - a.score);

          const [name, model] = key.split('|');
          const keepCar = scoredCars[0].car;
          const removeCars = scoredCars.slice(1).map(sc => sc.car);

          duplicateGroups.push({
            name,
            model,
            cars: groupCars,
            keepId: keepCar.id,
            removeIds: removeCars.map(c => c.id)
          });
        }
      });

      setDuplicates(duplicateGroups.sort((a, b) => b.cars.length - a.cars.length));
    } catch (error) {
      log.error('Failed to load duplicates', error, 'DatabaseManager');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (isConnected) {
        await loadDuplicates();
        await loadStats();
      }
    } catch (error) {
      log.error('Connection check failed', error, 'DatabaseManager');
      setConnectionStatus('disconnected');
    }
  }, [loadDuplicates, loadStats]);

  // Calculate car quality score
  const calculateCarScore = (car: Car): number => {
    let score = 0;
    
    // Featured cars get priority
    if (car.featured) score += 15;
    
    // Cars with descriptions
    if (car.description && car.description.length > 10) score += 10;
    
    // Cars with galleries
    if (car.gallery && car.gallery.length > 0) score += 5;
    
    // Newer years
    const year = parseInt(car.year);
    if (year >= 2024) score += 10;
    else if (year >= 2022) score += 5;
    
    // Older records (more established)
    score += (1000 - car.id) * 0.01;
    
    return score;
  };

  // Export database functionality
  const exportDatabase = async () => {
    try {
      setLoading(true);
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*');

      if (error) throw error;

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(cars, null, 2);
          filename = `pollux-cars-export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          const headers = Object.keys(cars[0] || {});
          const csvRows = [
            headers.join(','),
            ...cars.map(car => headers.map(header => 
              JSON.stringify(car[header] || '')
            ).join(','))
          ];
          content = csvRows.join('\n');
          filename = `pollux-cars-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      log.info(`Database exported successfully as ${exportFormat.toUpperCase()}`, null, 'DatabaseManager');
    } catch (error) {
      log.error('Failed to export database', error, 'DatabaseManager');
    } finally {
      setLoading(false);
    }
  };

  // Import database functionality (placeholder for future implementation)
  const importDatabase = async (file: File) => {
    try {
      setLoading(true);
      setImportProgress(0);
      
      // This is a placeholder - actual implementation would depend on file format
      // and business requirements for data validation and conflict resolution
      
      log.info('Database import initiated', { filename: file.name }, 'DatabaseManager');
      
      // Simulate progress for demo
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      log.error('Failed to import database', error, 'DatabaseManager');
    } finally {
      setLoading(false);
      setImportProgress(0);
    }
  };

  // Generate analytics report
  const generateAnalyticsReport = async () => {
    try {
      setLoading(true);
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*');

      if (error) throw error;

      const analytics = {
        totalVehicles: cars.length,
        categoryBreakdown: cars.reduce((acc, car) => {
          acc[car.category] = (acc[car.category] || 0) + 1;
          return acc;
        }, {}),
        yearDistribution: cars.reduce((acc, car) => {
          acc[car.year] = (acc[car.year] || 0) + 1;
          return acc;
        }, {}),
        priceRanges: {
          under50k: cars.filter(car => parseInt(car.price.replace(/[^0-9]/g, "")) < 50000).length,
          between50k100k: cars.filter(car => {
            const price = parseInt(car.price.replace(/[^0-9]/g, ""));
            return price >= 50000 && price < 100000;
          }).length,
          over100k: cars.filter(car => parseInt(car.price.replace(/[^0-9]/g, "")) >= 100000).length,
        },
        featuredPercentage: Math.round((cars.filter(car => car.featured).length / cars.length) * 100),
        avgPrice: Math.round(cars.reduce((sum, car) => {
          const price = parseInt(car.price.replace(/[^0-9]/g, ""));
          return sum + (isNaN(price) ? 0 : price);
        }, 0) / cars.length),
        generatedAt: new Date().toISOString()
      };

      setAnalyticsData(analytics);
    } catch (error) {
      log.error('Failed to generate analytics', error, 'DatabaseManager');
    } finally {
      setLoading(false);
    }
  };

  // Remove duplicate car
  const removeDuplicate = async (carId: number) => {
    setRemoving(prev => [...prev, carId]);
    
    try {
      // Remove from user_favorites first
      await supabase
        .from('user_favorites')
        .delete()
        .eq('car_id', carId);

      // Remove from car_specs
      await supabase
        .from('car_specs')
        .delete()
        .eq('car_id', carId);

      // Remove the car
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      // Reload data
      await loadDuplicates();
      await loadStats();
      
      log.info(`Successfully removed duplicate car ID ${carId}`, undefined, 'DatabaseManager');
    } catch (error) {
      log.error(`Failed to remove car ID ${carId}`, error, 'DatabaseManager');
    } finally {
      setRemoving(prev => prev.filter(id => id !== carId));
    }
  };

  // Remove all duplicates from a group
  const removeGroupDuplicates = async (group: DuplicateGroup) => {
    for (const carId of group.removeIds) {
      await removeDuplicate(carId);
    }
  };

  // Remove all duplicates
  const removeAllDuplicates = async () => {
    for (const group of duplicates) {
      await removeGroupDuplicates(group);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="elevated" glow={true} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Database Manager</h1>
                <p className="text-gray-400">Manage your Pollux Motors database</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <GradientButton
                variant="secondary"
                size="sm"
                onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                className="text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced Tools
              </GradientButton>
              
              <GradientButton
                variant="primary"
                size="sm"
                onClick={checkConnection}
                loading={connectionStatus === 'checking'}
                className="text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </GradientButton>
            </div>
          </div>

          {/* Connection Status */}
          <motion.div 
            className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: connectionStatus === 'checking' ? 360 : 0,
                  scale: connectionStatus === 'connected' ? 1.1 : 1
                }}
                transition={{ 
                  rotate: { duration: 1, repeat: connectionStatus === 'checking' ? Infinity : 0 },
                  scale: { duration: 0.3 }
                }}
              >
                {connectionStatus === 'checking' && <Activity className="w-5 h-5 text-blue-400" />}
                {connectionStatus === 'connected' && <Wifi className="w-5 h-5 text-green-400" />}
                {connectionStatus === 'disconnected' && <WifiOff className="w-5 h-5 text-red-400" />}
              </motion.div>
              <span className="font-medium text-white">
                Connection Status: 
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </Badge>
              </span>
            </div>
          </motion.div>

          {/* Enhanced Database Statistics */}
          <AnimatePresence>
            {connectionStatus === 'connected' && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {[
                  { icon: Database, label: 'Total Cars', value: stats.totalCars, color: 'blue' },
                  { icon: AlertCircle, label: 'Duplicates', value: stats.duplicateCars, color: 'yellow' },
                  { icon: Zap, label: 'Featured', value: stats.featuredCars, color: 'green' },
                  { icon: Clock, label: 'Recent', value: stats.recentlyAdded, color: 'purple' },
                  { icon: TrendingUp, label: 'Avg Price', value: `$${(stats.avgPrice / 1000).toFixed(0)}k`, color: 'indigo' },
                  { icon: BarChart3, label: 'Categories', value: stats.categories, color: 'pink' },
                  { icon: Activity, label: 'Groups', value: stats.duplicateGroups, color: 'red' },
                  { icon: Users, label: 'Views', value: stats.totalViews || 'N/A', color: 'cyan' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GlassCard 
                      variant="minimal" 
                      className={`text-center p-4 bg-${stat.color}-900/30 border-${stat.color}-700/50 hover:bg-${stat.color}-800/40`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
                      <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                      <div className={`text-sm text-${stat.color}-300`}>{stat.label}</div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Advanced Tools Section */}
      <AnimatePresence>
        {showAdvancedTools && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard variant="gradient" className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Advanced Database Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Export Tools */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </h3>
                  
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'xlsx')}
                    className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="json">JSON Format</option>
                    <option value="csv">CSV Format</option>
                  </select>
                  
                  <GradientButton
                    variant="accent"
                    onClick={exportDatabase}
                    loading={loading}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Database
                  </GradientButton>
                </div>

                {/* Analytics Tools */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </h3>
                  
                  <GradientButton
                    variant="luxury"
                    onClick={generateAnalyticsReport}
                    loading={loading}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </GradientButton>
                  
                  {analyticsData && (
                    <div className="text-xs text-gray-400">
                      Last generated: {new Date(analyticsData.generatedAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Maintenance Tools */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Maintenance
                  </h3>
                  
                  <GradientButton
                    variant="minimal"
                    onClick={loadDuplicates}
                    loading={loading}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Scan Duplicates
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Duplicate Management */}
      <AnimatePresence>
        {connectionStatus === 'connected' && duplicates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Duplicate Cars Found</h2>
                    <p className="text-gray-400">{duplicates.length} groups with {stats.duplicateCars} duplicates</p>
                  </div>
                </div>
                
                <GradientButton
                  variant="accent"
                  onClick={removeAllDuplicates}
                  disabled={removing.length > 0}
                  loading={removing.length > 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove All Duplicates
                </GradientButton>
              </div>

              <div className="space-y-4">
                {duplicates.map((group, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard variant="minimal" className="p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">
                          {group.name} ({group.model}) - {group.cars.length} duplicates
                        </h3>
                        <GradientButton
                          variant="secondary"
                          size="sm"
                          onClick={() => removeGroupDuplicates(group)}
                          disabled={group.removeIds.some(id => removing.includes(id))}
                          loading={group.removeIds.some(id => removing.includes(id))}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clean Group
                        </GradientButton>
                      </div>
                      
                      <div className="space-y-2">
                        {group.cars.map((car) => (
                          <motion.div
                            key={car.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              car.id === group.keepId 
                                ? 'bg-green-900/30 border-green-700/50' 
                                : 'bg-red-900/30 border-red-700/50'
                            }`}
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center gap-3">
                              {car.id === group.keepId ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-400" />
                              )}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white">ID: {car.id}</span>
                                  {car.featured && (
                                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                                      Featured
                                    </Badge>
                                  )}
                                  {car.id === group.keepId && (
                                    <Badge variant="default" className="bg-green-500/20 text-green-300">
                                      Keep
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {car.year} | {car.price}
                                </div>
                              </div>
                            </div>
                            
                            {car.id !== group.keepId && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <GradientButton
                                  variant="minimal"
                                  size="sm"
                                  onClick={() => removeDuplicate(car.id)}
                                  disabled={removing.includes(car.id)}
                                  loading={removing.includes(car.id)}
                                  className="text-red-400 border-red-400/50 hover:bg-red-500/20"
                                >
                                  {removing.includes(car.id) ? (
                                    <ModernLoader variant="spinner" size="sm" color="current" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </GradientButton>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Duplicates */}
      {connectionStatus === 'connected' && duplicates.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">Database is Clean!</h3>
            <p className="text-gray-600">No duplicate cars found in your database.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseManager; 