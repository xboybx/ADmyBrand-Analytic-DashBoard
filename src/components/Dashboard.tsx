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
          <MetricsGrid metrics={data?.metrics || []} />
          <AIInsights data={data!} />
          <ChartsSection data={data} />
          <DataTable data={data?.tableData || []} />
        </div>
      </main>
    </div>
  );
};