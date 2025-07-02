import React from 'react';
import DatabaseManager from '@/components/DatabaseManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Shield } from 'lucide-react';

const DatabaseAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Administration
          </h1>
          <p className="text-gray-600">
            Manage your Pollux Motors database connections, duplicates, and data quality
          </p>
        </div>

        {/* Warning Notice */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Administrative Access Required
                </h3>
                <p className="text-sm text-yellow-700">
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
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Additional Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <Database className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-semibold mb-1">Data Export</h3>
                <p className="text-sm text-gray-600">
                  Export your car database for backup or migration
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-semibold mb-1">Security Audit</h3>
                <p className="text-sm text-gray-600">
                  Review database security settings and permissions
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Settings className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="font-semibold mb-1">Performance Monitor</h3>
                <p className="text-sm text-gray-600">
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