import React, { useState, useEffect } from 'react';
import { testSupabaseConnection } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { log } from '@/utils/logger';

interface ConnectionStatus {
  isConnected: boolean | null;
  isLoading: boolean;
  lastTestTime: Date | null;
  error?: string;
}

const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: null,
    isLoading: false,
    lastTestTime: null,
  });

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      log.info('Manual connection test initiated', undefined, 'SupabaseConnectionTest');
      const isConnected = await testSupabaseConnection();
      
      setStatus({
        isConnected,
        isLoading: false,
        lastTestTime: new Date(),
        error: isConnected ? undefined : 'Connection test failed'
      });
    } catch (error) {
      log.error('Connection test error', error, 'SupabaseConnectionTest');
      setStatus({
        isConnected: false,
        isLoading: false,
        lastTestTime: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    }
    
    if (status.isConnected === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (status.isConnected === false) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (status.isLoading) {
      return 'Testing connection...';
    }
    
    if (status.isConnected === true) {
      return 'Supabase connection is working properly';
    }
    
    if (status.isConnected === false) {
      return `Connection failed${status.error ? `: ${status.error}` : ''}`;
    }
    
    return 'Connection status unknown';
  };

  const getStatusColor = () => {
    if (status.isConnected === true) return 'text-green-400';
    if (status.isConnected === false) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <Card className="p-6 bg-black/80 border-gray-700">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Supabase Connection Status</h3>
          <Button
            onClick={testConnection}
            disabled={status.isLoading}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            {status.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              'Test Connection'
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {status.lastTestTime && (
          <div className="text-sm text-gray-500">
            Last tested: {status.lastTestTime.toLocaleString()}
          </div>
        )}

        {status.error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <h4 className="text-red-400 font-medium mb-2">Error Details:</h4>
            <p className="text-sm text-red-300">{status.error}</p>
          </div>
        )}

        <div className="mt-6 space-y-2 text-sm text-gray-400">
          <h4 className="font-medium text-white">Troubleshooting Tips:</h4>
          <ul className="space-y-1">
            <li>• Check your internet connection</li>
            <li>• Verify Supabase project URL is correct</li>
            <li>• Ensure API key has proper permissions</li>
            <li>• Check browser developer console for additional errors</li>
            <li>• Verify the 'cars' table exists in your Supabase database</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SupabaseConnectionTest; 