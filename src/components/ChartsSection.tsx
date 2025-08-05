import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsData } from '../types';

interface ChartsSectionProps {
  data: AnalyticsData | null;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Revenue Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          Revenue Trend
          <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
            Live
          </span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-600" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280" 
              className="dark:stroke-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280" 
              className="dark:stroke-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`$${value}k`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Acquisition */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            User Acquisition Channels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.userAcquisition}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-600" />
              <XAxis 
                dataKey="channel" 
                stroke="#6B7280" 
                className="dark:stroke-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#6B7280" 
                className="dark:stroke-gray-400"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="users" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Traffic Sources
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.trafficSources.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'Share']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};