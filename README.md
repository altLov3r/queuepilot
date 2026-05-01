# QueuePilot

**AI-Powered Support Ticket Triage for Small Teams**

QueuePilot is a web application that helps small businesses quickly identify and prioritize customer support tickets using AI analysis. It automatically categorizes messages, detects urgency and sentiment, and provides suggested replies—helping teams respond faster to customers who need it most.

![QueuePilot Demo](https://img.shields.io/badge/Status-Demo%20Ready-success)
![Built with IBM Bob](https://img.shields.io/badge/Built%20with-IBM%20Bob-blue)
![watsonx.ai Ready](https://img.shields.io/badge/watsonx.ai-Integration%20Ready-purple)

## 🌐 Live Demo

**Try it now:** [https://queuepilot-teal.vercel.app](https://queuepilot-teal.vercel.app)

**Quick Demo:** Click "⚡ Judge Demo Mode" for an instant impressive demonstration!

**API Endpoint:** [https://queuepilot-backend.vercel.app](https://queuepilot-backend.vercel.app)

## 🎯 Problem Statement

Small businesses receive dozens of customer support messages daily across multiple channels. Without proper triage, teams struggle to:
- Identify which tickets need immediate attention
- Detect angry or frustrated customers before issues escalate
- Prioritize workload effectively
- Maintain consistent response quality

**QueuePilot solves this** by instantly analyzing all incoming tickets and providing actionable insights, allowing support teams to focus on what matters most.

## ✨ Features

### Core Functionality
- **Smart Categorization**: Automatically sorts tickets into delivery, refund, billing, bug, complaint, or general categories
- **Urgency Detection**: Identifies high, medium, and low priority tickets based on content analysis
- **Sentiment Analysis**: Detects positive, neutral, frustrated, or angry customer emotions
- **Reply Suggestions**: Generates professional, context-aware response templates
- **Internal Action Notes**: Provides specific recommendations for support team members
- **Summary Dashboard**: Shows aggregate metrics and recommended actions

### User Experience
- **One-Click Demo**: Load 15 realistic demo tickets instantly
- **Bulk Analysis**: Paste multiple tickets at once, separated by "---"
- **Visual Badges**: Color-coded urgency, category, and sentiment indicators
- **Export Options**: Download results as JSON or CSV
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Fallback AI Analyzer**: Keyword-based classification that works without external APIs
- **watsonx.ai Ready**: Architecture designed for easy IBM watsonx.ai integration
- **Fast Performance**: Analyzes 15 tickets in under 2 seconds
- **No Database Required**: Stateless design for easy deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS-in-JS** - Inline styling for component isolation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web server framework
- **ES Modules** - Modern JavaScript syntax

### AI/ML
- **Fallback Analyzer** - Rule-based classification using keyword patterns
- **watsonx.ai Adapter** - Ready for IBM watsonx.ai integration (placeholder implementation)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
cd queuepilot
```

2. **Install all dependencies**
```bash
npm run install:all
```

This will install dependencies for the root, client, and server.

### Running the Application

**Start both frontend and backend:**
```bash
npm run dev
```

This starts:
- Backend API server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

**Or run them separately:**

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 How to Use

### Demo Flow (3 minutes)

1. **Landing Page**
   - Click "Try Demo" button

2. **Ticket Input Screen**
   - Click "Load Demo Tickets" to populate with 15 realistic examples
   - Or paste your own support messages (separate with "---")
   - Click "Analyze Tickets"

3. **Dashboard Screen**
   - View summary statistics at the top
   - See all analyzed tickets sorted by urgency (high first)
   - Expand any ticket to see suggested reply and action notes
   - Export results as JSON or CSV

### Using Your Own Tickets

Paste customer messages in this format:
```
My order is late and I'm very frustrated!

---

Thank you for the excellent service!

---

I was charged twice for my order. Please refund.
```

## 🏗️ Project Structure

```
queuepilot/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx     # Welcome screen
│   │   │   ├── TicketInput.jsx     # Input interface
│   │   │   ├── Dashboard.jsx       # Results view
│   │   │   ├── TicketCard.jsx      # Individual ticket display
│   │   │   ├── SummaryPanel.jsx    # Aggregate statistics
│   │   │   └── Badge.jsx           # Visual indicators
│   │   ├── utils/
│   │   │   └── exportUtils.js      # JSON/CSV export
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # Global styles
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express backend
│   ├── src/
│   │   ├── analyzer/
│   │   │   ├── fallbackAnalyzer.js # Keyword-based AI
│   │   │   └── watsonxAdapter.js   # watsonx.ai interface
│   │   ├── data/
│   │   │   └── demoTickets.js      # Sample data
│   │   ├── routes/
│   │   │   └── analyze.js          # API endpoints
│   │   └── server.js               # Express server
│   └── package.json
├── README.md                        # This file
├── DEVELOPMENT_LOG.md              # IBM Bob contributions
├── SUBMISSION_TEXT.md              # Hackathon submission
└── package.json                    # Root package file
```

## 🔌 API Endpoints

### POST /api/analyze
Analyze support tickets

**Request:**
```json
{
  "tickets": [
    {
      "id": 1,
      "message": "My order is late!"
    }
  ]
}
```

**Response:**
```json
{
  "tickets": [
    {
      "id": 1,
      "message": "My order is late!",
      "category": "delivery",
      "urgency": "high",
      "sentiment": "frustrated",
      "suggestedReply": "I understand your concern...",
      "internalAction": "Check shipping status immediately..."
    }
  ],
  "summary": {
    "total": 1,
    "highUrgency": 1,
    "negativeSentiment": 1,
    "topCategory": "delivery",
    "recommendedAction": "Prioritize delivery tickets..."
  }
}
```

### GET /api/demo-tickets
Get demo ticket data

### GET /api/config
Get system configuration and watsonx.ai status

### GET /api/health
Health check endpoint

## 🤖 How IBM Bob Helped Build This Project

IBM Bob was instrumental in every phase of QueuePilot's development:

### Planning Phase
- Created comprehensive project architecture
- Designed the fallback analyzer algorithm
- Planned the watsonx.ai integration strategy
- Structured the component hierarchy

### Development Phase
- Generated all backend code (server, routes, analyzers)
- Built all React components with proper state management
- Implemented export utilities (JSON/CSV)
- Created demo data with realistic scenarios

### Documentation Phase
- Wrote this comprehensive README
- Created development logs
- Prepared hackathon submission materials

**See [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) for detailed contributions.**

## 🔮 watsonx.ai Integration

QueuePilot is designed with watsonx.ai integration in mind:

### Current Implementation
- Fallback analyzer using keyword-based classification
- Works without external API dependencies
- Provides consistent, predictable results

### watsonx.ai Integration Path

The `watsonxAdapter.js` module is ready for integration:

1. **Install IBM watsonx.ai SDK**
```bash
cd server
npm install @ibm-cloud/watsonx-ai
```

2. **Set Environment Variables**
```bash
export WATSONX_API_KEY="your-api-key"
export WATSONX_PROJECT_ID="your-project-id"
```

3. **Update the Adapter**
The adapter already includes:
- Prompt construction for ticket analysis
- Configuration checking
- Error handling structure

4. **Switch Analyzers**
Modify `server/src/routes/analyze.js` to use watsonx.ai when available:
```javascript
const result = isWatsonXAvailable() 
  ? await analyzeTicketsWithWatsonX(tickets)
  : analyzeTickets(tickets);
```

### Benefits of watsonx.ai Integration
- More nuanced sentiment detection
- Better context understanding
- Improved reply generation
- Multi-language support
- Continuous learning capabilities

## 🧪 Testing

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] Demo tickets load successfully
- [ ] Custom tickets can be pasted and parsed
- [ ] Analysis completes without errors
- [ ] All badges display correctly
- [ ] Ticket cards expand/collapse
- [ ] Summary statistics are accurate
- [ ] JSON export downloads
- [ ] CSV export downloads
- [ ] Navigation works (back buttons, new analysis)

### Test the API Directly
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"tickets":[{"id":1,"message":"My order is late!"}]}'
```

## 🎬 Demo Script (3 Minutes)

**[0:00-0:30] Introduction**
- "Hi, I'm demonstrating QueuePilot, an AI-powered support ticket triage system"
- "Small businesses struggle to prioritize customer support messages"
- "QueuePilot solves this by instantly analyzing urgency, sentiment, and category"

**[0:30-1:00] Landing Page**
- Show the landing page
- Highlight the four key features
- Click "Try Demo"

**[1:00-1:30] Ticket Input**
- Click "Load Demo Tickets"
- Show the 15 realistic examples
- Explain the separator format
- Click "Analyze Tickets"

**[1:30-2:30] Dashboard**
- Show summary panel with key metrics
- Point out high urgency tickets at the top
- Expand a ticket to show suggested reply
- Show the internal action note
- Demonstrate export to JSON and CSV

**[2:30-3:00] Closing**
- "Built with IBM Bob's assistance"
- "Ready for watsonx.ai integration"
- "Helps teams respond faster to customers who need it most"

## 📝 Future Enhancements

- [ ] Real-time ticket monitoring
- [ ] Email integration (IMAP/SMTP)
- [ ] Multi-language support
- [ ] Team assignment suggestions
- [ ] Historical analytics dashboard
- [ ] Mobile app version
- [ ] Slack/Teams integration
- [ ] Custom category training
- [ ] SLA tracking
- [ ] Customer satisfaction prediction

## 🤝 Contributing

This is a hackathon project, but suggestions are welcome! Please open an issue to discuss potential changes.

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own ticket triage system.

## 🙏 Acknowledgments

- **IBM Bob** - AI assistant that helped plan, build, and document this project
- **IBM watsonx.ai** - Target platform for production AI integration
- **React & Vite** - Excellent developer experience
- **Express** - Simple and powerful backend framework

## 📧 Support

For questions or issues:
1. Check the [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) for implementation details
2. Review the API documentation above
3. Examine the code comments in each file

---

**Built for the IBM Bob Dev Day Hackathon**

*Demonstrating how AI can help small businesses provide better customer support*