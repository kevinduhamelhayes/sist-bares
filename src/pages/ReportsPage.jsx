import React from 'react';
import RegisterClosure from '../components/RegisterClosure';
import DailySales from '../components/DailySales';

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Reportes y Cierres
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <DailySales />
          </div>
          <div className="space-y-8">
            <RegisterClosure />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 