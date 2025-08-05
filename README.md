# AI-Powered Analytics Dashboard

A modern, interactive analytics dashboard built with React, TypeScript, and Vite, enhanced with AI capabilities. This project was developed with the assistance of GitHub Copilot and Claude AI.

![Dashboard Preview](./preview.png)

## 🌟 Key Features

### Real-Time Analytics
- Live updating metrics and KPIs
- Interactive data visualizations
- Real-time data refresh every 10 seconds
- Responsive design for all screen sizes

### AI-Powered Insights
- Smart data analysis using Google's Gemini AI
- Automated trend detection
- Predictive analytics
- Natural language insights and recommendations
- Fallback analysis when AI is unavailable

### Interactive Visualizations
- Revenue trend analysis
- User acquisition breakdown
- Traffic source distribution
- Campaign performance metrics

### Data Management
- Sortable and searchable data tables
- Pagination for large datasets
- Filter and export capabilities
- Dark/Light theme support

## 🔧 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Recharts** for data visualization

### AI Integration
- **Google Generative AI (Gemini)** for intelligent insights
- Three main AI features:
  1. Trend Analysis & Insights
  2. Predictive Analytics
  3. Executive Summary Generation

### Components Structure
```
App.tsx
└── ThemeProvider (Dark/Light mode)
    └── Dashboard (Main container)
        ├── Header (Navigation & controls)
        ├── MetricsGrid (KPI display)
        ├── AIInsights (AI-powered analysis)
        ├── ChartsSection (Data visualization)
        └── DataTable (Campaign performance)
```

## 💡 Smart Features

### AI-Powered Analytics
1. **Intelligent Insights**
   - Pattern recognition in campaign performance
   - Trend analysis and anomaly detection
   - Actionable recommendations

2. **Predictive Analytics**
   - Revenue forecasting
   - User growth predictions
   - Budget allocation suggestions

3. **Smart Reporting**
   - Automated executive summaries
   - Performance highlights
   - Strategic recommendations

### Data Visualization
- Interactive line and area charts
- Dynamic bar charts
- Responsive pie charts
- Real-time data updates

### User Experience
- Responsive design
- Dark/Light theme
- Interactive tables with sorting and filtering
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Installation
1. Clone the repository
\`\`\`bash
git clone [repository-url]
cd ai-powered-dashboard
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your Gemini API key (optional)
\`\`\`
VITE_GEMINI_API_KEY=your-api-key
\`\`\`

4. Start development server
\`\`\`bash
npm run dev
\`\`\`

## 🎨 Features in Detail

### 1. Dashboard Overview
- Real-time metrics display
- Key performance indicators
- Interactive charts and graphs
- AI-powered insights section

### 2. Campaign Analytics
- Campaign performance tracking
- ROI analysis
- Channel effectiveness
- Conversion metrics

### 3. User Acquisition
- Traffic source analysis
- User behavior tracking
- Growth metrics
- Channel performance

### 4. AI Features
- Smart trend detection
- Predictive analytics
- Automated reporting
- Strategic recommendations

## 🛠 Development Tools

### AI Assistance
- **GitHub Copilot**: Code completion and suggestions
- **Claude AI**: Project architecture and problem-solving

### Development Environment
- VS Code
- TypeScript
- ESLint
- Prettier

## 📊 Data Management

### Real-time Updates
- Mock data generation for testing
- 10-second refresh interval
- Smooth state transitions
- Error handling and fallbacks

### State Management
- React hooks for local state
- Context for theme management
- TypeScript interfaces for type safety

## 🔐 Security

- Environment variable protection
- API key security
- Error boundary implementation
- Secure data handling

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with assistance from GitHub Copilot and Claude AI
- Uses Google's Generative AI (Gemini) for intelligent features
- React and Vite communities for excellent tools
- TailwindCSS for the styling framework
- Recharts for data visualization components
