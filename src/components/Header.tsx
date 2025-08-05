import React from 'react';
import { Moon, Sun, BarChart3, Download, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAllPDF = async () => {
    setDownloading(true);
    try {
      const statsSection = document.getElementById('metrics-grid-section');
      const aiSection = document.getElementById('ai-insights-section');
      if (!statsSection || !aiSection) return;
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Capture MetricsGrid
      const statsCanvas = await html2canvas(statsSection, { scale: 2 });
      const statsImgData = statsCanvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      let y = 10;
      let imgProps = pdf.getImageProperties(statsImgData);
      let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(statsImgData, 'PNG', 10, y, pdfWidth - 20, imgHeight - 10);
      y += imgHeight;
      // Capture AI Insights
      const aiCanvas = await html2canvas(aiSection, { scale: 2 });
      const aiImgData = aiCanvas.toDataURL('image/png');
      imgProps = pdf.getImageProperties(aiImgData);
      imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (y + imgHeight > pdf.internal.pageSize.getHeight() - 10) {
        pdf.addPage();
        y = 10;
      }
      pdf.addImage(aiImgData, 'PNG', 10, y, pdfWidth - 20, imgHeight - 10);
      pdf.save('ADmyBRAND-Stats-and-AI-Insights.pdf');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ADmyBRAND Insights
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Digital Marketing Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={handleDownloadAllPDF} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200" disabled={downloading}>
              {downloading ? (
                <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <Download className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};