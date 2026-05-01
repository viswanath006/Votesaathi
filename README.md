# VoteSaathi 🇮🇳
**Election Process Education Assistant | मतदाता जागरूकता, सशक्त लोकतंत्र**

VoteSaathi is an institutional-grade, full-stack educational platform designed to guide Indian citizens through the entire electoral process. It features an integrated AI assistant powered by Google Gemini, providing multilingual support to demystify voter registration, EVM usage, and polling procedures.

## 🌟 Key Features

*   **🤖 Multilingual AI Assistant**: An intelligent chatbot powered by Google Gemini capable of answering election-related queries in English, Hindi, and Telugu.
*   **📋 Voter Registration Guide**: Step-by-step guidance on eligibility, required documents, and application tracking.
*   **🗳️ Voting Process Roadmap**: A visual lifecycle detailing what happens from candidate nomination to result declaration.
*   **📠 EVM Information Center**: Educational breakdown of Electronic Voting Machines and VVPATs, including a "Myth vs Fact" section to ensure voter trust.
*   **📊 Results & Counting Transparency**: An overview of the vote counting process with sample data visualizations.
*   **🎯 Interactive Quiz Zone**: A gamified learning module to test user knowledge on election procedures.
*   **🏆 Achievement Badges**: A progression system that rewards users for completing educational modules.
*   **📅 Detailed Election Timeline**: A live-tracking horizontal schedule highlighting current phases and upcoming deadlines for the 2026 elections.
*   **📚 Resources & FAQs**: A centralized hub for official Election Commission of India (ECI) forms, guides, and portals.

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, Framer Motion (Animations), Lucide React (Icons), Vanilla CSS
*   **Backend**: Node.js, Express.js
*   **AI Integration**: Google Gemini API (`@google/generative-ai`)
*   **Styling**: Custom CSS adhering to professional, institutional UI guidelines (Royal Blue & White theme)

## 🚀 Getting Started

To run VoteSaathi locally, you will need to start both the backend server and the frontend client concurrently.

### 1. Clone the Repository
```bash
git clone https://github.com/viswanath006/Votesaathi.git
cd Votesaathi
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```

Start the backend server:
```bash
node index.js
```
*(The server will run on http://localhost:5000)*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*(The application will be accessible at http://localhost:5173)*

## ⚖️ Disclaimer

VoteSaathi is an educational project and is not officially affiliated with the Election Commission of India (ECI). All official actions should be taken via [voters.eci.gov.in](https://voters.eci.gov.in/).