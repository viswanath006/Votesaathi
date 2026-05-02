import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getGeminiResponse } from './gemini.js';

dotenv.config();

console.log("Server starting...");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('VoteSaathi API is running successfully!');
});

const LOCAL_FAQS = {
  "how to vote?": "Step 1: Go to the polling station.\nStep 2: Show your ID proof (Voter ID/Aadhar).\nStep 3: Press the button next to your candidate on the EVM.\nStep 4: Check the VVPAT slip.",
  "what is evm?": "An Electronic Voting Machine (EVM) is a device used to record votes electronically instead of paper ballots. It is fast, secure, and accurate.",
  "eligibility criteria": "To vote in India, you must:\n1. Be an Indian citizen.\n2. Be 18 years old or above on January 1st of the election year.\n3. Be a resident of the polling area where you want to vote.",
  "voting steps": "Step 1: Search your name in the electoral roll.\nStep 2: Find your polling booth.\nStep 3: Carry a valid ID.\nStep 4: Visit the booth and cast your vote."
};

const QUIZ_DATA = [
  {
    id: 1,
    question: "What is the minimum age to vote in India?",
    options: ["16", "18", "21", "25"],
    answer: "18",
    explanation: "As per the Constitution of India, any citizen aged 18 or above is eligible to vote."
  },
  {
    id: 2,
    question: "What does EVM stand for?",
    options: ["Electronic Voting Machine", "Every Voter Matters", "Election Verification Method", "Electronic Vote Maker"],
    answer: "Electronic Voting Machine",
    explanation: "EVM stands for Electronic Voting Machine, used for recording votes."
  },
  {
    id: 3,
    question: "Which document is primarily used as identity proof at polling stations?",
    options: ["PAN Card", "Voter ID (EPIC)", "Driving License", "Ration Card"],
    answer: "Voter ID (EPIC)",
    explanation: "The Elector Photo Identity Card (EPIC) is the primary document issued by the Election Commission."
  }
];

const TIMELINE_DATA = [
  { stage: "Voter Registration", date: "Year-round", status: "Ongoing" },
  { stage: "Announcement of Elections", date: "TBD", status: "Upcoming" },
  { stage: "Candidate Nomination", date: "TBD", status: "Upcoming" },
  { stage: "Polling Day", date: "TBD", status: "Upcoming" },
  { stage: "Counting Day", date: "TBD", status: "Upcoming" }
];

const LOCATION_INFO = {
  "Telangana": {
    votingDate: "To be announced",
    guidelines: "Ensure you have your EPIC card. Check your name in the electoral roll at electoralsearch.in.",
    helpline: "1950"
  },
  "Andhra Pradesh": {
    votingDate: "To be announced",
    guidelines: "Registration is open. Visit the CEO AP website for more details.",
    helpline: "1950"
  }
};

app.post('/api/chat', async (req, res) => {
  const { message, language } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const lowerMsg = message.toLowerCase().trim();
  if (LOCAL_FAQS[lowerMsg]) {
    return res.json({ response: LOCAL_FAQS[lowerMsg] });
  }

  try {
    const reply = await getGeminiResponse(message, language);
    res.json({ response: reply });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ response: "I'm having trouble connecting to my brain right now. Can you try again?" });
  }
});

app.get('/api/quiz', (req, res) => {
  res.json(QUIZ_DATA);
});

app.get('/api/timeline', (req, res) => {
  res.json(TIMELINE_DATA);
});

app.get('/api/location/:state', (req, res) => {
  const state = req.params.state;
  const info = LOCATION_INFO[state] || { error: "Information not available for this state yet." };
  res.json(info);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
