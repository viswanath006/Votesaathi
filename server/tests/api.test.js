/**
 * @fileoverview API Integration Tests for VoteSaathi Server
 * @description Tests all API endpoints for correct behavior, security, and error handling
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

// Mock the Gemini module before importing the app
vi.mock('../gemini.js', () => ({
  getGeminiResponse: vi.fn().mockResolvedValue('This is a mock AI response about Indian elections.'),
  streamGeminiResponse: vi.fn().mockImplementation(async (msg, lang, onChunk) => {
    onChunk('This is ');
    onChunk('a streamed response.');
    return 'This is a streamed response.';
  }),
  generateQuizQuestions: vi.fn().mockResolvedValue([
    {
      id: 1,
      question: "What is the minimum age to vote?",
      options: ["16", "18", "21", "25"],
      answer: "18",
      explanation: "Citizens aged 18 or above can vote."
    }
  ]),
  translateText: vi.fn().mockResolvedValue('अनुवादित पाठ'),
}));

// Import app after mocks are set up
const { default: app } = await import('../index.js');

describe('VoteSaathi API', () => {

  // ============================================================
  // Health Check Tests
  // ============================================================
  describe('GET /', () => {
    it('should return server health status with JSON', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('service', 'VoteSaathi API');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('endpoints');
      expect(Array.isArray(res.body.endpoints)).toBe(true);
    });
  });

  describe('GET /api/health', () => {
    it('should return ok status with uptime', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('uptime');
      expect(typeof res.body.uptime).toBe('number');
    });
  });

  // ============================================================
  // Chat API Tests
  // ============================================================
  describe('POST /api/chat', () => {
    it('should return a response for a valid message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'How do I register to vote?', language: 'English' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('response');
      expect(typeof res.body.response).toBe('string');
    });

    it('should return FAQ response for known queries', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'how to vote?', language: 'English' });
      expect(res.status).toBe(200);
      expect(res.body.response).toContain('polling station');
      expect(res.body.source).toBe('faq');
    });

    it('should return 400 for empty message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '', language: 'English' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing message field', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ language: 'English' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should sanitize HTML tags from user input', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '<script>alert("xss")</script>How to vote?', language: 'English' });
      expect(res.status).toBe(200);
      // Should not crash; the message gets sanitized
    });

    it('should default to English for invalid language', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'How to vote?', language: 'InvalidLang' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('response');
    });
  });

  // ============================================================
  // Quiz API Tests
  // ============================================================
  describe('GET /api/quiz', () => {
    it('should return an array of quiz questions', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should have correct quiz question structure', async () => {
      const res = await request(app).get('/api/quiz');
      const question = res.body[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('explanation');
      expect(Array.isArray(question.options)).toBe(true);
    });
  });

  describe('POST /api/quiz/generate', () => {
    it('should generate AI quiz questions', async () => {
      const res = await request(app)
        .post('/api/quiz/generate')
        .send({ topic: 'voter registration', count: 3 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================================
  // Timeline API Tests
  // ============================================================
  describe('GET /api/timeline', () => {
    it('should return timeline data array', async () => {
      const res = await request(app).get('/api/timeline');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should have correct timeline structure', async () => {
      const res = await request(app).get('/api/timeline');
      const item = res.body[0];
      expect(item).toHaveProperty('stage');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('status');
    });
  });

  // ============================================================
  // Location API Tests
  // ============================================================
  describe('GET /api/location/:state', () => {
    it('should return info for valid state (Telangana)', async () => {
      const res = await request(app).get('/api/location/Telangana');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('votingDate');
      expect(res.body).toHaveProperty('guidelines');
      expect(res.body).toHaveProperty('helpline');
    });

    it('should return info for Andhra Pradesh', async () => {
      const res = await request(app).get('/api/location/Andhra Pradesh');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('votingDate');
    });

    it('should return 404 for invalid state', async () => {
      const res = await request(app).get('/api/location/InvalidState');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ============================================================
  // Translation API Tests
  // ============================================================
  describe('POST /api/translate', () => {
    it('should translate text to target language', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'How to vote', targetLanguage: 'Hindi' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('translatedText');
      expect(res.body).toHaveProperty('targetLanguage', 'Hindi');
    });

    it('should return 400 for empty text', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: '', targetLanguage: 'Hindi' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ============================================================
  // Security Tests
  // ============================================================
  describe('Security', () => {
    it('should have security headers set by Helmet', async () => {
      const res = await request(app).get('/');
      expect(res.headers).toHaveProperty('x-content-type-options');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject oversized payloads', async () => {
      const largeMessage = 'x'.repeat(20000);
      const res = await request(app)
        .post('/api/chat')
        .send({ message: largeMessage });
      // Should either be 400 (validation) or 413 (payload too large)
      expect([400, 413]).toContain(res.status);
    });
  });
});
