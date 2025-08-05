import { AnalyticsData } from '../types';

class QwenAIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private modelName = 'mistralai/mistral-small-3.2-24b-instruct:free';  // Using Mistral Small 3.2 24B - free model
  private lastRequestTime = 0;
  private rateLimitDelay = 10000; // 10 seconds between requests for free tier

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  }

  private async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      await this.waitForRateLimit();
      const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ADmyBRAND Analytics Dashboard'
          },
          signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          temperature: 0.7,
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: 'You are ADmyBRAND Analytics AI assistant. Focus on analyzing marketing metrics, campaign performance, and ROI for digital advertising campaigns. Provide data-driven insights based on revenue, user growth, conversions, and campaign performance metrics. Keep responses concise and actionable.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (response.status === 429) {
        console.log('Rate limit hit, using fallback data...');
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`API request failed: ${response.status} ${response.statusText} - ${errorData}`);
        
        // If the primary model fails, the API will automatically try the fallback model
        // If both fail, throw the error
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Qwen AI Service Error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateInsights(data: AnalyticsData): Promise<{ insights: string[]; isAI: boolean }> {
    try {
      const prompt = `
        Analyze this digital marketing data and provide 3-4 key insights and actionable recommendations:
        
        Metrics:
        - Revenue: ${data.metrics.find((m: { id: string }) => m.id === 'revenue')?.value}
        - Users: ${data.metrics.find((m: { id: string }) => m.id === 'users')?.value}
        - Conversions: ${data.metrics.find((m: { id: string }) => m.id === 'conversions')?.value}
        - Growth Rate: ${data.metrics.find((m: { id: string }) => m.id === 'growth')?.value}
        
        Top Performing Campaigns:
        ${data.tableData.slice(0, 3).map((campaign: any) => 
          `- ${campaign.campaign}: $${campaign.revenue.toLocaleString()} revenue, ${campaign.roas}% ROAS`
        ).join('\n')}
        
        Traffic Sources:
        ${data.trafficSources.map((source: any) => 
          `- ${source.name}: ${source.value.toFixed(1)}%`
        ).join('\n')}

        Provide insights in bullet points, focusing on actionable recommendations and optimization opportunities.
        Format: One insight per line, no bullet points or numbers.
        Add "[AI Analysis]" at the start of each insight.
      `;

      const response = await this.makeRequest(prompt);
      return { 
        insights: response.split('\n').filter(line => line.trim().length > 0).slice(0, 4),
        isAI: true 
      };
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      if (error instanceof Error) {
        if (error.message === 'Rate limit exceeded') {
          console.log('Using fallback data due to rate limit');
        } else if (error.message === 'Request timed out') {
          console.log('Using fallback data due to timeout');
        }
      }
      // Fallback logic
      const revenueMetric = data.metrics.find((m: { id: string }) => m.id === 'revenue');
      const growthMetric = data.metrics.find((m: { id: string }) => m.id === 'growth');
      const topCampaign = data.tableData.sort((a: any, b: any) => b.revenue - a.revenue)[0];
      
      const fallbackInsights = [
        `[Data Analysis] Revenue is ${revenueMetric?.change && revenueMetric.change > 0 ? 'growing' : 'declining'} at ${Math.abs(revenueMetric?.change || 0)}% - ${revenueMetric?.change && revenueMetric.change > 0 ? 'maintain momentum with current strategies' : 'consider optimizing underperforming campaigns'}`,
        `[Data Analysis] ${topCampaign?.campaign} is your top performer with $${topCampaign?.revenue.toLocaleString()} revenue - scale similar campaigns`,
        `[Data Analysis] Growth rate of ${growthMetric?.value} indicates ${Number(growthMetric?.value.replace('%', '')) > 20 ? 'strong' : 'moderate'} market expansion`,
        `[Data Analysis] Focus budget on high-ROAS channels like ${data.tableData.filter((c: any) => c.roas > 250).map((c: any) => c.channel).join(', ')}`
      ];

      return { insights: fallbackInsights, isAI: false };
    }
  }

  async generatePredictions(data: AnalyticsData): Promise<{
    nextMonthRevenue: string;
    userGrowthForecast: string;
    recommendedBudgetAllocation: string;
    isAI: boolean;
  }> {
    try {
      const prompt = `
        Based on this marketing data, predict:
        1. Next month's revenue
        2. User growth forecast
        3. Recommended budget allocation

        Current Metrics:
        - Revenue: ${data.metrics.find((m: { id: string }) => m.id === 'revenue')?.value}
        - Users: ${data.metrics.find((m: { id: string }) => m.id === 'users')?.value}
        - Conversions: ${data.metrics.find((m: { id: string }) => m.id === 'conversions')?.value}
        - Growth Rate: ${data.metrics.find((m: { id: string }) => m.id === 'growth')?.value}

        Campaign Performance:
        ${data.tableData.map((campaign: any) => 
          `- ${campaign.campaign}: Revenue=$${campaign.revenue}, ROAS=${campaign.roas}%, Spend=$${campaign.spend}`
        ).join('\n')}

        Format the response exactly like this example:
        Next Month Revenue: $1,234,567 (±5%)
        User Growth: Expect 15% increase in user acquisition
        Budget Allocation: Increase spend on Facebook by 20%, maintain Google Ads, reduce Twitter by 10%
      `;

      const response = await this.makeRequest(prompt);
      const [revenueLine, growthLine, budgetLine] = response.split('\n');

      return {
        nextMonthRevenue: revenueLine.replace('Next Month Revenue: ', ''),
        userGrowthForecast: growthLine.replace('User Growth: ', ''),
        recommendedBudgetAllocation: budgetLine.replace('Budget Allocation: ', ''),
        isAI: true
      };
    } catch (error) {
      console.error('Failed to generate AI predictions:', error);
      if (error instanceof Error) {
        if (error.message === 'Rate limit exceeded') {
          console.log('Using fallback data due to rate limit');
        } else if (error.message === 'Request timed out') {
          console.log('Using fallback data due to timeout');
        }
      }
      const revenue = data.metrics.find((m: { id: string }) => m.id === 'revenue');
      const growth = data.metrics.find((m: { id: string }) => m.id === 'growth');
      const bestRoas = Math.max(...data.tableData.map((c: any) => c.roas));
      const bestChannel = data.tableData.find((c: any) => c.roas === bestRoas)?.channel;

      return {
        nextMonthRevenue: `$${((Number(revenue?.value.replace(/[$,]/g, '')) || 0) * 1.1).toLocaleString()} (based on historical growth)`,
        userGrowthForecast: `Projected ${growth?.value} based on current trend`,
        recommendedBudgetAllocation: `Increase investment in ${bestChannel} due to highest ROAS of ${bestRoas}%`,
        isAI: false
      };
    }
  }

  async generateReportSummary(data: AnalyticsData): Promise<{ summary: string; isAI: boolean }> {
    try {
      const prompt = `
        Create a concise executive summary of this marketing performance data:

        Metrics:
        - Revenue: ${data.metrics.find((m: { id: string }) => m.id === 'revenue')?.value}
        - Users: ${data.metrics.find((m: { id: string }) => m.id === 'users')?.value}
        - Conversions: ${data.metrics.find((m: { id: string }) => m.id === 'conversions')?.value}
        - Growth Rate: ${data.metrics.find((m: { id: string }) => m.id === 'growth')?.value}

        Campaign Performance:
        ${data.tableData.map((campaign: any) => 
          `- ${campaign.campaign}: Revenue=$${campaign.revenue}, ROAS=${campaign.roas}%, Spend=$${campaign.spend}`
        ).join('\n')}

        Write a 3-paragraph summary focusing on:
        1. Overall performance and key metrics
        2. Top performing campaigns and channels
        3. Recommendations for optimization

        Start with "[AI Analysis]"
      `;

      const response = await this.makeRequest(prompt);
      return { summary: response, isAI: true };
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      if (error instanceof Error) {
        if (error.message === 'Rate limit exceeded') {
          console.log('Using fallback data due to rate limit');
        } else if (error.message === 'Request timed out') {
          console.log('Using fallback data due to timeout');
        }
      }
      const revenue = data.metrics.find((m: { id: string }) => m.id === 'revenue');
      const growth = data.metrics.find((m: { id: string }) => m.id === 'growth');
      const topCampaign = data.tableData.sort((a: any, b: any) => b.revenue - a.revenue)[0];
      const topRoas = data.tableData.sort((a: any, b: any) => b.roas - a.roas)[0];

      const fallbackSummary = `[Data Analysis]

Overall marketing performance shows ${revenue?.change && revenue.change > 0 ? 'positive' : 'challenging'} results with revenue ${revenue?.change && revenue.change > 0 ? 'growing' : 'declining'} at ${Math.abs(revenue?.change || 0)}% and a growth rate of ${growth?.value}.

${topCampaign.campaign} leads revenue generation with $${topCampaign.revenue.toLocaleString()}, while ${topRoas.campaign} demonstrates highest efficiency with ${topRoas.roas}% ROAS.

Recommended focus areas: Scale successful campaigns like ${topCampaign.campaign}, optimize or pause underperforming channels, and reallocate budget to high-ROAS campaigns for maximum ROI.`;

      return { summary: fallbackSummary, isAI: false };
    }
  }
}

export const qwenAIService = new QwenAIService();