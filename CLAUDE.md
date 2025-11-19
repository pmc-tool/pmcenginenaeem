# my pmc Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-16

## Active Technologies
- TypeScript 5+ (strict mode) - inherited from 001-dashboard-shell + React 18+, Zustand 4 (state management), Radix UI (dropdown, dialog primitives), date-fns (timestamp formatting) (002-chat-panel)
- None (chat state is ephemeral, in-memory only per FR-049) (002-chat-panel)
- TypeScript 5+ (strict mode) with React 18+ + React 18+, Zustand 4 (state management), Monaco Editor (code display/diff), Prism.js or Shiki (syntax highlighting), date-fns (timestamps) (003-ai-coding-mode)
- In-memory state (Zustand), with persistence via browser localStorage for undo/redo history (003-ai-coding-mode)
- TypeScript 5+ (strict mode), inherited from dashboard shell + React 18+, Zustand 4 (state management), Radix UI (form primitives, color picker), react-hook-form (form validation) (005-basic-ai-training)
- Browser localStorage for MVP (per-site scoped), with API endpoints prepared for future backend migration (005-basic-ai-training)
- TypeScript 5+ (strict mode) + React 18+, Zustand 4 (state management), Radix UI (dialog, dropdown primitives for Deploy Panel), date-fns (timestamps for deployment logs) (006-themes-and-deploy)
- Browser localStorage for theme cache (purchased themes from PackMyCode) and upload session state; IndexedDB for deployment logs and session history (006-themes-and-deploy)

- TypeScript 5+ (strict mode) + React 18+, Zustand 4 (state management), Vanilla Extract + CSS Modules (styling), Radix UI (accessible primitives) (001-dashboard-shell)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5+ (strict mode): Follow standard conventions

## Recent Changes
- 006-themes-and-deploy: Added TypeScript 5+ (strict mode) + React 18+, Zustand 4 (state management), Radix UI (dialog, dropdown primitives for Deploy Panel), date-fns (timestamps for deployment logs)
- 005-basic-ai-training: Added TypeScript 5+ (strict mode), inherited from dashboard shell + React 18+, Zustand 4 (state management), Radix UI (form primitives, color picker), react-hook-form (form validation)
- 003-ai-coding-mode: Added TypeScript 5+ (strict mode) with React 18+ + React 18+, Zustand 4 (state management), Monaco Editor (code display/diff), Prism.js or Shiki (syntax highlighting), date-fns (timestamps)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
