/**
 * @fileoverview VoteSaathi Backend Server
 * @description Express.js server with Google Gemini AI integration, security hardening,
 * rate limiting, input validation, response caching, and comprehensive API endpoints.
 * @version 2.0.0
 * @module server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';
import { getGeminiResponse, streamGeminiResponse, generateQuizQuestions, translateText } from './gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

/**
 * Helmet.js — Sets various HTTP security headers
 * Protects against XSS, clickjacking, MIME sniffing, and more
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
    },
  },
}));

/**
 * CORS — Restrict cross-origin requests to allowed origins
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://votesaathi.onrender.com',
  'https://votesaathi.netlify.app',
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow all origins
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // Cache preflight for 24 hours
}));

/**
 * Rate Limiting — Prevent API abuse and DDoS
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 chat requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Chat rate limit exceeded. Please wait a moment before sending another message.' },
});

app.use(generalLimiter);

/**
 * Body Parsing — with size limits to prevent payload attacks
 */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

/**
 * Compression — Gzip responses for improved transfer speed
 */
app.use(compression());

// ============================================================
// DATA CONSTANTS
// ============================================================

/**
 * Pre-defined FAQ responses for common queries (avoids unnecessary API calls)
 * @constant {Object<string, string>}
 */
const LOCAL_FAQS = {
  "how to vote?": "Step 1: Go to the polling station.\nStep 2: Show your ID proof (Voter ID/Aadhar).\nStep 3: Press the button next to your candidate on the EVM.\nStep 4: Check the VVPAT slip.",
  "what is evm?": "An Electronic Voting Machine (EVM) is a device used to record votes electronically instead of paper ballots. It is fast, secure, and accurate.",
  "eligibility criteria": "To vote in India, you must:\n1. Be an Indian citizen.\n2. Be 18 years old or above on January 1st of the election year.\n3. Be a resident of the polling area where you want to vote.",
  "voting steps": "Step 1: Search your name in the electoral roll.\nStep 2: Find your polling booth.\nStep 3: Carry a valid ID.\nStep 4: Visit the booth and cast your vote."
};

/**
 * Static quiz questions for offline/fallback quiz mode
 * @constant {Array<Object>}
 */
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
  },
  {
    id: 4,
    question: "What does VVPAT stand for?",
    options: ["Voter Verifiable Paper Audit Trail", "Voter Verification Process and Tracking", "Visual Voter Paper Accountability Tool", "Voter Validated Polling Access Terminal"],
    answer: "Voter Verifiable Paper Audit Trail",
    explanation: "VVPAT is an independent verification system attached to EVMs that allows voters to verify their vote."
  },
  {
    id: 5,
    question: "What is the national voter helpline number in India?",
    options: ["100", "1800", "1950", "112"],
    answer: "1950",
    explanation: "1950 is the toll-free National Voter Helpline number operated by the Election Commission of India."
  }
];

/**
 * Election timeline data for 2026
 * @constant {Array<Object>}
 */
const TIMELINE_DATA = [
  { stage: "Voter Registration", date: "Year-round", status: "Ongoing" },
  { stage: "Announcement of Elections", date: "TBD", status: "Upcoming" },
  { stage: "Candidate Nomination", date: "TBD", status: "Upcoming" },
  { stage: "Polling Day", date: "TBD", status: "Upcoming" },
  { stage: "Counting Day", date: "TBD", status: "Upcoming" }
];

/**
 * State-specific election information
 * @constant {Object<string, Object>}
 */
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

// ============================================================
// INPUT VALIDATION HELPERS
// ============================================================

/**
 * Sanitizes user input by stripping potentially dangerous characters
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>'"`;]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 500); // Enforce max length
}

/**
 * Validates a chat message request body
 * @param {Object} body - Request body
 * @returns {{valid: boolean, error?: string, message?: string, language?: string}}
 */
function validateChatInput(body) {
  const { message, language } = body;

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string.' };
  }

  const sanitizedMessage = sanitizeInput(message);
  if (sanitizedMessage.length === 0) {
    return { valid: false, error: 'Message cannot be empty after sanitization.' };
  }

  const validLanguages = ['English', 'Hindi', 'Telugu'];
  const sanitizedLanguage = validLanguages.includes(language) ? language : 'English';

  return { valid: true, message: sanitizedMessage, language: sanitizedLanguage };
}

// ============================================================
// API ROUTES
// ============================================================

/**
 * Health Check Endpoint
 * @route GET /
 * @returns {string} Server status message
 */
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VoteSaathi API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/chat', '/api/chat/stream', '/api/quiz', '/api/quiz/generate', '/api/timeline', '/api/location/:state', '/api/translate']
  });
});

/**
 * Health check endpoint for monitoring
 * @route GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/**
 * AI Chat Endpoint — Multi-turn conversation with Gemini
 * @route POST /api/chat
 * @param {Object} req.body - Request body
 * @param {string} req.body.message - User message (required, max 500 chars)
 * @param {string} [req.body.language='English'] - Response language
 * @param {string} [req.body.sessionId] - Session ID for multi-turn chat
 * @returns {Object} { response: string }
 */
app.post('/api/chat', chatLimiter, async (req, res) => {
  const validation = validateChatInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { message, language } = validation;
  const sessionId = req.body.sessionId || 'default';

  // Check local FAQs first (instant response, no API call)
  const lowerMsg = message.toLowerCase().trim();
  if (LOCAL_FAQS[lowerMsg]) {
    return res.json({ response: LOCAL_FAQS[lowerMsg], source: 'faq' });
  }

  try {
    const reply = await getGeminiResponse(message, language, sessionId);
    res.json({ response: reply, source: 'gemini' });
  } catch (error) {
    console.error('Chat API Error:', error.message);
    res.status(503).json({
      error: 'AI service temporarily unavailable. Please try again shortly.',
      fallback: LOCAL_FAQS["how to vote?"]
    });
  }
});

/**
 * Streaming Chat Endpoint — Real-time Gemini response via Server-Sent Events
 * @route POST /api/chat/stream
 * @param {Object} req.body - Request body
 * @param {string} req.body.message - User message
 * @param {string} [req.body.language='English'] - Response language
 */
app.post('/api/chat/stream', chatLimiter, async (req, res) => {
  const validation = validateChatInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { message, language } = validation;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    await streamGeminiResponse(message, language, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream Error:', error.message);
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted. Please try again.' })}\n\n`);
    res.end();
  }
});

/**
 * Static Quiz Endpoint — Returns pre-defined quiz questions
 * @route GET /api/quiz
 * @returns {Array<Object>} Array of quiz question objects
 */
app.get('/api/quiz', (req, res) => {
  res.json(QUIZ_DATA);
});

/**
 * AI Quiz Generation Endpoint — Generates dynamic quiz questions using Gemini
 * @route POST /api/quiz/generate
 * @param {Object} req.body - Request body
 * @param {string} [req.body.topic='general election process'] - Quiz topic
 * @param {number} [req.body.count=3] - Number of questions (max 10)
 * @param {string} [req.body.language='English'] - Question language
 * @returns {Array<Object>} AI-generated quiz questions
 */
app.post('/api/quiz/generate', chatLimiter, async (req, res) => {
  const topic = sanitizeInput(req.body.topic || 'general election process');
  const count = Math.min(Math.max(parseInt(req.body.count) || 3, 1), 10);
  const language = ['English', 'Hindi', 'Telugu'].includes(req.body.language) ? req.body.language : 'English';

  try {
    const questions = await generateQuizQuestions(topic, count, language);
    res.json(questions);
  } catch (error) {
    console.error('Quiz Generation Error:', error.message);
    // Fallback to static quiz data
    res.json(QUIZ_DATA);
  }
});

/**
 * Election Timeline Endpoint
 * @route GET /api/timeline
 * @returns {Array<Object>} Election timeline data
 */
app.get('/api/timeline', (req, res) => {
  res.json(TIMELINE_DATA);
});

/**
 * State-specific Location Info Endpoint
 * @route GET /api/location/:state
 * @param {string} req.params.state - Indian state name
 * @returns {Object} State election information or error
 */
app.get('/api/location/:state', (req, res) => {
  const state = sanitizeInput(req.params.state);
  const info = LOCATION_INFO[state];
  if (!info) {
    return res.status(404).json({ error: `Information not available for "${state}" yet. Please try Telangana or Andhra Pradesh.` });
  }
  res.json(info);
});

/**
 * Translation Endpoint — Translates text using Gemini AI
 * @route POST /api/translate
 * @param {Object} req.body - Request body
 * @param {string} req.body.text - Text to translate (max 500 chars)
 * @param {string} req.body.targetLanguage - Target language (Hindi, Telugu, English)
 * @returns {Object} { translatedText: string }
 */
app.post('/api/translate', chatLimiter, async (req, res) => {
  const text = sanitizeInput(req.body.text);
  const targetLanguage = ['English', 'Hindi', 'Telugu'].includes(req.body.targetLanguage)
    ? req.body.targetLanguage
    : 'English';

  if (!text) {
    return res.status(400).json({ error: 'Text is required for translation.' });
  }

  try {
    const translated = await translateText(text, targetLanguage);
    res.json({ translatedText: translated, originalLanguage: 'auto', targetLanguage });
  } catch (error) {
    console.error('Translation Error:', error.message);
    res.status(503).json({ error: 'Translation service temporarily unavailable.' });
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * 404 Handler — Catches all unmatched routes
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found. Visit / for available endpoints.' });
});

/**
 * Global Error Handler — Catches unhandled errors safely
 * Never exposes stack traces or internal details to clients
 */
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    error: NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message,
  });
});

// ============================================================
// SERVER STARTUP
// ============================================================

app.listen(PORT, () => {
  console.log(`✅ VoteSaathi API v2.0.0 running on port ${PORT} [${NODE_ENV}]`);
  console.log(`📡 Endpoints: /api/chat, /api/chat/stream, /api/quiz, /api/quiz/generate, /api/timeline, /api/translate`);
});

export default app;
