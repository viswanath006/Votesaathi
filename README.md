# VoteSaathi 🇮🇳

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0-4285F4)
![React](https://img.shields.io/badge/frontend-React%2019-61DAFB)

**Election Process Education Assistant | मतदाता जागरूकता, सशक्त लोकतंत्र**

VoteSaathi is an institutional-grade, full-stack educational platform designed to guide Indian citizens through the entire electoral process. It features an integrated AI assistant powered by **Google Gemini 2.0 Flash**, providing multilingual support to demystify voter registration, EVM usage, and polling procedures.

## 🌟 Key Features

*   **🤖 Multi-turn AI Assistant**: Intelligent chatbot powered by Google Gemini with conversation memory, safety settings, and streaming responses
*   **🌐 Multilingual Support**: Full support for English, Hindi, and Telugu using AI-powered translation
*   **📋 Voter Registration Guide**: Step-by-step guidance on eligibility, required documents, and application tracking
*   **🗳️ Voting Process Roadmap**: Visual lifecycle from candidate nomination to result declaration
*   **📠 EVM Information Center**: Educational breakdown of EVMs and VVPATs with Myth vs Fact section
*   **📊 Results & Counting Transparency**: Overview of vote counting with sample data visualizations
*   **🎯 AI-Powered Quiz Zone**: Dynamic quiz generation using Gemini structured output + static quiz bank
*   **🏆 Achievement Badges**: Progression system rewarding educational module completion
*   **📅 Election Timeline**: Live-tracking schedule for 2026 elections
*   **♿ WCAG Accessible**: Skip navigation, ARIA labels, keyboard navigation, font size controls, reduced motion support
*   **🔒 Security Hardened**: Helmet.js, rate limiting, input sanitization, CORS restrictions

## 🏗️ Architecture

```
VoteSaathi/
├── client/                    # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/        # (Modular component architecture)
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useChat.js     # Chat state management
│   │   ├── utils/             # Utilities and constants
│   │   │   ├── constants.js   # Static data (DRY)
│   │   │   └── api.js         # API service layer
│   │   ├── __tests__/         # Vitest + React Testing Library
│   │   ├── App.jsx            # Main application component
│   │   └── index.css          # Design system
│   └── vite.config.js         # Build + test configuration
│
├── server/                    # Node.js + Express Backend
│   ├── index.js               # Express server with security middleware
│   ├── gemini.js              # Google Gemini AI integration
│   ├── tests/                 # Vitest + Supertest API tests
│   │   └── api.test.js        # 20+ endpoint tests
│   └── .env.example           # Environment template
│
└── README.md
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 8 | UI rendering and build |
| **Styling** | Vanilla CSS, Framer Motion | Design system & animations |
| **Backend** | Node.js, Express 5 | API server |
| **AI** | Google Gemini 2.0 Flash | Multi-turn chat, quiz gen, translation |
| **Security** | Helmet.js, express-rate-limit | HTTP security & abuse prevention |
| **Testing** | Vitest, Supertest, React Testing Library | Unit & integration tests |
| **Icons** | Lucide React | Accessible SVG icons |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check + endpoint listing |
| `GET` | `/api/health` | Server uptime status |
| `POST` | `/api/chat` | Multi-turn AI chat (rate limited) |
| `POST` | `/api/chat/stream` | Streaming AI responses via SSE |
| `GET` | `/api/quiz` | Static quiz questions |
| `POST` | `/api/quiz/generate` | AI-generated quiz (Gemini structured output) |
| `GET` | `/api/timeline` | Election timeline data |
| `GET` | `/api/location/:state` | State-specific election info |
| `POST` | `/api/translate` | AI-powered text translation |

## 🔐 Security Features

- **Helmet.js**: Sets CSP, X-Content-Type-Options, X-Frame-Options, and more
- **Rate Limiting**: 100 req/15min general, 10 req/min for AI endpoints
- **Input Sanitization**: HTML tag stripping, length limits, type validation
- **CORS Restrictions**: Whitelisted origins only in production
- **Error Sanitization**: No stack traces or internal details leaked to clients
- **Body Size Limits**: 10kb max payload to prevent DoS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/viswanath006/Votesaathi.git
cd Votesaathi
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
node index.js
```
*(Server runs on http://localhost:5000)*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*(App runs on http://localhost:5173)*

### 4. Run Tests
```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test
```

## ♿ Accessibility (WCAG 2.1 AA)

- Skip navigation link for keyboard users
- ARIA labels on all interactive elements
- `aria-live` regions for dynamic content (chat)
- `aria-expanded` for accordion components
- Keyboard-navigable with visible focus indicators
- Font size controls (A+/A/A-)
- `prefers-reduced-motion` support
- High contrast mode support
- Semantic HTML landmarks (`main`, `nav`, `footer`, `aside`)
- Print stylesheet

## 🤖 Google Services Integration

1. **Google Gemini 2.0 Flash** — Primary AI engine
2. **Multi-turn Chat** — `startChat()` with conversation history
3. **Safety Settings** — HarmCategory filters for safe educational content
4. **Generation Config** — Tuned temperature, topK, topP, maxOutputTokens
5. **Structured Output** — JSON response mode for quiz generation
6. **Streaming** — `generateContentStream()` for real-time responses
7. **AI Translation** — Gemini-powered language translation
8. **Response Caching** — LRU cache to reduce API calls

## ⚖️ Disclaimer

VoteSaathi is an educational project and is not officially affiliated with the Election Commission of India (ECI). All official actions should be taken via [voters.eci.gov.in](https://voters.eci.gov.in/).

## 📄 License

MIT License © 2026 VoteSaathi Team