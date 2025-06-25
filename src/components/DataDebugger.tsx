import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';
import { useCars, useFeaturedCars } from '@/lib/supabase';
import { log } from '@/utils/logger';

const DataDebugger: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: allCars, isLoading: carsLoading, error: carsError } = useCars();
  const { data: featuredCars, isLoading: featuredLoading, error: featuredError } = useFeaturedCars(3);

  const getStatusIcon = (loading: boolean, error: any, data: any) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (error) return <XCircle className="w-4 h-4 text-red-500" />;
    if (data?.length > 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (loading: boolean, error: any, data: any) => {
    if (loading) return 'Loading...';
    if (error) return `Error: ${error.message}`;
    if (data?.length > 0) return `Success (${data.length} items)`;
    return 'No data found';
  };

  const logData = () => {
    log.debug('All Cars Data', allCars, 'DataDebugger');
    log.debug('Featured Cars Data', featuredCars, 'DataDebugger');
    console.log('All Cars:', allCars);
    console.log('Featured Cars:', featuredCars);
  };

  return (
    <Card className="p-6 bg-black/80 border-gray-700">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Debug Information
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={logData}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Log to Console
            </Button>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Data Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">All Cars</h4>
              {getStatusIcon(carsLoading, carsError, allCars)}
            </div>
            <p className="text-sm text-gray-400">
              {getStatusText(carsLoading, carsError, allCars)}
            </p>
          </div>

          <div className="glass-card p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">Featured Cars</h4>
              {getStatusIcon(featuredLoading, featuredError, featuredCars)}
            </div>
            <p className="text-sm text-gray-400">
              {getStatusText(featuredLoading, featuredError, featuredCars)}
            </p>
          </div>
        </div>

        {/* Error Details */}
        {(carsError || featuredError) && (
          <div className="space-y-3">
            <h4 className="font-medium text-red-400">Error Details:</h4>
            {carsError && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>All Cars Error:</strong> {carsError.message}
                </p>
              </div>
            )}
            {featuredError && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>Featured Cars Error:</strong> {featuredError.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sample Data Preview */}
        {showDetails && (
          <div className="space-y-4">
            <h4 className="font-medium text-white">Sample Data Preview:</h4>
            
            {allCars && allCars.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">First Car Sample:</h5>
                <pre className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(allCars[0], null, 2)}
                </pre>
              </div>
            )}

            {featuredCars && featuredCars.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Featured Cars Count:</h5>
                <p className="text-sm text-gray-400">{featuredCars.length} featured cars found</p>
              </div>
            )}

            {/* Data Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="glass-card p-3 rounded text-center">
                <div className="text-lg font-bold text-white">{allCars?.length || 0}</div>
                <div className="text-xs text-gray-400">Total Cars</div>
              </div>
              <div className="glass-card p-3 rounded text-center">
                <div className="text-lg font-bold text-white">{featuredCars?.length || 0}</div>
                <div className="text-xs text-gray-400">Featured</div>
              </div>
              <div className="glass-card p-3 rounded text-center">
                <div className="text-lg font-bold text-white">
                  {allCars?.filter(car => car.specs?.speed !== 'N/A').length || 0}
                </div>
                <div className="text-xs text-gray-400">With Specs</div>
              </div>
              <div className="glass-card p-3 rounded text-center">
                <div className="text-lg font-bold text-white">
                  {new Set(allCars?.map(car => car.category)).size || 0}
                </div>
                <div className="text-xs text-gray-400">Categories</div>
              </div>
            </div>
          </div>
        )}

        {/* Database Connection Info */}
        <div className="mt-6 text-xs text-gray-500 border-t border-gray-700 pt-4">
          <p>Database: Supabase (gjsektwcdvontsnyqobx.supabase.co)</p>
          <p>Tables: cars, car_specs, user_favorites</p>
          <p>Status: {carsLoading || featuredLoading ? 'Fetching...' : 'Ready'}</p>
        </div>
      </div>
    </Card>
  );
};

export default DataDebugger; 