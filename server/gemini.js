/**
 * @fileoverview Gemini AI Service Module for VoteSaathi
 * @description Provides advanced Google Gemini AI integration with multi-turn chat,
 * safety settings, streaming, structured output, and response caching.
 * @module gemini
 * @requires @google/generative-ai
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validate that the Gemini API key is configured
 * @throws {Error} If GEMINI_API_KEY is not set
 */
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required. See .env.example for setup instructions.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Safety settings to filter harmful content while allowing educational election content
 * @constant {Array<Object>}
 */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Generation configuration for controlling response quality and performance
 * @constant {Object}
 */
const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

/**
 * System instruction for the VoteSaathi election assistant
 * @constant {string}
 */
const SYSTEM_INSTRUCTION = `You are VoteSaathi, an official Election Process Education Assistant for Indian citizens.
Your mission is to educate users about the democratic election process in India.

Core Rules:
- Provide accurate, fact-based information about Indian elections
- Explain concepts in simple, beginner-friendly language
- Give step-by-step guidance like helping a first-time voter
- Use real-life examples and practical tips
- Avoid political opinions or party affiliations
- Reference official sources like ECI (Election Commission of India)
- If unsure, direct users to official resources at voters.eci.gov.in

Topics you cover: Voter Registration, EVM/VVPAT, Polling Process, Vote Counting, Electoral Roll, EPIC Card, Election Timeline, and Election Laws.`;

/**
 * In-memory LRU cache for Gemini responses to avoid redundant API calls
 * @type {Map<string, {response: string, timestamp: number}>}
 */
const responseCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 100;

/**
 * Generates a cache key from the message and language
 * @param {string} message - User message
 * @param {string} language - Response language
 * @returns {string} Cache key
 */
function getCacheKey(message, language) {
  return `${language}:${message.toLowerCase().trim()}`;
}

/**
 * Retrieves a cached response if available and not expired
 * @param {string} key - Cache key
 * @returns {string|null} Cached response or null
 */
function getCachedResponse(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.response;
  }
  if (cached) {
    responseCache.delete(key);
  }
  return null;
}

/**
 * Stores a response in the cache with LRU eviction
 * @param {string} key - Cache key
 * @param {string} response - Response to cache
 */
function setCachedResponse(key, response) {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
  responseCache.set(key, { response, timestamp: Date.now() });
}

/**
 * Chat session store for multi-turn conversations per user session
 * @type {Map<string, Object>}
 */
const chatSessions = new Map();

/**
 * Gets or creates a multi-turn chat session for a given session ID
 * @param {string} sessionId - Unique session identifier
 * @param {string} language - Response language
 * @returns {Object} Gemini chat session
 */
function getChatSession(sessionId, language) {
  if (chatSessions.has(sessionId)) {
    return chatSessions.get(sessionId);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `${SYSTEM_INSTRUCTION}\n\nIMPORTANT: Always respond in ${language}. If the language is Hindi, use Devanagari script. If Telugu, use Telugu script.`,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: GENERATION_CONFIG,
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, I want to learn about the Indian election process." }],
      },
      {
        role: "model",
        parts: [{ text: "Welcome to VoteSaathi! 🇮🇳 I'm here to guide you through every step of the Indian election process. Whether you're a first-time voter or want to refresh your knowledge, I can help with:\n\n1. 📋 Voter Registration\n2. 🗳️ Voting Process\n3. 🖥️ EVM & VVPAT\n4. 📊 Results & Counting\n5. 📅 Election Timeline\n\nWhat would you like to know about?" }],
      },
    ],
  });

  chatSessions.set(sessionId, chat);

  // Clean up old sessions after 1 hour
  setTimeout(() => {
    chatSessions.delete(sessionId);
  }, 60 * 60 * 1000);

  return chat;
}

/**
 * Sends a message to Gemini AI and returns the response
 * Implements multi-turn conversation, caching, and proper error handling
 * 
 * @param {string} userMessage - The user's question or message
 * @param {string} [language='English'] - Response language (English, Hindi, Telugu)
 * @param {string} [sessionId='default'] - Session ID for multi-turn chat
 * @returns {Promise<string>} AI-generated response
 * @throws {Error} If Gemini API call fails
 * 
 * @example
 * const response = await getGeminiResponse("How do I register to vote?", "Hindi", "user123");
 */
export async function getGeminiResponse(userMessage, language = 'English', sessionId = 'default') {
  // Check cache first for efficiency
  const cacheKey = getCacheKey(userMessage, language);
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const chat = getChatSession(sessionId, language);
    const prompt = `[Language: ${language}] ${userMessage}`;

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    // Cache the response for future identical queries
    setCachedResponse(cacheKey, response);

    return response;
  } catch (error) {
    console.error("Gemini AI Error:", error.message);

    // Fallback: try single-turn if multi-turn fails
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: SAFETY_SETTINGS,
        generationConfig: GENERATION_CONFIG,
      });

      const fallbackPrompt = `${SYSTEM_INSTRUCTION}\n\nRespond in ${language}.\n\nUser question: ${userMessage}\n\nProvide a step-by-step, beginner-friendly answer.`;
      const result = await model.generateContent(fallbackPrompt);
      return result.response.text();
    } catch (fallbackError) {
      console.error("Gemini Fallback Error:", fallbackError.message);
      throw new Error('AI service temporarily unavailable');
    }
  }
}

/**
 * Streams a Gemini AI response for real-time display
 * Uses generateContentStream for progressive response delivery
 * 
 * @param {string} userMessage - The user's question
 * @param {string} [language='English'] - Response language
 * @param {Function} onChunk - Callback invoked with each text chunk
 * @returns {Promise<string>} Complete response text
 * 
 * @example
 * await streamGeminiResponse("What is EVM?", "English", (chunk) => res.write(chunk));
 */
export async function streamGeminiResponse(userMessage, language = 'English', onChunk) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `${SYSTEM_INSTRUCTION}\n\nRespond in ${language}.`,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { ...GENERATION_CONFIG, maxOutputTokens: 2048 },
  });

  const prompt = `User question: ${userMessage}\n\nProvide a comprehensive, step-by-step answer.`;
  const result = await model.generateContentStream(prompt);

  let fullText = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    if (onChunk) {
      onChunk(chunkText);
    }
  }

  return fullText;
}

/**
 * Generates quiz questions dynamically using Gemini's structured output
 * 
 * @param {string} topic - Quiz topic (e.g., "voter registration", "EVM")
 * @param {number} [count=3] - Number of questions to generate
 * @param {string} [language='English'] - Question language
 * @returns {Promise<Array<Object>>} Array of quiz question objects
 * 
 * @example
 * const questions = await generateQuizQuestions("voter registration", 5);
 */
export async function generateQuizQuestions(topic = 'general election process', count = 3, language = 'English') {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      ...GENERATION_CONFIG,
      responseMimeType: "application/json",
    },
  });

  const prompt = `Generate ${count} multiple-choice quiz questions about "${topic}" related to Indian elections.
  
  Language: ${language}
  
  Return a JSON array with this exact structure:
  [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
  
  Make questions educational and fact-based about the Indian election process.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Quiz Generation Error:", error.message);
    throw new Error('Failed to generate quiz questions');
  }
}

/**
 * Translates text using Gemini AI (Google AI-powered translation)
 * 
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language (Hindi, Telugu, English)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLanguage) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
  });

  const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else.\n\nText: ${text}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Translation Error:", error.message);
    throw new Error('Translation service unavailable');
  }
}
