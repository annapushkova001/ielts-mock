# Implementation Plan: IELTS Reading Section Simulator

**Branch**: `001-ielts-reading-simulator` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ielts-reading-simulator/spec.md`

## Summary

Build a client-side IELTS Academic Reading test simulator as a static SPA. The simulator replicates the official Inspera-based IELTS computer-delivered test interface: split-screen layout (passage left, questions right), 10 question types, 60-minute countdown timer, bottom navigation bar with part tabs and question numbers. After submission, users see band score with full answer review (correct answers, passage highlights, explanations in Russian). The project serves as a branded lead magnet with configurable CTA. Test content and branding are defined via a JSON config file in the repository and deployed as static assets to Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19, Vite 6, Tailwind CSS 4, @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities (drag-drop), react-resizable-panels (split-screen)
**Storage**: localStorage (client-side session persistence), JSON file (test data config)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), responsive 375px–2560px
**Project Type**: Static SPA (single-page application), no backend
**Performance Goals**: Page load <3s, smooth 60fps interactions, <500KB initial JS bundle (gzipped)
**Constraints**: Fully client-side, no server, no authentication, no database; Vercel static hosting
**Scale/Scope**: Single test per instance, ~40 questions, ~4 screens, ~18 components
**Accessibility**: Contrast toggle (CSS class on root) + text size (3 levels via CSS custom property); state in React Context, persisted to localStorage
**Mobile Strategy**: Below 768px breakpoint, SplitScreen switches to vertical single-panel mode with tab-based toggle (Passage / Questions); NavigationBar collapses to compact horizontal scroll

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file is an unfilled template — no project-specific principles defined yet. No gates to enforce. **PASSED** (no violations possible).

**Post-Phase 1 re-check**: Design uses a single project with flat component structure, no over-engineering. JSON config file for content — simplest possible approach. No backend, no database, no auth — minimal complexity. **PASSED**.

## Project Structure

### Documentation (this feature)

```text
specs/001-ielts-reading-simulator/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: technology research decisions
├── data-model.md        # Phase 1: entity model + validation rules
├── quickstart.md        # Phase 1: setup & development guide
├── contracts/
│   └── test-data-schema.json  # JSON Schema for test-data.json
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── screenshots/         # UI reference screenshots from official IELTS demo
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                          # Root: screen routing (welcome → test → review → results)
├── main.tsx                         # Vite entry point
├── index.css                        # Tailwind imports + global styles
├── data/
│   └── test-data.json               # Test content config (passages, questions, branding, CTA)
├── types/
│   └── index.ts                     # All TypeScript interfaces
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Branded header: logo, title, timer, options menu
│   │   ├── SplitScreen.tsx          # Resizable left/right panels; <768px: single-panel with Passage/Questions toggle
│   │   ├── NavigationBar.tsx        # Bottom: part tabs, question numbers, prev/next, review
│   │   └── InstructionBar.tsx       # "Part X — Read the text and answer questions X–Y"
│   ├── screens/
│   │   ├── WelcomeScreen.tsx        # Instructions + Start Test button; shows Resume/Start New if session exists
│   │   ├── TestScreen.tsx           # Main orchestrator: split-screen + nav + timer
│   │   ├── ReviewScreen.tsx         # Pre-submit: all questions status overview + confirmation dialog before submit
│   │   └── ResultsScreen.tsx        # Band score + per-question review (with passage highlight) + CTA (primary) + Retake (secondary)
│   ├── questions/
│   │   ├── QuestionRenderer.tsx     # Routes question group type → specific component
│   │   ├── TrueFalseNotGiven.tsx    # Radio: TRUE / FALSE / NOT GIVEN
│   │   ├── YesNoNotGiven.tsx        # Radio: YES / NO / NOT GIVEN
│   │   ├── MultipleChoiceSingle.tsx # Radio buttons, single selection
│   │   ├── MultipleChoiceMulti.tsx  # Checkboxes, N selections required
│   │   ├── MatchingHeadings.tsx     # @dnd-kit drag headings → drop zones in passage; includes Help button overlay
│   │   ├── NoteCompletion.tsx       # Bulleted list with inline text inputs
│   │   ├── SummaryCompletion.tsx    # Paragraph with inline text inputs
│   │   ├── MatchingInformation.tsx  # Dropdown/select: match info → paragraphs
│   │   ├── MatchingFeatures.tsx     # Dropdown/select: match statements → categories
│   │   └── MatchingSentenceEndings.tsx # Dropdown/select: match beginnings → endings
│   └── ui/
│       ├── Timer.tsx                # Countdown display (MM:SS), warning at <5min
│       ├── OptionsMenu.tsx          # Hamburger: submission, contrast toggle, text size selector
│       ├── PassageViewer.tsx        # Renders passage HTML; supports highlight mode (startText/endText) for results review
│       ├── FlagButton.tsx           # Toggle review flag on current question (bookmark icon)
│       └── Button.tsx               # Reusable button component
├── hooks/
│   ├── useTimer.ts                  # Countdown logic (start only, no pause); startedAt is source of truth; recalculates on resume
│   ├── useTestSession.ts            # Session CRUD: answers, review flags, status, persistence
│   ├── useAccessibility.ts          # Context provider: contrast mode (normal/high), text size (sm/md/lg), localStorage sync
│   └── useScoring.ts                # Compute results from answers + config
└── utils/
    ├── scoring.ts                   # Band score conversion table (raw → band); normalizes if totalQuestions ≠ 40
    ├── validation.ts                # Answer comparison: case-insensitive, trim, array match, acceptableAnswers support
    ├── configValidator.ts           # Runtime validation of test-data.json required fields on load
    └── session.ts                   # localStorage helpers with JSON serialize/deserialize
```

**Structure Decision**: Single-project SPA (no backend). Flat `src/` with clear separation: `components/` (UI), `hooks/` (state logic), `utils/` (pure functions), `types/` (interfaces), `data/` (config). This is the simplest structure that supports the feature scope.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| No backend | Client-side only | Spec: stateless MVP, no auth, no analytics |
| JSON config (not CMS) | File in repo | Spec: admin edits file, deploys |
| @dnd-kit over custom | Library for DnD | Only Matching Headings needs it; touch + a11y built-in |
| react-resizable-panels | Library for split | Accessibility, keyboard support, active maintenance |
| localStorage | Session persistence | Spec: client-side only, crash recovery required |
