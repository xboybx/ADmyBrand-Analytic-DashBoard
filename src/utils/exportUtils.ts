import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { AnalyticsData, TableData } from '../types';

export const exportToCSV = (data: TableData[], filename: string) => {
  // Convert data to CSV format
  const headers = ['Campaign', 'Channel', 'Impressions', 'Clicks', 'Conversions', 'Revenue', 'ROAS'];
  const csvData = data.map(row => [
    row.campaign,
    row.channel,
    row.impressions,
    row.clicks,
    row.conversions,
    row.revenue,
    `${row.roas}%`
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToPDF = (data: AnalyticsData, filename: string) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;

  // Add title
  pdf.setFontSize(20);
  pdf.text('Analytics Dashboard Report', pageWidth / 2, 15, { align: 'center' });
  pdf.setFontSize(12);

  // Add date
  const date = new Date().toLocaleDateString();
  pdf.text(`Generated on: ${date}`, pageWidth / 2, 25, { align: 'center' });

  // Add metrics summary
  pdf.setFontSize(14);
  pdf.text('Key Metrics', 14, 35);
  pdf.setFontSize(12);

  const metrics = data.metrics.map(m => `${m.label}: ${m.value} (${m.change > 0 ? '+' : ''}${m.change}%)`);
  metrics.forEach((metric, index) => {
    pdf.text(metric, 20, 45 + (index * 7));
  });

  // Add campaign performance table
  pdf.text('Campaign Performance', 14, 80);
  
  const tableData = data.tableData.map(row => [
    row.campaign,
    row.channel,
    row.impressions.toLocaleString(),
    row.clicks.toLocaleString(),
    row.conversions.toString(),
    `$${row.revenue.toLocaleString()}`,
    `${row.roas}%`
  ]);

  autoTable(pdf, {
    head: [['Campaign', 'Channel', 'Impressions', 'Clicks', 'Conversions', 'Revenue', 'ROAS']],
    body: tableData,
    startY: 85,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }, // Blue color
    styles: { fontSize: 8 }
  });

  // Add AI insights
  const currentY = (pdf as any).lastAutoTable && (pdf as any).lastAutoTable.finalY ? (pdf as any).lastAutoTable.finalY + 15 : 100;
  pdf.text('AI Insights & Predictions', 14, currentY);
  
  // Save PDF
  pdf.save(`${filename}.pdf`);
};

// Function to prepare filename with date
export const getExportFilename = (prefix: string) => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}`;
};