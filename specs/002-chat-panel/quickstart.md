# Quick Start Guide: AI Chat Panel & Command Center

**Feature**: 002-chat-panel
**Branch**: `002-chat-panel`
**Date**: 2025-11-17

## Purpose

This guide helps developers quickly set up, develop, and test the AI Chat Panel feature. Follow these steps to get started with implementation.

## Prerequisites

Ensure you have the 001-dashboard-shell feature completed and working:

```bash
# Verify dashboard shell is functional
cd frontend
npm run dev

# Should see dashboard shell at http://localhost:5173
# TopBar, LeftRail, Canvas, Inspector should render correctly
```

If dashboard shell is not working, complete that feature first before starting chat panel.

## Initial Setup

### 1. Install New Dependencies

Only one new dependency needed for this feature:

```bash
cd frontend
npm install date-fns
```

**Verification**:
```bash
npm list date-fns
# Should show date-fns@^3.0.0 (or latest stable)
```

### 2. Create Type Definitions

Create the chat types file first (other components depend on it):

```bash
# Create types directory if it doesn't exist
mkdir -p frontend/src/types

# Create chat types file
touch frontend/src/types/chat.ts
```

**Content** (copy from data-model.md):
```typescript
// frontend/src/types/chat.ts

export type MessageType = 'user' | 'ai' | 'log'
export type Scope = 'field' | 'section' | 'page' | 'feature'
export type OperationStatus = 'pending' | 'running' | 'success' | 'error'

export interface ChatMessage {
  id: string
  type: MessageType
  text: string
  scope: Scope
  action?: string
  createdAt: number
  relatedEntityId?: string
  isCollapsed: boolean
}

export interface ChatOperationLog {
  operationId: string
  scope: Scope
  targetEntityId: string
  status: OperationStatus
  messages: string[]
  createdAt: number
  completedAt?: number
}

export interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  scope: Scope
  isBusy: boolean
  currentContext: string
  panelWidth: number
}
```

### 3. Extend Dashboard Store

**File**: `frontend/src/store/dashboardStore.ts`

Add chat slice to existing store (see data-model.md for complete implementation):

```typescript
// Import chat types
import type { ChatState, ChatMessage, Scope } from '../types/chat'

// Add to DashboardState interface
export interface DashboardState {
  // ... existing slices
  chat: ChatState  // NEW
}

// Add to DashboardActions interface
export interface DashboardActions {
  // ... existing actions
  toggleChat: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  setScope: (scope: Scope) => void
  setBusy: (busy: boolean) => void
  clearMessages: () => void
  setChatPanelWidth: (width: number) => void
}

// Add default state
const initialState: DashboardState = {
  // ... existing state
  chat: {
    messages: [],
    isOpen: false,
    scope: 'section',
    isBusy: false,
    currentContext: '',
    panelWidth: 420,
  },
}

// Implement actions (see data-model.md for full implementations)
```

### 4. Create Component Structure

```bash
cd frontend/src/components
mkdir -p chat

# Create component files
touch chat/ChatPanel.tsx chat/ChatPanel.css
touch chat/ChatHeader.tsx chat/ChatHeader.css
touch chat/MessageList.tsx chat/MessageList.css
touch chat/MessageBubble.tsx chat/MessageBubble.css
touch chat/PromptComposer.tsx chat/PromptComposer.css
touch chat/ScopeSelector.tsx chat/ScopeSelector.css
touch chat/QuickActionChips.tsx chat/QuickActionChips.css
touch chat/OperationLog.tsx chat/OperationLog.css
```

### 5. Create Mock AI Service

```bash
mkdir -p frontend/src/services
touch frontend/src/services/mockAI.ts
```

Implement mock handlers per contracts/mock-ai-api.ts specification.

### 6. Create Utility Functions

```bash
mkdir -p frontend/src/utils
touch frontend/src/utils/formatTimestamp.ts
```

**Content**:
```typescript
// frontend/src/utils/formatTimestamp.ts
import { formatDistanceToNow, format } from 'date-fns'

export function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diffHours = (now - timestamp) / (1000 * 60 * 60)

  if (diffHours < 24) {
    // "2 min ago", "5 hours ago"
    return formatDistanceToNow(timestamp, { addSuffix: true })
  } else if (diffHours < 7 * 24) {
    // "Yesterday at 3:15 PM", "Monday at 11:30 AM"
    const day = diffHours < 48 ? 'Yesterday' : format(timestamp, 'EEEE')
    const time = format(timestamp, 'h:mm a')
    return `${day} at ${time}`
  } else {
    // "Nov 10 at 2:45 PM"
    return format(timestamp, 'MMM d at h:mm a')
  }
}
```

## Development Workflow

### Start Development Server

```bash
cd frontend
npm run dev
```

Navigate to http://localhost:5173

### Development Order (Recommended)

Build components in this order to minimize dependencies:

1. **ChatMessage types** ✅ (already done in setup)
2. **MessageBubble** (renders single message, no dependencies)
3. **MessageList** (uses MessageBubble)
4. **ScopeSelector** (standalone dropdown)
5. **QuickActionChips** (standalone chip buttons)
6. **PromptComposer** (uses ScopeSelector and QuickActionChips)
7. **ChatHeader** (standalone header with menu)
8. **OperationLog** (renders log messages)
9. **ChatPanel** (assembles all above components)
10. **Integrate into Shell** (modify Shell.tsx and LeftRail.tsx)
11. **Mock AI service** (implement handlers)

### Component Development Template

For each component:

1. Create basic component structure
2. Add TypeScript interfaces for props
3. Implement render logic
4. Add CSS styling (reference constitution for colors/spacing)
5. Write component tests
6. Test accessibility with keyboard navigation

**Example: MessageBubble.tsx**
```typescript
import React from 'react'
import type { ChatMessage } from '../../types/chat'
import { formatTimestamp } from '../../utils/formatTimestamp'
import './MessageBubble.css'

interface MessageBubbleProps {
  message: ChatMessage
  onToggleCollapse?: () => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleCollapse
}) => {
  return (
    <div className={`message-bubble message-bubble--${message.type}`}>
      <div className="message-bubble__content">
        {message.text}
      </div>
      <div className="message-bubble__meta">
        <span className="message-bubble__timestamp">
          {formatTimestamp(message.createdAt)}
        </span>
        {message.scope && (
          <span className="message-bubble__scope">
            {message.scope}
          </span>
        )}
      </div>
    </div>
  )
}
```

### Hot Reload Testing

Vite provides hot module replacement - changes will reflect immediately:

1. Edit component file
2. Save (Cmd+S / Ctrl+S)
3. Browser auto-refreshes with changes
4. Check console for any errors

## Testing

### Unit Tests (Component Tests)

Run component tests with Vitest:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests for specific component
npm run test MessageBubble.test.tsx

# Run with coverage
npm run test:coverage
```

**Test File Structure**:
```typescript
// frontend/tests/components/chat/MessageBubble.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../../../src/components/chat/MessageBubble'

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      type: 'user' as const,
      text: 'Hello AI',
      scope: 'section' as const,
      createdAt: Date.now(),
      isCollapsed: false
    }

    render(<MessageBubble message={message} />)
    expect(screen.getByText('Hello AI')).toBeInTheDocument()
  })

  // More tests...
})
```

### E2E Tests (Integration Tests)

Run E2E tests with Playwright:

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Debug specific test
npm run test:e2e -- --debug chat-workflow.test.tsx
```

**E2E Test Structure**:
```typescript
// frontend/tests/integration/chat-workflow.test.tsx
import { test, expect } from '@playwright/test'

test('user can open chat, send message, and receive response', async ({ page }) => {
  await page.goto('/')

  // Click chat icon in left rail
  await page.click('[data-testid="left-rail-chat"]')

  // Chat panel should slide in
  await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible()

  // Type message
  await page.fill('[data-testid="chat-composer-textarea"]', 'Rewrite this section')

  // Send message
  await page.press('[data-testid="chat-composer-textarea"]', 'Enter')

  // User message should appear
  await expect(page.locator('.message-bubble--user')).toContainText('Rewrite this section')

  // AI response should appear within 5 seconds
  await expect(page.locator('.message-bubble--ai')).toBeVisible({ timeout: 5000 })
})
```

### Accessibility Tests

Run accessibility validation:

```bash
# Run accessibility tests only
npm run test -- accessibility.test.tsx

# Check for WCAG violations
npm run test:a11y
```

**Accessibility Test Template**:
```typescript
// frontend/tests/components/chat/accessibility.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ChatPanel } from '../../../src/components/chat/ChatPanel'

describe('ChatPanel Accessibility', () => {
  it('has no WCAG AA violations', async () => {
    const { container } = render(<ChatPanel />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Common Development Tasks

### Add New Quick Action Chip

1. Open `QuickActionChips.tsx`
2. Add new chip to chip list:
```typescript
const chips = [
  { id: 'rewrite', label: 'Rewrite section', prompt: 'Rewrite this section...' },
  { id: 'my-new-action', label: 'My Action', prompt: 'Do my action...' },  // NEW
]
```
3. Add corresponding mock response in `mockAI.ts`

### Test Different Mock AI Scenarios

Adjust mock configuration in dev console:

```javascript
// Open browser console
import { setMockConfig } from './services/mockAI'

// Faster responses for rapid testing
setMockConfig({ minDelay: 500, maxDelay: 1000 })

// Simulate failures
setMockConfig({ failureProbability: 0.5 })  // 50% failure rate

// Debug mode (logs to console)
setMockConfig({ debugMode: true })
```

### Test with Low AI Credits

Manually adjust credits in dashboard store:

```javascript
// Browser console
import { useDashboardStore } from './store/dashboardStore'

// Set low credits
useDashboardStore.getState().setAiCredits(30)  // Shows warning at <50

// Set zero credits
useDashboardStore.getState().setAiCredits(0)   // Disables composer
```

### Debug Context Synchronization

Add console logs to verify context updates:

```typescript
// In ChatPanel.tsx
useEffect(() => {
  console.log('Context updated:', {
    selectedPageId,
    selectedSectionId,
    currentContext
  })
}, [selectedPageId, selectedSectionId, currentContext])
```

## Performance Testing

### Test with 100+ Messages

```javascript
// Browser console
import { useDashboardStore } from './store/dashboardStore'

// Generate 150 test messages
for (let i = 0; i < 150; i++) {
  useDashboardStore.getState().addMessage({
    type: i % 3 === 0 ? 'log' : i % 2 === 0 ? 'ai' : 'user',
    text: `Test message ${i + 1}`,
    scope: 'section',
    isCollapsed: false
  })
}

// Check scrolling performance (should be smooth)
```

### Measure Animation Timing

```javascript
// Verify 250ms slide-in animation
const panel = document.querySelector('[data-testid="chat-panel"]')
const start = performance.now()

// Trigger open
useDashboardStore.getState().toggleChat()

// Measure in next frame
requestAnimationFrame(() => {
  const duration = performance.now() - start
  console.log('Panel animation duration:', duration, 'ms')
  // Should complete within ~250ms
})
```

## Troubleshooting

### Chat Panel Not Visible

Check:
1. Is `chat.isOpen` true in dashboard store?
2. Is z-index correct? (Should be 40, above canvas/inspector)
3. Are there CSS syntax errors in ChatPanel.css?
4. Check browser console for React errors

```javascript
// Debug in console
console.log(useDashboardStore.getState().chat.isOpen)  // Should be true
```

### Messages Not Appearing

Check:
1. Is `addMessage` action being called?
2. Are message objects valid? (Check TypeScript errors)
3. Is MessageList component rendering correctly?

```javascript
// Debug in console
console.log(useDashboardStore.getState().chat.messages)  // Should show array
```

### Mock AI Not Responding

Check:
1. Is `mockAI.ts` implementing all required functions?
2. Are promises resolving? (Check for rejected promises)
3. Is `isBusy` state being set/cleared correctly?

```javascript
// Debug in console
import { generateMockResponse } from './services/mockAI'

// Test directly
generateMockResponse({
  text: 'Test',
  scope: 'section',
  selectedPageId: null,
  selectedSectionId: null,
  aiCreditsCount: 100
}).then(console.log)
```

### Context Chip Not Updating

Check:
1. Is debounce working? (Should update within 100ms)
2. Are Zustand subscriptions active?
3. Is selected page/section ID changing in dashboard store?

```javascript
// Debug in console
const unsubscribe = useDashboardStore.subscribe(
  (state) => state.shell.selectedSectionId,
  (id) => console.log('Section changed:', id)
)
```

## Next Steps

After completing development:

1. Run full test suite: `npm run test && npm run test:e2e`
2. Check accessibility: `npm run test:a11y`
3. Verify all success criteria from spec.md
4. Test on multiple browsers (Chrome, Firefox, Safari)
5. Create PR with screenshots/video demonstrating:
   - Opening/closing chat
   - Sending messages and receiving responses
   - Scope selection
   - Quick action chips
   - Operation logging
   - Keyboard navigation

## Resources

- **Spec**: `specs/002-chat-panel/spec.md` (requirements)
- **Plan**: `specs/002-chat-panel/plan.md` (architecture)
- **Data Model**: `specs/002-chat-panel/data-model.md` (entities)
- **Contracts**: `specs/002-chat-panel/contracts/mock-ai-api.ts` (API)
- **Research**: `specs/002-chat-panel/research.md` (technology decisions)
- **Constitution**: `.specify/memory/constitution.md` (design principles)
- **Dashboard Shell**: `specs/001-dashboard-shell/` (existing foundation)

## Getting Help

If stuck:
1. Review success criteria in spec.md - are you testing the right behavior?
2. Check data-model.md - is your state structure correct?
3. Review research.md - is your technology choice aligned?
4. Check existing dashboard shell code for patterns
5. Run tests to identify specific failures

**Status**: ✅ Quick start guide complete
