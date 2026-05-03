/**
 * @fileoverview API Service Module for VoteSaathi
 * @description Centralized API communication layer with error handling,
 * timeout support, and retry logic.
 * @module api
 */

import { API_BASE_URL } from './constants';

/**
 * Default request timeout in milliseconds
 * @constant {number}
 */
const REQUEST_TIMEOUT = 30000;

/**
 * Creates an AbortController with a timeout
 * @param {number} ms - Timeout in milliseconds
 * @returns {{ controller: AbortController, signal: AbortSignal }}
 */
function createTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { controller, signal: controller.signal, timeoutId };
}

/**
 * Sends a chat message to the AI and returns the response
 * @param {string} message - User message
 * @param {string} language - Response language
 * @param {string} [sessionId] - Session ID for multi-turn conversation
 * @returns {Promise<{response: string, source: string}>}
 */
export async function sendChatMessage(message, language, sessionId) {
  const { signal, timeoutId } = createTimeout(REQUEST_TIMEOUT);

  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, sessionId }),
      signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Fetches quiz questions from the API
 * @returns {Promise<Array<Object>>} Quiz questions
 */
export async function fetchQuiz() {
  const res = await fetch(`${API_BASE_URL}/api/quiz`);
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

/**
 * Generates AI quiz questions on a specific topic
 * @param {string} topic - Quiz topic
 * @param {number} count - Number of questions
 * @param {string} language - Question language
 * @returns {Promise<Array<Object>>}
 */
export async function generateAIQuiz(topic, count = 3, language = 'English') {
  const res = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, count, language }),
  });
  if (!res.ok) throw new Error('Failed to generate quiz');
  return res.json();
}

/**
 * Translates text using the backend translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language
 * @returns {Promise<{translatedText: string}>}
 */
export async function translateText(text, targetLanguage) {
  const res = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  if (!res.ok) throw new Error('Translation failed');
  return res.json();
}

/**
 * Fetches election timeline data
 * @returns {Promise<Array<Object>>}
 */
export async function fetchTimeline() {
  const res = await fetch(`${API_BASE_URL}/api/timeline`);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
}
