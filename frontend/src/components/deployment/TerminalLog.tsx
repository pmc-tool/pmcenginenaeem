/**
 * TerminalLog - Collapsible build logs display
 * Feature: 006-themes-and-deploy (US3)
 *
 * Shows terminal-style build output with:
 * - Monospaced font
 * - Collapsible/expandable
 * - Auto-expand on errors
 * - Scrollable content
 */

import React, { useEffect, useRef } from 'react';
import './TerminalLog.css';

interface TerminalLogProps {
  logs: string[];
  expanded: boolean;
  onToggle: () => void;
  autoExpand?: boolean;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  logs,
  expanded,
  onToggle,
  autoExpand = false,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (expanded && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, expanded]);

  // Auto-expand on errors
  useEffect(() => {
    if (autoExpand && !expanded) {
      onToggle();
    }
  }, [autoExpand, expanded, onToggle]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="terminal-log">
      <div className="terminal-log__header">
        <span className="terminal-log__title">Build Details</span>
        <span className="terminal-log__log-count">{logs.length} lines</span>
      </div>

      <div className="terminal-log__content" ref={logContainerRef}>
        <div className="terminal-log__lines">
          {logs.map((log, index) => {
            const isError = log.includes('ERROR') || log.includes('error') || log.includes('✕');
            const isSuccess = log.includes('✓') || log.includes('success');

            return (
              <div
                key={index}
                className={`terminal-log__line ${
                  isError ? 'terminal-log__line--error' : ''
                } ${isSuccess ? 'terminal-log__line--success' : ''}`}
              >
                <span className="terminal-log__line-number">{index + 1}</span>
                <span className="terminal-log__line-text">{log}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
