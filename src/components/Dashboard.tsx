import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MetricsGrid } from './MetricsGrid';
import { ChartsSection } from './ChartsSection';
import { DataTable } from './DataTable';
import { AIInsights } from './AIInsights';
import { generateMockData } from '../utils/mockData';
import { AnalyticsData } from '../types';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAllData = () => {
    setData(generateMockData());
  };

  useEffect(() => {
    // Simulate initial data loading
    const loadingTimeout = setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1500);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 10000);

    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"></div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-white dark:bg-gray-800 rounded-xl"></div>
              <div className="h-80 bg-white dark:bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="p-6 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-4">
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white ">AI-Powered Marketing Analytics Dashboard</h1>
           <p className="text-gray-700 dark:text-gray-300">This dashboard provides a comprehensive overview of your marketing performance, including total revenue, conversions, ROAS, and more. Gain actionable insights and predictions powered by AI to optimize your campaigns and drive growth.</p>
         </div>
          <MetricsGrid metrics={data?.metrics || []} />
          <AIInsights data={data!} onRefresh={refreshAllData} />
          <ChartsSection data={data} />
          <DataTable data={data?.tableData || []} />
        </div>
      </main>
    </div>
  );
};