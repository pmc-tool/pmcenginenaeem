/**
 * AIAssistantTab - AI Assistant Interface
 * Chat interface with scope selector (field, section, page, feature)
 */

import React from 'react'
import './AIAssistantTab.css'

export const AIAssistantTab: React.FC = () => {
  return (
    <div className="ai-assistant-tab">
      <div className="ai-assistant-tab__header">
        <h3 className="ai-assistant-tab__title">AI Assistant</h3>
        <select className="ai-assistant-tab__scope" aria-label="AI scope selector">
          <option value="field">Current Field</option>
          <option value="section">Current Section</option>
          <option value="page">Current Page</option>
          <option value="feature">Entire Feature</option>
        </select>
      </div>

      <div className="ai-assistant-tab__content">
        <div className="ai-assistant-tab__placeholder">
          <p>AI Assistant will help you generate and refine content.</p>
          <p className="ai-assistant-tab__hint">
            Select a scope and start chatting with the AI to get intelligent suggestions.
          </p>
        </div>
      </div>

      <div className="ai-assistant-tab__input-area">
        <textarea
          className="ai-assistant-tab__input"
          placeholder="Ask the AI assistant for help..."
          rows={3}
          aria-label="AI assistant input"
        />
        <button className="ai-assistant-tab__send" aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  )
}
