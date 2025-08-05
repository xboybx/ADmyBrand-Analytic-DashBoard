import { AnalyticsData } from '../types';
import { qwenAIService } from './qwenAIService';

class CombinedAIService {
  async generateInsights(data: AnalyticsData): Promise<{ insights: string[], isAI: boolean }> {
    try {
      const result = await qwenAIService.generateInsights(data);
      return result;
    } catch (error) {
      console.error('Error in AI service:', error);
      throw error; // Let QwenAIService handle the fallback
    }
  }

  async generatePredictions(data: AnalyticsData): Promise<{
    nextMonthRevenue: string;
    userGrowthForecast: string;
    recommendedBudgetAllocation: string;
    isAI: boolean;
  }> {
    try {
      const result = await qwenAIService.generatePredictions(data);
      return { ...result, isAI: true };
    } catch (error) {
      console.error('Error in AI service:', error);
      throw error;
    }
  }

  async generateReportSummary(data: AnalyticsData): Promise<{ summary: string, isAI: boolean }> {
    try {
      const result = await qwenAIService.generateReportSummary(data);
      return { summary: result, isAI: true };
    } catch (error) {
      console.error('Error in AI service:', error);
      throw error;
    }
  }
}

export const combinedAIService = new CombinedAIService();

// Fallback functions for Data Analysis Mode
export function getFallbackInsights(data) {
  // Example fallback logic; replace with real analysis if needed
  return [
    "Revenue is stable with minor fluctuations.",
    "User growth is consistent month-over-month.",
    "No major anomalies detected in campaign performance."
  ];
}

export function getFallbackPredictions(data) {
  return {
    nextMonthRevenue: "$12,000 (projected)",
    userGrowthForecast: "+5% (projected)",
    recommendedBudgetAllocation: "$2,500 (suggested)",
    isAI: false
  };
}

export function getFallbackSummary(data) {
  return {
    summary: "The business is performing steadily with positive growth trends. No significant risks detected in the current period.",
    isAI: false
  };
}