/**
 * @fileoverview ChatView Component
 * @description AI chat interface with message display, quick-ask, and input area
 * @component
 */
import React, { memo } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';
import { SUGGESTIONS } from '../../utils/constants';

/**
 * Individual chat message bubble
 * @param {Object} props
 * @param {Object} props.msg - Message object with role, content, time
 */
const ChatMessage = memo(function ChatMessage({ msg }) {
  return (
    <div className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`} role="article" aria-label={`${msg.role === 'user' ? 'Your' : 'Assistant'} message`}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
      <div style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>
        {msg.time} {msg.role === 'user' && '✓✓'}
      </div>
    </div>
  );
});

/**
 * Chat view component with messages, quick ask, and input
 * @param {Object} props
 * @param {Array} props.messages - Chat messages array
 * @param {string} props.input - Current input value
 * @param {Function} props.setInput - Input setter
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.handleSend - Send handler
 * @param {Object} props.scrollRef - Scroll container ref
 */
export default function ChatView({ messages, input, setInput, isLoading, handleSend, scrollRef }) {
  return (
    <>
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ color: '#003366' }}>AI Election Assistant</h3>
          <div className="status-indicator" aria-label="Assistant status: online">
            <div className="dot" aria-hidden="true"></div> Online
          </div>
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef} role="log" aria-label="Chat messages" aria-live="polite">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isLoading && (
          <div className="message ai-message" role="status" aria-label="Assistant is typing">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            <span className="sr-only">Loading response...</span>
          </div>
        )}
      </div>

      <div className="quick-ask">
        <h4>Quick Ask</h4>
        <div className="suggestion-btns" role="group" aria-label="Quick question suggestions">
          {SUGGESTIONS.map((s, idx) => (
            <button key={idx} className="suggestion-btn" onClick={() => handleSend(s.en)} aria-label={`Ask: ${s.en}`}>
              {s.en}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-input-area">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Type your question"
            autoComplete="off"
          />
          <button className="icon-btn" aria-label="Voice input"><Mic size={20} aria-hidden="true" /></button>
        </div>
        <button className="send-btn" onClick={() => handleSend()} aria-label="Send message" disabled={isLoading}>
          <Send size={20} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
