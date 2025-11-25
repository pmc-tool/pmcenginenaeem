/**
 * ChatPromptBox - Minimal chat input for TopBar
 * Feature: 002-chat-panel enhancement
 * Opens chat panel in sidebar when user types or focuses
 */

import React, { useState, useRef } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import './ChatPromptBox.css';

export const ChatPromptBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleChat = useDashboardStore((state) => state.toggleChat);
  const isChatOpen = useDashboardStore((state) => state.chat.isOpen);

  const handleFocus = () => {
    // Open chat panel when user focuses on input
    if (!isChatOpen) {
      toggleChat();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Open chat if not already open and user is typing
    if (!isChatOpen && e.target.value.length > 0) {
      toggleChat();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // TODO: Send message to chat
      console.log('Send message:', inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-prompt-box">
      <span className="chat-prompt-box__icon" aria-hidden="true">
        ✨
      </span>
      <input
        ref={inputRef}
        type="text"
        className="chat-prompt-box__input"
        placeholder="Ask AI..."
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        aria-label="AI chat prompt"
      />
    </div>
  );
};
