# 📊 Data Visualizations & Metrics Documentation

## 1. Metrics Grid
**Location**: Top of dashboard
**Updates**: Every 10 seconds
**Metrics Displayed**:
- **Revenue**
  - Total revenue from all campaigns
  - Change percentage from previous period
  - Calculation: Sum of all campaign revenues
- **Active Users**
  - Current active user count
  - Growth rate comparison
  - Calculation: Sum of users across all channels
- **Conversions**
  - Total conversion count
  - Conversion rate change
  - Calculation: Sum of conversions across campaigns
- **Growth Rate**
  - Overall business growth indicator
  - Period-over-period comparison
  - Calculation: ((Current - Previous) / Previous) × 100

## 2. Revenue Trend Chart (Area Chart)
**Location**: Main chart section
**Type**: Interactive Area Chart
**Data Points**:
- X-axis: Last 12 months
- Y-axis: Revenue in thousands ($k)
**Features**:
- Gradient fill for visual appeal
- Hover tooltips with exact values
- Monthly revenue progression
- Calculation: Monthly aggregated revenue data

## 3. User Acquisition Chart (Bar Chart)
**Location**: Left chart in second row
**Type**: Vertical Bar Chart
**Metrics**:
- Channel-wise user acquisition
- Comparative channel performance
**Channels Tracked**:
- Organic Search
- Paid Search
- Social Media
- Email Marketing
- Direct Traffic
**Calculation**: User count per acquisition channel

## 4. Traffic Sources Chart (Pie Chart)
**Location**: Right chart in second row
**Type**: Interactive Pie Chart
**Metrics**:
- Traffic source distribution
- Percentage share of each source
**Sources Analyzed**:
- Organic Search
- Paid Search
- Social Media
- Direct Traffic
- Email
- Other Sources
**Calculation**: (Source Traffic / Total Traffic) × 100

## 5. Campaign Performance Table
**Location**: Bottom section
**Type**: Interactive Data Grid
**Metrics Per Campaign**:
- Campaign Name
- Channel
- Impressions
- Clicks
- Conversions
- Revenue
- ROAS (Return on Ad Spend)
**Calculations**:
- CTR (Click-Through Rate) = (Clicks / Impressions) × 100
- Conversion Rate = (Conversions / Clicks) × 100
- ROAS = (Revenue / Ad Spend) × 100

## 6. AI Analysis Metrics
**Location**: AI Insights Section
**Types of Analysis**:
1. **Trend Analysis**
   - Pattern recognition in revenue data
   - Growth rate calculations
   - Performance comparisons

2. **Predictive Metrics**
   - Next month revenue forecast
   - User growth projections
   - Budget recommendations
   **Calculations**:
   - Revenue Forecast: ML model or historical trend analysis
   - Growth Projection: Weighted average of historical growth rates
   - Budget Allocation: Based on ROAS and performance trends

3. **Performance Indicators**
   - Campaign effectiveness scores
   - Channel performance ratings
   - ROI calculations
   **Calculations**:
   - Campaign Score = (ROAS × Conversion Rate × Traffic Quality)
   - Channel Rating = (Revenue Generated / Channel Cost) × Performance Factor
   - ROI = ((Revenue - Cost) / Cost) × 100

## 7. Data Refresh Mechanisms
- Real-time data updates every 10 seconds
- Smooth transitions between updates
- Historical data comparison
- Performance trend analysis
- Auto-scaling for all metrics

## 8. Custom Calculations
1. **Traffic Quality Score**
   - Bounce Rate Weight: 30%
   - Session Duration Weight: 35%
   - Pages/Session Weight: 35%
   - Formula: (BR × 0.3) + (SD × 0.35) + (PS × 0.35)

2. **Campaign Efficiency Index**
   - ROAS Impact: 40%
   - Conversion Rate Impact: 35%
   - Click-Through Rate Impact: 25%
   - Formula: (ROAS × 0.4) + (CR × 0.35) + (CTR × 0.25)

3. **Growth Velocity**
   - Current Growth Rate
   - Historical Growth Pattern
   - Market Trend Adjustment
   - Formula: (CGR + HGP + MTA) / 3 × Seasonality Factor
