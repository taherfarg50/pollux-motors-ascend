import React from 'react';
import SmartFinancing from '@/components/SmartFinancing';

export default function SmartFinancingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <SmartFinancing carPrice={285000} carName="Demo Vehicle" />
      </div>
    </div>
  );
} 