import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { TableData } from '../types';

interface DataTableProps {
  data: TableData[];
}

type SortField = keyof TableData;
type SortDirection = 'asc' | 'desc';

interface FilterState {
  channel: string;
  revenue: { min: string; max: string };
  conversions: { min: string; max: string };
  roas: { min: string; max: string };
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    channel: '',
    revenue: { min: '', max: '' },
    conversions: { min: '', max: '' },
    roas: { min: '', max: '' }
  });

  const itemsPerPage = 10;

  const handleFilterChange = (field: keyof FilterState, value: string | { min: string; max: string }) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uniqueChannels = useMemo(() => {
    const channels = new Set(data.map(item => item.channel));
    return Array.from(channels);
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = 
        item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.channel.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesChannel = !filters.channel || item.channel === filters.channel;
      
      const matchesRevenue = 
        (!filters.revenue.min || item.revenue >= parseFloat(filters.revenue.min)) &&
        (!filters.revenue.max || item.revenue <= parseFloat(filters.revenue.max));
      
      const matchesConversions = 
        (!filters.conversions.min || item.conversions >= parseFloat(filters.conversions.min)) &&
        (!filters.conversions.max || item.conversions <= parseFloat(filters.conversions.max));
      
      const matchesROAS = 
        (!filters.roas.min || item.roas >= parseFloat(filters.roas.min)) &&
        (!filters.roas.max || item.roas <= parseFloat(filters.roas.max));
      
      return matchesSearch && matchesChannel && matchesRevenue && matchesConversions && matchesROAS;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [data, sortField, sortDirection, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Performance</h2>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            onClick={() => setShowFilters(!showFilters)}
            title="Filter data"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Channel
                </label>
                <select
                  value={filters.channel}
                  onChange={(e) => handleFilterChange('channel', e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Channels</option>
                  {uniqueChannels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Revenue Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.revenue.min}
                    onChange={(e) => handleFilterChange('revenue', { ...filters.revenue, min: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.revenue.max}
                    onChange={(e) => handleFilterChange('revenue', { ...filters.revenue, max: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conversions Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.conversions.min}
                    onChange={(e) => handleFilterChange('conversions', { ...filters.conversions, min: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.conversions.max}
                    onChange={(e) => handleFilterChange('conversions', { ...filters.conversions, max: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ROAS Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.roas.min}
                    onChange={(e) => handleFilterChange('roas', { ...filters.roas, min: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.roas.max}
                    onChange={(e) => handleFilterChange('roas', { ...filters.roas, max: e.target.value })}
                    className="w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters({
                    channel: '',
                    revenue: { min: '', max: '' },
                    conversions: { min: '', max: '' },
                    roas: { min: '', max: '' }
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns or channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {[
                { field: 'campaign', label: 'Campaign' },
                { field: 'channel', label: 'Channel' },
                { field: 'impressions', label: 'Impressions' },
                { field: 'clicks', label: 'Clicks' },
                { field: 'conversions', label: 'Conversions' },
                { field: 'revenue', label: 'Revenue' },
                { field: 'roas', label: 'ROAS' }
              ].map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => {
                    if (field === sortField) {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField(field as SortField);
                      setSortDirection('desc');
                    }
                  }}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortField === field && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((item, index) => (
              <tr 
                key={index}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.campaign}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.channel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.clicks.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.conversions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${item.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.roas.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
