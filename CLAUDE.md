# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Bulglo**, a mobile-first, Progressive Web App (PWA) for teaching Bulgarian Cyrillic alphabet and basic vocabulary to English speakers. The app is designed to work completely offline with local data persistence and no backend.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build tooling**: Vite
- **State management**: Zustand with persistence via localforage
- **Persistence**: IndexedDB via localforage, localStorage for transient values
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with light/dark theme support
- **PWA**: Workbox via vite-plugin-pwa
- **Testing**: Vitest + React Testing Library + Playwright for e2e

## Key Architecture Concepts

### Content Structure
All lesson content is stored as static JSON files shipped with the app. The content follows a hierarchical structure:
- **Course** → **Units** → **Lessons** → **Exercises**
- Each lesson contains 10-15 exercises of various types
- Vocabulary items are referenced by ID across lessons

### Exercise Types
The app supports 7 exercise types: `multiple_choice`, `select_letters`, `match_pairs`, `type`, `order_words`, `true_false`, and `flashcard`.

### Gamification System
- XP system: 100 XP = +1 level
- SRS (Spaced Repetition): 5-bucket system (0d, 1d, 2d, 4d, 7d)
- Streak counter tracks consecutive days
- Badge system for milestones

### Data Models
Key TypeScript interfaces are defined for:
- `LetterCard`: Cyrillic letters with romanization and IPA
- `VocabItem`: Bulgarian-English vocabulary pairs
- `Exercise`: Individual learning tasks
- `Lesson`: Collections of exercises
- `Unit`: Groups of lessons
- `ProgressState`: User progress and settings

## Development Commands

Since this project uses Vite + React + TypeScript:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check
- `npm test` - Run Vitest unit tests
- `npm run test:e2e` - Run Playwright e2e tests

## PWA Requirements

The app must meet these Lighthouse scores:
- PWA: 100
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- Performance: ≥ 90

## Offline-First Design

All content (lessons, media, fonts) must be precached. The app should work completely offline after first load with no network calls during normal usage.

## Data Persistence

User progress is stored locally using IndexedDB via localforage. The app supports manual backup/restore via JSON file export/import. No cloud sync or user accounts in v1.