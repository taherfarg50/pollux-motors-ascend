import React from 'react';
import DatabaseManager from '@/components/DatabaseManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Shield } from 'lucide-react';

const DatabaseAdmin = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Database Administration
          </h1>
          <p className="text-gray-300">
            Manage your Pollux Motors database connections, duplicates, and data quality
          </p>
        </div>

        {/* Warning Notice */}
        <Card className="mb-6 border-yellow-600/50 bg-yellow-900/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-200 mb-1">
                  Administrative Access Required
                </h3>
                <p className="text-sm text-yellow-300">
                  This page provides administrative tools for database management. 
                  Make sure you have proper backup procedures in place before making changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Manager */}
        <DatabaseManager />

        {/* Additional Admin Tools */}
        <Card className="mt-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5" />
              Additional Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-700 bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-gray-700/50 transition-colors">
                <Database className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-semibold mb-1 text-white">Data Export</h3>
                <p className="text-sm text-gray-300">
                  Export your car database for backup or migration
                </p>
              </div>
              <div className="p-4 border border-gray-700 bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-gray-700/50 transition-colors">
                <Shield className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-semibold mb-1 text-white">Security Audit</h3>
                <p className="text-sm text-gray-300">
                  Review database security settings and permissions
                </p>
              </div>
              <div className="p-4 border border-gray-700 bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-gray-700/50 transition-colors">
                <Settings className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold mb-1 text-white">Performance Monitor</h3>
                <p className="text-sm text-gray-300">
                  Monitor database performance and optimization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseAdmin; 