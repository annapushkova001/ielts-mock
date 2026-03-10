# Research: IELTS Reading Section Simulator

**Date**: 2026-03-10
**Feature**: 001-ielts-reading-simulator

## R-001: IELTS Academic Reading Band Score Conversion

**Decision**: Use standard approximate conversion table (raw score → band)

**Rationale**: Cambridge adjusts slightly per test via "equating", but for a simulator the standard table is the accepted reference. All major IELTS prep platforms use it.

**Conversion Table**:

| Raw Score | Band |
|-----------|------|
| 39–40     | 9.0  |
| 37–38     | 8.5  |
| 35–36     | 8.0  |
| 33–34     | 7.5  |
| 30–32     | 7.0  |
| 27–29     | 6.5  |
| 23–26     | 6.0  |
| 19–22     | 5.5  |
| 15–18     | 5.0  |
| 13–14     | 4.5  |
| 10–12     | 4.0  |
| 8–9       | 3.5  |
| 6–7       | 3.0  |
| 4–5       | 2.5  |
| 0–3       | 2.0  |

**Alternatives considered**: Dynamic difficulty-adjusted scoring — rejected, overcomplicated for MVP.

## R-002: Drag-and-Drop for Matching Headings

**Decision**: @dnd-kit/core

**Rationale**: ~10KB minified, excellent touch/mobile support via PointerSensor, TypeScript-first, actively maintained. Hooks API (`useDraggable`, `useDroppable`) is React-idiomatic. Perfect fit for dragging headings from a list to drop zones in a passage.

**Alternatives considered**:
- react-beautiful-dnd — deprecated (archived Aug 2025)
- HTML5 native Drag API — no mobile touch support
- Pointer events custom — too much implementation effort
- pragmatic-drag-and-drop — headless, steeper learning curve

## R-003: Resizable Split-Screen Panels

**Decision**: react-resizable-panels (bvaughn)

**Rationale**: Most actively maintained (2.5M weekly downloads, 348/365 days activity), excellent TypeScript support, built-in keyboard accessibility (Arrow, Home, End, Escape), layout persistence support. The higher download count and active maintenance outweigh the slightly larger bundle vs lighter alternatives.

**Alternatives considered**:
- react-split-pane — maintenance concerns, historical gaps
- allotment — unmaintained (3+ months no updates)
- Custom CSS — no accessibility, touch handling burden

## R-004: Tech Stack Decision

**Decision**: React 19 + Vite 6 + TypeScript 5 + Tailwind CSS 4

**Rationale**:
- **React 19**: Industry standard, massive ecosystem, good for complex interactive UI with many question types
- **Vite 6**: Fast dev builds, optimized production bundles, trivial Vercel deploy as static
- **TypeScript 5**: Type safety critical for complex data model (Test → Passage → QuestionGroup → Question)
- **Tailwind CSS 4**: Rapid styling, easy to match IELTS dark header/light content design system, responsive utilities built-in

**Alternatives considered**:
- Next.js — SSR/SSG overhead unnecessary for fully client-side SPA
- Vanilla JS/TS — too complex for 10+ question type components, drag-drop, split-screen
- Svelte — smaller ecosystem, team familiarity assumption

## R-005: Session Persistence

**Decision**: localStorage with JSON serialization

**Rationale**: Spec requires client-side session only (no backend). localStorage persists across page refresh within same origin. Session object stores: answers map, remaining time, current question index, test status.

**Alternatives considered**:
- sessionStorage — cleared on tab close (too aggressive for accidental close recovery)
- IndexedDB — overkill for <50KB of session data
- No persistence — spec explicitly requires crash recovery

## R-006: Test Data Configuration Format

**Decision**: JSON file (`test-data.json`) bundled in project

**Rationale**: Spec requires JSON/YAML in repo, applied at deploy time. JSON chosen over YAML because: native browser parsing, no additional dependency, TypeScript type safety via interfaces, easier validation.

**Alternatives considered**:
- YAML — requires js-yaml dependency, no browser-native parsing
- Multiple files per passage — unnecessary fragmentation for single-test MVP
