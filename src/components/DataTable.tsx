import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react';
import { TableData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DataTableProps {
  data: TableData[];
}

type SortField = keyof TableData;
type SortDirection = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showFilters, setShowFilters] = useState(false);
  const [channelFilter, setChannelFilter] = useState('');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [minConversions, setMinConversions] = useState('');
  const [maxConversions, setMaxConversions] = useState('');
  const [minRoas, setMinRoas] = useState('');
  const [maxRoas, setMaxRoas] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (channelFilter) filtered = filtered.filter(item => item.channel === channelFilter);
    if (minRevenue) filtered = filtered.filter(item => item.revenue >= Number(minRevenue));
    if (maxRevenue) filtered = filtered.filter(item => item.revenue <= Number(maxRevenue));
    if (minConversions) filtered = filtered.filter(item => item.conversions >= Number(minConversions));
    if (maxConversions) filtered = filtered.filter(item => item.conversions <= Number(maxConversions));
    if (minRoas) filtered = filtered.filter(item => item.roas >= Number(minRoas));
    if (maxRoas) filtered = filtered.filter(item => item.roas <= Number(maxRoas));
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
  }, [data, sortField, sortDirection, searchTerm, channelFilter, minRevenue, maxRevenue, minConversions, maxConversions, minRoas, maxRoas]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const SortHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const input = document.getElementById('campaign-performance-table');
      if (!input) throw new Error('Table not found');
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('campaign-performance.pdf');
    } catch (err) {
      alert('Failed to generate PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Campaign Performance
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200" onClick={() => setShowFilters(v => !v)}>
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 relative" onClick={handleDownloadPDF} disabled={downloading}>
              {downloading ? (
                <svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns or channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-4 mt-4 mb-2 items-center">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Channel</label>
              <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded px-2 py-1">
                <option value="">All</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Revenue ($)</label>
              <input type="number" placeholder="Min" value={minRevenue} onChange={e => setMinRevenue(e.target.value)} className="w-20 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 mr-1" />
              <input type="number" placeholder="Max" value={maxRevenue} onChange={e => setMaxRevenue(e.target.value)} className="w-20 border border-gray-200 dark:border-gray-600 rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Conversions</label>
              <input type="number" placeholder="Min" value={minConversions} onChange={e => setMinConversions(e.target.value)} className="w-16 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 mr-1" />
              <input type="number" placeholder="Max" value={maxConversions} onChange={e => setMaxConversions(e.target.value)} className="w-16 border border-gray-200 dark:border-gray-600 rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">ROAS (%)</label>
              <input type="number" placeholder="Min" value={minRoas} onChange={e => setMinRoas(e.target.value)} className="w-16 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 mr-1" />
              <input type="number" placeholder="Max" value={maxRoas} onChange={e => setMaxRoas(e.target.value)} className="w-16 border border-gray-200 dark:border-gray-600 rounded px-2 py-1" />
            </div>
            <button onClick={() => { setChannelFilter(''); setMinRevenue(''); setMaxRevenue(''); setMinConversions(''); setMaxConversions(''); setMinRoas(''); setMaxRoas(''); }} className="px-3 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">Reset Filters</button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table id="campaign-performance-table" className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <SortHeader field="campaign">Campaign</SortHeader>
              <SortHeader field="channel">Channel</SortHeader>
              <SortHeader field="impressions">Impressions</SortHeader>
              <SortHeader field="clicks">Clicks</SortHeader>
              <SortHeader field="conversions">Conversions</SortHeader>
              <SortHeader field="revenue">Revenue</SortHeader>
              <SortHeader field="roas">ROAS</SortHeader>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {row.campaign}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    row.channel === 'Google Ads' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    row.channel === 'Facebook' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                    row.channel === 'Instagram' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' :
                    row.channel === 'LinkedIn' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {row.channel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.clicks.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.conversions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    row.roas >= 300 ? 'text-emerald-600 dark:text-emerald-400' :
                    row.roas >= 200 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {row.roas}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};