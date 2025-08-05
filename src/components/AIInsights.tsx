import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Lightbulb, Zap, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';
import { AnalyticsData } from '../types';

interface AIInsightsProps {
  data: AnalyticsData;
  onRefresh?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data, onRefresh }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<{
    nextMonthRevenue: string;
    userGrowthForecast: string;
    recommendedBudgetAllocation: string;
  } | null>(null);
  const [reportSummary, setReportSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const [insightsResult, predictionsResult, reportResult] = await Promise.all([
        aiService.generateInsights(data),
        aiService.generatePredictions(data),
        aiService.generateReportSummary(data)
      ]);
      setInsights(insightsResult);
      setPredictions(predictionsResult);
      setReportSummary(reportResult);
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await generateAIContent();
    }
  };

  useEffect(() => {
    generateAIContent();
  }, [data]);

  return (
    <div id="ai-insights-section" className="space-y-6">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI-Powered Insights
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Gemini AI
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Key Insights
            </h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Predictions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Predictions
            </h3>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : predictions ? (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Next Month Revenue Forecast
                </h4>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {predictions.nextMonthRevenue}
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                  User Growth Forecast
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {predictions.userGrowthForecast}
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-1">
                  Budget Recommendation
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {predictions.recommendedBudgetAllocation}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Executive Summary
          </h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {reportSummary}
            </p>
          </div>
        )}
      </div>

      {/* API Key Notice */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                AI Features Available
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Add your Gemini API key to <code>.env</code> file as <code>VITE_GEMINI_API_KEY</code> to enable real AI-powered insights.
                Currently showing intelligent fallback analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};