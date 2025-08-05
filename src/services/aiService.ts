import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyticsData } from '../types';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateInsights(data: AnalyticsData): Promise<string[]> {
    if (!this.genAI) {
      return this.getFallbackInsights(data);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Analyze this digital marketing data and provide 3-4 key insights and actionable recommendations:
        
        Metrics:
        - Revenue: ${data.metrics.find(m => m.id === 'revenue')?.value}
        - Users: ${data.metrics.find(m => m.id === 'users')?.value}
        - Conversions: ${data.metrics.find(m => m.id === 'conversions')?.value}
        - Growth Rate: ${data.metrics.find(m => m.id === 'growth')?.value}
        
        Top Performing Campaigns:
        ${data.tableData.slice(0, 3).map(campaign => 
          `- ${campaign.campaign}: $${campaign.revenue.toLocaleString()} revenue, ${campaign.roas}% ROAS`
        ).join('\n')}
        
        Traffic Sources:
        ${data.trafficSources.map(source => 
          `- ${source.name}: ${source.value.toFixed(1)}%`
        ).join('\n')}
        
        Please provide insights in a concise, actionable format. Focus on optimization opportunities and trends.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text.split('\n').filter(line => line.trim().length > 0).slice(0, 4);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackInsights(data);
    }
  }

  async generatePredictions(data: AnalyticsData): Promise<{
    nextMonthRevenue: string;
    userGrowthForecast: string;
    recommendedBudgetAllocation: string;
  }> {
    if (!this.genAI) {
      return this.getFallbackPredictions(data);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const revenueData = data.revenueData.slice(-6).map(d => d.revenue).join(', ');
      
      const prompt = `
        Based on this revenue trend data (last 6 months): ${revenueData}
        Current metrics: Revenue ${data.metrics.find(m => m.id === 'revenue')?.value}, 
        Growth ${data.metrics.find(m => m.id === 'growth')?.value}
        
        Provide predictions for:
        1. Next month's revenue forecast
        2. User growth forecast for next quarter
        3. Recommended budget allocation strategy
        
        Format as JSON with keys: nextMonthRevenue, userGrowthForecast, recommendedBudgetAllocation
        Keep responses concise and specific.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
      }
      
      return this.getFallbackPredictions(data);
    } catch (error) {
      console.error('AI Prediction Error:', error);
      return this.getFallbackPredictions(data);
    }
  }

  async generateReportSummary(data: AnalyticsData): Promise<string> {
    if (!this.genAI) {
      return this.getFallbackReport(data);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Generate a professional executive summary for this digital marketing performance report:
        
        Key Metrics:
        ${data.metrics.map(m => `- ${m.label}: ${m.value} (${m.change > 0 ? '+' : ''}${m.change}%)`).join('\n')}
        
        Top 3 Campaigns by Revenue:
        ${data.tableData
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3)
          .map((c, i) => `${i + 1}. ${c.campaign}: $${c.revenue.toLocaleString()} (${c.roas}% ROAS)`)
          .join('\n')}
        
        Write a 2-3 paragraph executive summary highlighting key achievements, trends, and strategic recommendations.
        Keep it professional and data-driven.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Report Error:', error);
      return this.getFallbackReport(data);
    }
  }

  private getFallbackInsights(data: AnalyticsData): string[] {
    const revenueMetric = data.metrics.find(m => m.id === 'revenue');
    const growthMetric = data.metrics.find(m => m.id === 'growth');
    const topCampaign = data.tableData.sort((a, b) => b.revenue - a.revenue)[0];
    
    return [
      `Revenue is ${revenueMetric?.change && revenueMetric.change > 0 ? 'growing' : 'declining'} at ${Math.abs(revenueMetric?.change || 0)}% - ${revenueMetric?.change && revenueMetric.change > 0 ? 'maintain momentum with current strategies' : 'consider optimizing underperforming campaigns'}`,
      `${topCampaign?.campaign} is your top performer with $${topCampaign?.revenue.toLocaleString()} revenue - scale similar campaigns`,
      `Growth rate of ${growthMetric?.value} indicates ${Number(growthMetric?.value.replace('%', '')) > 20 ? 'strong' : 'moderate'} market expansion`,
      `Focus budget on high-ROAS channels like ${data.tableData.filter(c => c.roas > 250).map(c => c.channel).join(', ')}`
    ];
  }

  private getFallbackPredictions(data: AnalyticsData) {
    const currentRevenue = data.revenueData[data.revenueData.length - 1]?.revenue || 100;
    const avgGrowth = data.revenueData.length > 1 ? 
      ((data.revenueData[data.revenueData.length - 1].revenue - data.revenueData[0].revenue) / data.revenueData[0].revenue) * 100 / data.revenueData.length : 5;
    
    return {
      nextMonthRevenue: `$${Math.round(currentRevenue * (1 + avgGrowth / 100) * 1000).toLocaleString()}`,
      userGrowthForecast: `${Math.round(avgGrowth * 1.2)}% quarterly growth expected`,
      recommendedBudgetAllocation: `Increase spend on ${data.tableData.sort((a, b) => b.roas - a.roas)[0]?.channel} by 25%`
    };
  }

  private getFallbackReport(data: AnalyticsData): string {
    const revenueMetric = data.metrics.find(m => m.id === 'revenue');
    const topCampaign = data.tableData.sort((a, b) => b.revenue - a.revenue)[0];
    
    return `Performance Summary: Our digital marketing efforts generated ${revenueMetric?.value} in revenue this period, representing a ${revenueMetric?.change}% change from last month. The ${topCampaign?.campaign} campaign emerged as our top performer, delivering exceptional results with a ${topCampaign?.roas}% return on ad spend.\n\nLooking ahead, the data suggests continued growth opportunities, particularly in our highest-performing channels. We recommend maintaining current successful strategies while optimizing underperforming campaigns to maximize overall portfolio performance.`;
  }
}

export const aiService = new AIService();