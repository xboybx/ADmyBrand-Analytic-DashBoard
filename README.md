# ADmyBRAND AI-Powered Analytics Dashboard

A next-generation analytics dashboard for digital marketing, combining real-time metrics, interactive visualizations, and AI-driven insights. Built with React, TypeScript, and Vite, this app empowers users to make smarter business decisions with the help of advanced AI tools and custom business logic.


## 🚀 Features
- Real-time analytics and live KPI updates
- AI-powered insights and recommendations (Gemini AI)
- Revenue trend, user acquisition, and traffic source charts
- Sortable, searchable, and exportable data tables
- Responsive design with dark/light mode
- Fallback logic for mock data when no AI key is present

## 🏗️ Technical Architecture
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **AI Integration:** Google Gemini API (with fallback to mock data)

### Component Structure
```
App.tsx
└── ThemeProvider
    └── Dashboard
        ├── Header
        ├── MetricsGrid
        ├── AIInsights
        ├── ChartsSection
        └── DataTable
```

## 🤖 AI Usage Report
### AI Tools Used
- GitHub Copilot, Trae, Bolt AI
- Used for: UI scaffolding, bug fixes, code suggestions, layout, and structure

### Sample Prompts
1. **"create a web project consist of dash board in modren ui/ux design-use Reactjs,tailwind css it should have different sections of stats ,ai powered insights ,campaign Performance table use high statistics calccutations to get the stats data correctly and dispaly Average revenue ,active users etc ny calculating ,the code should be efficient and fast and i am going to use Gemini ai api key to get ai result responses make a placeholder for it."**
2. **"If the user doesn't provide an AI key, make sure the dashboard still works by showing mock data. How can I implement this fallback logic?"**
3. **"I'm getting a TypeScript error in my DataTable component—can you help me fix it so the download button shows a loading spinner while generating a PDF?"**
4. **the system prompt is bit messy .clean the syystem pompt in ai service.ts by keepng the backticks correctly"**
5. **"I want the AI insights section to summarize campaign performance in plain English. How can I use Gemini API for this, and what should the fallback be if the API fails?"**

### AI vs Manual Work Split
- AI-generated: ~60% (UI, boilerplate, bug fixes)
- Manual: ~40% (custom logic for revenue, fallback flows, analytics)
- Customization: AI code adapted to business logic, especially for analytics and fallback scenarios


---

## ⚠️ AI API Key & Model Usage
- **To activate AI-powered recommendations and insights, you must add your API key to the `.env` file as `VITE_GEMINI_API_KEY`.**
- If no valid API key is provided, the dashboard will automatically use fallback logic to display results using basic math and mock data.
- Free AI models (including Gemini, Mistral, Qwen) may have strict rate limits and slower response times. If you exceed your quota or need faster/more reliable results, consider upgrading to a paid plan or higher-tier model.
- For real-world production use, it is strongly recommended to use an upgraded AI model to support multiple requests and responses efficiently. The current implementation gracefully handles API failures and quota limits by showing computed results instead of AI-generated insights.

---

## ⚡ Installation
1. **Clone the repo:**
```bash
git clone [repository-url]
cd ai-powered-dashboard
```
2. **Install dependencies:**
```bash
npm install
```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key (optional)
```
VITE_GEMINI_API_KEY=your-api-key
```
4. **Start the dev server:**
```bash
npm run dev
```

## 📦 Additional Info
- Real-time metrics, AI-powered trend detection, and campaign analytics
- Secure API key handling and error boundaries
- Responsive, accessible UI

## 🙏 Acknowledgments
- Built with GitHub Copilot, Trae, and Bolt AI
- Uses Google's Generative AI (Gemini)
- Thanks to React, Vite, TailwindCSS, and Recharts communities