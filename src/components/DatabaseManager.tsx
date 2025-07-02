import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { log } from '@/utils/logger';
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Trash2, 
  RefreshCw, 
  WifiOff,
  Wifi
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
    duplicateCars: 0
  });

  // Test database connection
  const checkConnection = async () => {
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
  };

  // Load database statistics
  const loadStats = async () => {
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('id, name, model');

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

      setStats({
        totalCars: total,
        duplicateGroups: duplicatesCount.length,
        duplicateCars: duplicatesCount.reduce((sum, group) => sum + group.length - 1, 0)
      });
    } catch (error) {
      log.error('Failed to load stats', error, 'DatabaseManager');
    }
  };

  // Load duplicate cars
  const loadDuplicates = async () => {
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
  };

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
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {connectionStatus === 'checking' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {connectionStatus === 'connected' && <Wifi className="w-4 h-4 text-green-500" />}
              {connectionStatus === 'disconnected' && <WifiOff className="w-4 h-4 text-red-500" />}
              <span className="font-medium">
                Connection Status: 
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {connectionStatus}
                </Badge>
              </span>
            </div>
            <Button 
              onClick={checkConnection} 
              size="sm" 
              variant="outline"
              disabled={connectionStatus === 'checking'}
            >
              Test Connection
            </Button>
          </div>

          {/* Database Statistics */}
          {connectionStatus === 'connected' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalCars}</div>
                <div className="text-sm text-blue-600">Total Cars</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.duplicateGroups}</div>
                <div className="text-sm text-yellow-600">Duplicate Groups</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.duplicateCars}</div>
                <div className="text-sm text-red-600">Duplicate Cars</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duplicate Management */}
      {connectionStatus === 'connected' && duplicates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Duplicate Cars Found
              </span>
              <Button 
                onClick={removeAllDuplicates}
                variant="destructive"
                disabled={removing.length > 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove All Duplicates
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {duplicates.map((group, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">
                      {group.name} ({group.model}) - {group.cars.length} duplicates
                    </h3>
                    <Button
                      onClick={() => removeGroupDuplicates(group)}
                      size="sm"
                      variant="outline"
                      disabled={group.removeIds.some(id => removing.includes(id))}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clean Group
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {group.cars.map((car) => (
                      <div 
                        key={car.id} 
                        className={`flex items-center justify-between p-2 rounded ${
                          car.id === group.keepId 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {car.id === group.keepId ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <span className="font-medium">ID: {car.id}</span>
                            <span className="ml-2 text-sm text-gray-600">
                              {car.year} | {car.featured ? 'Featured' : 'Regular'}
                            </span>
                          </div>
                        </div>
                        
                        {car.id !== group.keepId && (
                          <Button
                            onClick={() => removeDuplicate(car.id)}
                            size="sm"
                            variant="destructive"
                            disabled={removing.includes(car.id)}
                          >
                            {removing.includes(car.id) ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              'Remove'
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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