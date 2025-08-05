export interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
}

export interface ChartData {
  month: string;
  revenue: number;
}

export interface UserAcquisitionData {
  channel: string;
  users: number;
}

export interface TrafficSourceData {
  name: string;
  value: number;
}

export interface TableData {
  campaign: string;
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
}

export interface AnalyticsData {
  metrics: Metric[];
  revenueData: ChartData[];
  userAcquisition: UserAcquisitionData[];
  trafficSources: TrafficSourceData[];
  tableData: TableData[];
}