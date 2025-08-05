import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from 'lucide-react';
import { Metric } from '../types';

interface MetricsGridProps {
  metrics: Metric[];
}

const iconMap = {
  revenue: DollarSign,
  users: Users,
  conversions: Target,
  growth: Activity,
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div id="metrics-grid-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.id as keyof typeof iconMap] || Activity;
        const isPositive = metric.change >= 0;
        
        return (
          <div
            key={metric.id}
            className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                metric.id === 'revenue' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                metric.id === 'users' ? 'bg-blue-100 dark:bg-blue-900/30' :
                metric.id === 'conversions' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <Icon className={`h-6 w-6 ${
                  metric.id === 'revenue' ? 'text-emerald-600 dark:text-emerald-400' :
                  metric.id === 'users' ? 'text-blue-600 dark:text-blue-400' :
                  metric.id === 'conversions' ? 'text-purple-600 dark:text-purple-400' :
                  'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-medium">{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:scale-105 transition-transform duration-200">
              {metric.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {metric.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              vs last month
            </p>
          </div>
        );
      })}
    </div>
  );
};