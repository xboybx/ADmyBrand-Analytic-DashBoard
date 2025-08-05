import { AnalyticsData, Metric, ChartData, UserAcquisitionData, TrafficSourceData, TableData } from '../types';

export const generateMockData = (): AnalyticsData => {
  // Generate metrics with some randomization for real-time feel
  const baseRevenue = 847000;
  const baseUsers = 24800;
  const baseConversions = 1247;
  const baseGrowth = 23.8;

  // Add small random variations to simulate real-time updates
  const revenueVariation = Math.random() * 10000 - 5000;
  const userVariation = Math.floor(Math.random() * 1000 - 500);
  const conversionVariation = Math.floor(Math.random() * 50 - 25);
  const growthVariation = Math.random() * 2 - 1;

  const metrics: Metric[] = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `$${(baseRevenue + revenueVariation).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      change: Number((baseGrowth + Math.random() * 4 - 2).toFixed(1))
    },
    {
      id: 'users',
      label: 'Active Users',
      value: (baseUsers + userVariation).toLocaleString(),
      change: Number((18.2 + Math.random() * 3 - 1.5).toFixed(1))
    },
    {
      id: 'conversions',
      label: 'Conversions',
      value: (baseConversions + conversionVariation).toLocaleString(),
      change: Number((12.5 + Math.random() * 5 - 2.5).toFixed(1))
    },
    {
      id: 'growth',
      label: 'Growth Rate',
      value: `${(baseGrowth + growthVariation).toFixed(1)}%`,
      change: Number((5.3 + Math.random() * 2 - 1).toFixed(1))
    }
  ];

  // Revenue trend data
  const revenueData: ChartData[] = [
    { month: 'Jan', revenue: 65 + Math.random() * 10 },
    { month: 'Feb', revenue: 68 + Math.random() * 10 },
    { month: 'Mar', revenue: 72 + Math.random() * 10 },
    { month: 'Apr', revenue: 78 + Math.random() * 10 },
    { month: 'May', revenue: 82 + Math.random() * 10 },
    { month: 'Jun', revenue: 87 + Math.random() * 10 },
    { month: 'Jul', revenue: 91 + Math.random() * 10 },
    { month: 'Aug', revenue: 95 + Math.random() * 10 },
    { month: 'Sep', revenue: 102 + Math.random() * 10 },
    { month: 'Oct', revenue: 108 + Math.random() * 10 },
    { month: 'Nov', revenue: 115 + Math.random() * 10 },
    { month: 'Dec', revenue: 122 + Math.random() * 10 }
  ];

  // User acquisition data
  const userAcquisition: UserAcquisitionData[] = [
    { channel: 'Organic', users: 8500 + Math.floor(Math.random() * 500) },
    { channel: 'Paid Search', users: 6200 + Math.floor(Math.random() * 400) },
    { channel: 'Social Media', users: 4800 + Math.floor(Math.random() * 300) },
    { channel: 'Email', users: 3200 + Math.floor(Math.random() * 200) },
    { channel: 'Direct', users: 2100 + Math.floor(Math.random() * 150) }
  ];

  // Traffic sources
  const trafficSources: TrafficSourceData[] = [
    { name: 'Organic Search', value: 45.2 + Math.random() * 5 - 2.5 },
    { name: 'Paid Search', value: 23.8 + Math.random() * 3 - 1.5 },
    { name: 'Social Media', value: 15.4 + Math.random() * 2 - 1 },
    { name: 'Direct', value: 9.2 + Math.random() * 2 - 1 },
    { name: 'Email', value: 4.1 + Math.random() * 1 - 0.5 },
    { name: 'Other', value: 2.3 + Math.random() * 1 - 0.5 }
  ];

  // Table data
  const campaigns = [
    'Holiday Sale 2024', 'Brand Awareness Q4', 'Product Launch Campaign',
    'Retargeting Campaign', 'Lead Generation', 'Black Friday Promo',
    'Summer Collection', 'Back to School', 'Valentine\'s Special',
    'Spring Launch', 'Mobile App Install', 'Video Marketing',
    'Influencer Collaboration', 'Local Market Push', 'Premium Product Focus'
  ];

  const channels = ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube'];

  const tableData: TableData[] = campaigns.map((campaign, index) => ({
    campaign,
    channel: channels[Math.floor(Math.random() * channels.length)],
    impressions: Math.floor(50000 + Math.random() * 200000),
    clicks: Math.floor(1000 + Math.random() * 5000),
    conversions: Math.floor(20 + Math.random() * 200),
    revenue: Math.floor(5000 + Math.random() * 45000),
    roas: Math.floor(150 + Math.random() * 300)
  }));

  return {
    metrics,
    revenueData,
    userAcquisition,
    trafficSources,
    tableData
  };
};