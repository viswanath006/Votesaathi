/**
 * @fileoverview Custom React Hook for Chat Functionality
 * @description Manages chat state, message sending, and API communication
 * for the VoteSaathi AI assistant.
 * @module useChat
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../utils/api';

/**
 * Custom hook that encapsulates all chat-related state and logic
 * @param {string} language - Current language setting
 * @returns {Object} Chat state and handler functions
 */
export function useChat(language) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '👋 Hello! I am your VoteSaathi Assistant.\nYou can ask me anything about the election process, voting, registration, EVMs, and more.',
      time: '10:30 AM',
      id: 1
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const sessionId = useRef(`session_${Date.now()}`);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Sends a message to the AI and updates the chat
   * @param {string} [text] - Optional text override (used by quick-ask buttons)
   */
  const handleSend = useCallback(async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg = {
      role: 'user',
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(messageText, language, sessionId.current);
      const aiMsg = {
        role: 'ai',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMsg = {
        role: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        time: 'Error',
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, language]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    scrollRef,
  };
}
