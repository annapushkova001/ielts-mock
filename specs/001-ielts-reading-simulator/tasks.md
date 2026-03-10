# Tasks: IELTS Reading Section Simulator

**Input**: Design documents from `/specs/001-ielts-reading-simulator/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/test-data-schema.json, research.md

**Tests**: Not explicitly requested in spec — test tasks omitted. Add manually if TDD desired.

**Organization**: Tasks grouped by user story (US1–US5) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story (US1–US5) from spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, base config

- [X] T001 Initialize Vite 6 project with React 19 + TypeScript 5 in repository root (package.json, tsconfig.json, vite.config.ts)
- [X] T002 Install runtime dependencies: tailwindcss@4, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react-resizable-panels
- [X] T003 [P] Configure Tailwind CSS 4 in src/index.css with custom theme: IELTS colors (primaryColor #000000, accentColor #dc2626), responsive breakpoints (375px, 768px, 2560px), CSS custom properties for accessibility (--text-size, --contrast-mode)
- [X] T004 [P] Define all TypeScript interfaces in src/types/index.ts: TestConfig, BrandingConfig, CTAConfig, Passage, QuestionGroup, QuestionType enum, Question, Option, MatchOption, PassageHighlight, Session, Result, PassageResult, QuestionResult — per data-model.md
- [X] T005 [P] Create minimal placeholder test-data.json in src/data/test-data.json with 1 passage, 3 questions (1x TFNG, 1x MC-single, 1x note-completion), branding and CTA sections — sufficient for development

**Checkpoint**: Project builds with `npm run dev`, blank page renders at localhost:5173

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and app shell that ALL user stories depend on

- [X] T006 [P] Implement localStorage helpers in src/utils/session.ts: saveSession(), loadSession(), clearSession() with JSON serialize/deserialize; key "ielts-session"
- [X] T007 [P] Implement runtime config validator in src/utils/configValidator.ts: validateTestConfig(data) checks required fields exist (title, duration, branding, cta, passages with questionGroups); returns {valid: boolean, errors: string[]}
- [X] T008 [P] Implement useAccessibility hook in src/hooks/useAccessibility.ts: React Context provider with contrast mode (normal/high) and text size (sm/md/lg); persists to localStorage key "ielts-accessibility"; applies CSS class on document root
- [X] T009 [P] Create reusable Button component in src/components/ui/Button.tsx: variants (primary, secondary, ghost), sizes (sm, md, lg), disabled state; primary uses accentColor
- [X] T010 Implement App.tsx root component in src/App.tsx: screen routing state machine (welcome → test → review → results); on mount check localStorage for existing in-progress session — if found show Resume/Start New choice; load and validate test-data.json with configValidator; wrap tree in AccessibilityProvider

**Checkpoint**: App shell renders, routing works between screens (empty placeholders), session detection works

---

## Phase 3: User Story 1 — Test Taking (Priority: P1)

**Goal**: User opens simulator, sees welcome screen, starts test, views passages in split-screen, answers questions with all 10 question types, timer counts down from 60 minutes.

**Independent Test**: Open simulator → click Start Test → see split-screen with passage left and questions right → answer a question → see timer counting down → answer is persisted in localStorage.

### Core Layout Components

- [X] T011 [P] [US1] Implement PassageViewer in src/components/ui/PassageViewer.tsx: renders passage HTML content safely (dangerouslySetInnerHTML for admin-provided content); supports highlight mode with startText/endText markers (wrap matched range in <mark>); independent vertical scroll
- [X] T012 [P] [US1] Implement Timer in src/components/ui/Timer.tsx: displays remaining time as MM:SS; red warning style when < 5 minutes; receives remainingSeconds as prop
- [X] T013 [US1] Implement useTimer hook in src/hooks/useTimer.ts: accepts duration and startedAt; computes remaining = duration - (now - startedAt) on mount and every second via setInterval; no pause (start only); auto-calls onTimeUp callback when remaining <= 0; syncs remainingSeconds snapshot to localStorage periodically (every 10s)
- [X] T014 [US1] Implement useTestSession hook in src/hooks/useTestSession.ts: manages Session state (status, answers as Record<string,string|string[]>, reviewFlags as string[], currentQuestionIndex); setAnswer(questionId, value), toggleFlag(questionId), setCurrentQuestion(index); persists to localStorage on every state change; provides startTest(), submitTest() transitions
- [X] T015 [P] [US1] Implement Header in src/components/layout/Header.tsx: fixed top bar; left: logo (from branding.logoUrl or text fallback branding.title), right: Timer component + hamburger menu button (≡); background color from branding.primaryColor; respects accessibility context (contrast, text size)
- [X] T016 [P] [US1] Implement InstructionBar in src/components/layout/InstructionBar.tsx: light-gray/blue bar below header; accent left border; "Part X" bold + instruction text "Read the text and answer questions X–Y"; receives partNumber, instructionText as props
- [X] T017 [US1] Implement SplitScreen in src/components/layout/SplitScreen.tsx: uses react-resizable-panels (PanelGroup, Panel, PanelResizeHandle); left panel = PassageViewer, right panel = question content; draggable divider with ↔ icon; default 50/50 split; each panel scrolls independently; desktop only (>=768px), mobile handled in Phase 8

### Question Type Components (all parallelizable — different files, shared interface)

All question components receive props: `questionGroup: QuestionGroup, answers: Record<string, string|string[]>, onAnswer: (questionId: string, value: string|string[]) => void`

- [X] T018 [P] [US1] Implement TrueFalseNotGiven in src/components/questions/TrueFalseNotGiven.tsx: for each question in group — question number in bordered box, statement text, 3 radio buttons (TRUE / FALSE / NOT GIVEN); calls onAnswer with selected value
- [X] T019 [P] [US1] Implement YesNoNotGiven in src/components/questions/YesNoNotGiven.tsx: identical structure to TFNG but options are YES / NO / NOT GIVEN
- [X] T020 [P] [US1] Implement MultipleChoiceSingle in src/components/questions/MultipleChoiceSingle.tsx: question text, radio buttons for each option from question.options; single selection
- [X] T021 [P] [US1] Implement MultipleChoiceMulti in src/components/questions/MultipleChoiceMulti.tsx: question text, checkboxes for each option; enforce chooseCount from questionGroup (disable additional checkboxes when limit reached); grouped question numbers in display (e.g., "Questions 18–19")
- [X] T022 [P] [US1] Implement MatchingHeadings in src/components/questions/MatchingHeadings.tsx: uses @dnd-kit — right panel shows "List of Headings" as draggable items in bordered boxes; left panel (passage) shows dashed blue outline drop zones with question numbers; includes Help button overlay explaining drag interaction; on drop calls onAnswer with heading option id
- [X] T023 [P] [US1] Implement NoteCompletion in src/components/questions/NoteCompletion.tsx: bulleted list layout; text with inline <input> fields; input placeholder shows question number; validates word count per wordLimit from questionGroup; calls onAnswer on blur/change
- [X] T024 [P] [US1] Implement SummaryCompletion in src/components/questions/SummaryCompletion.tsx: paragraph layout (not bulleted); text with inline <input> fields; input placeholder shows question number; validates word count per wordLimit; calls onAnswer on blur/change
- [X] T025 [P] [US1] Implement MatchingInformation in src/components/questions/MatchingInformation.tsx: each question shows statement text + dropdown/select populated from questionGroup.options (paragraph labels A, B, C...); calls onAnswer with selected option id
- [X] T026 [P] [US1] Implement MatchingFeatures in src/components/questions/MatchingFeatures.tsx: each question shows statement text + dropdown/select from questionGroup.options (category names); calls onAnswer with selected option id
- [X] T027 [P] [US1] Implement MatchingSentenceEndings in src/components/questions/MatchingSentenceEndings.tsx: each question shows sentence beginning + dropdown/select from questionGroup.options (sentence endings); calls onAnswer with selected option id
- [X] T028 [US1] Implement QuestionRenderer in src/components/questions/QuestionRenderer.tsx: receives questionGroup, routes by questionGroup.type to the correct component (switch/map over all 10 QuestionType enum values); passes through answers and onAnswer

### Screen Assembly

- [X] T029 [P] [US1] Implement OptionsMenu in src/components/ui/OptionsMenu.tsx: hamburger dropdown; "Go to submission page" red button (triggers navigation to ReviewScreen); "Contrast" toggle (calls useAccessibility); "Text size" selector (sm/md/lg via useAccessibility); closes on outside click
- [X] T030 [US1] Implement WelcomeScreen in src/components/screens/WelcomeScreen.tsx: test title from config, IELTS Reading instructions text (English), "Start Test" button (primary); if session exists shows Resume/Start New buttons instead
- [X] T031 [US1] Implement TestScreen orchestrator in src/components/screens/TestScreen.tsx: composes Header + InstructionBar + SplitScreen (PassageViewer left, QuestionRenderer right); initializes useTimer and useTestSession; passes answers/onAnswer to question components; auto-submits on timer expiry; updates InstructionBar based on current passage/question group

**Checkpoint**: Full test-taking experience works — start test, view passage, answer questions (all types), timer counts down, answers persist in localStorage

---

## Phase 4: User Story 2 — Navigation (Priority: P1)

**Goal**: User freely navigates between questions and passages — click question numbers, switch parts, flag questions for review, see pre-submit overview.

**Independent Test**: Start test → click Part 2 tab → see Part 2 passage and questions → click question number 15 → jump to question 15 → flag a question → open ReviewScreen → see all questions with statuses.

- [X] T032 [US2] Implement NavigationBar in src/components/layout/NavigationBar.tsx: fixed bottom bar; part tabs ("Part 1", "Part 2", "Part 3") with progress "X of Y attempted"; question number buttons inside active part (individual or grouped per navGrouped flag, e.g., "18–19"); visual statuses: not-attempted (default), active (bordered), attempted (filled); Previous/Next buttons (dark, right side, Previous disabled on Q1); "Review your answers" button (✓, right side); receives session state, onNavigate, onPartChange callbacks
- [X] T033 [P] [US2] Implement FlagButton in src/components/ui/FlagButton.tsx: bookmark/flag icon toggle; receives isFlagged boolean and onToggle callback; renders next to current question in TestScreen
- [X] T034 [US2] Implement ReviewScreen in src/components/screens/ReviewScreen.tsx: grid/list of all 40 questions showing status (answered/unanswered/flagged); click question number navigates back to that question in TestScreen; "Submit Test" button triggers confirmation dialog ("Are you sure? X questions unanswered.") — confirm submits, cancel returns to review
- [X] T035 [US2] Integrate navigation into TestScreen in src/components/screens/TestScreen.tsx: add NavigationBar to bottom; add FlagButton next to QuestionRenderer; wire onNavigate to update currentQuestionIndex and scroll passage; wire part tabs to switch passage; wire "Review" button to navigate to ReviewScreen; wire "Go to submission page" from OptionsMenu to ReviewScreen

**Checkpoint**: Full navigation works — part switching, question jumping, flagging, review screen, confirmation dialog, submit flow

---

## Phase 5: User Story 3 — Results & CTA (Priority: P2)

**Goal**: After submission, user sees band score, per-passage breakdown, full per-question review with correct answers + passage highlights + Russian explanations, and a CTA leading to the sales funnel.

**Independent Test**: Submit test → see band score (e.g., 6.5) and "27 out of 40 correct" → see per-passage breakdown → scroll through question review (correct/incorrect markers, correct answers shown, passage highlights, Russian explanations) → see CTA block → click CTA → navigates to external URL.

- [X] T036 [P] [US3] Implement band score conversion in src/utils/scoring.ts: rawToBand(rawCorrect, totalQuestions) function; normalizes if totalQuestions ≠ 40: normalizedScore = Math.round(rawCorrect / totalQuestions * 40); applies standard IELTS conversion table from research.md (39-40→9.0, 37-38→8.5, ..., 0-3→2.0)
- [X] T037 [P] [US3] Implement answer validation in src/utils/validation.ts: checkAnswer(userAnswer, correctAnswer, acceptableAnswers?) function; text inputs: case-insensitive, trim, check against correctAnswer then acceptableAnswers array; multi-select (string[]): unordered set comparison; returns boolean
- [X] T038 [US3] Implement useScoring hook in src/hooks/useScoring.ts: takes session answers + testConfig; computes Result object: totalCorrect, totalQuestions, bandScore (via scoring.ts), passageBreakdown (PassageResult[]), questionResults (QuestionResult[] with isCorrect via validation.ts, explanation, passageHighlight)
- [X] T039 [US3] Implement ResultsScreen in src/components/screens/ResultsScreen.tsx: top section: band score (large), "X out of Y correct", per-passage breakdown cards (passage title + correct/total); middle section: per-question review list — each item shows question number, user answer, correct answer, correct/incorrect icon, passage highlight (rendered via PassageViewer in highlight mode), explanation text in Russian; bottom section: CTA block (primary/accent style — heading, description, button with configurable color and URL, opens in new tab) + "Retake Test" button (secondary/ghost style, clears session, returns to WelcomeScreen)

**Checkpoint**: Full results flow — band score displayed correctly, all questions reviewed with highlights and explanations, CTA navigates to external URL, Retake clears and restarts

---

## Phase 6: User Story 4 — Content Customization (Priority: P2)

**Goal**: Admin replaces test content via JSON config file — all passages, question groups, questions with all 10 types render correctly from config.

**Independent Test**: Edit test-data.json with 3 passages and 40 questions covering all 10 question types → run dev server → complete full test → verify all question types render with correct interactive elements → verify scoring works for all types.

- [X] T040 [US4] Create comprehensive test-data.json in src/data/test-data.json: 3 passages, ~40 questions total covering all 10 question types (at least 1 group per type); include branding config, CTA config, passageHighlight references, Russian explanations, acceptableAnswers examples for completion types; validate against specs/001-ielts-reading-simulator/contracts/test-data-schema.json
- [X] T041 [US4] End-to-end validation of config-driven rendering: verify each of 10 question types renders correctly from test-data.json; verify scoring works for all types (TFNG radio, MC checkbox, text input with acceptableAnswers, matching dropdown, DnD headings); fix any rendering or scoring issues discovered

**Checkpoint**: Full 3-passage, 40-question test works end-to-end from JSON config, all question types functional

---

## Phase 7: User Story 5 — Branding Customization (Priority: P3)

**Goal**: Admin changes branding in JSON config — logo, title, colors — and the simulator reflects the changes visually.

**Independent Test**: Change branding.logoUrl, branding.title, branding.primaryColor, branding.accentColor, cta.buttonColor in test-data.json → reload → verify header shows new logo and title with correct background color → verify accent color applies to active elements → verify CTA button uses configured color.

- [X] T042 [US5] Wire dynamic branding into Header in src/components/layout/Header.tsx: render logoUrl as <img> (or text-only fallback if omitted); apply primaryColor as background-color; apply accentColor as CSS custom property --accent-color used by buttons and active states throughout app
- [X] T043 [US5] Wire dynamic CTA styling in src/components/screens/ResultsScreen.tsx: apply cta.buttonColor (fallback to accentColor) as CTA button background; ensure contrast is readable (white text on colored background)

**Checkpoint**: Changing branding/CTA values in test-data.json visually updates header and results screen

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Mobile responsiveness, accessibility integration, performance, deployment

- [X] T044 Implement mobile responsive SplitScreen in src/components/layout/SplitScreen.tsx: below 768px breakpoint switch to single-panel mode with tab-based toggle ("Passage" / "Questions" tabs at top); only one panel visible at a time; preserve scroll position when switching
- [X] T045 [P] Implement mobile compact NavigationBar in src/components/layout/NavigationBar.tsx: below 768px collapse part tabs to horizontal scroll; question number buttons in scrollable row; Previous/Next buttons remain fixed
- [X] T046 [P] Integrate accessibility CSS in src/index.css: high-contrast mode (CSS class .high-contrast on root — increased borders, stronger colors, underlined links); text size levels (--text-size-sm: 14px, --text-size-md: 16px, --text-size-lg: 20px applied to body font-size)
- [X] T047 Verify production build: run npm run build; check dist/ output; verify JS bundle < 500KB gzipped; fix any build warnings or errors
- [X] T048 Deploy to Vercel: run npx vercel --yes --prod; verify live URL loads correctly; test full flow on deployed version (welcome → test → navigate → submit → results → CTA)

**Checkpoint**: Simulator works on mobile (375px+), accessibility features functional, deployed and accessible via public URL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on US1 (navigation integrates into TestScreen)
- **US3 (Phase 5)**: Depends on Phase 2 (can build scoring utils in parallel with US1/US2, but ResultsScreen integration needs submit flow from US2)
- **US4 (Phase 6)**: Depends on US1 + US2 + US3 (needs all question types and scoring working to validate comprehensive config)
- **US5 (Phase 7)**: Depends on US1 (needs Header component)
- **Polish (Phase 8)**: Depends on US1 + US2 (needs layout components to make responsive)

### Parallel Opportunities by Phase

```
Phase 1: T003 ∥ T004 ∥ T005 (after T001, T002)
Phase 2: T006 ∥ T007 ∥ T008 ∥ T009 (all independent)
Phase 3: T011 ∥ T012 ∥ T015 ∥ T016 (layout components)
         T018 ∥ T019 ∥ T020 ∥ T021 ∥ T022 ∥ T023 ∥ T024 ∥ T025 ∥ T026 ∥ T027 (all 10 question types)
Phase 4: T033 can parallel with T032
Phase 5: T036 ∥ T037 (scoring + validation utils)
Phase 7: T042 ∥ T043
Phase 8: T044 ∥ T045 ∥ T046
```

### Critical Path

```
T001 → T002 → T004 → T010 → T014 → T031 → T035 → T034 → T039 → T040 → T048
Setup → Foundation → Session → TestScreen → Navigation → Review → Results → Full Config → Deploy
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (test-taking with all question types)
4. Complete Phase 4: US2 (navigation + review + submit)
5. **STOP and VALIDATE**: Full test flow works end-to-end with placeholder data
6. Deploy MVP if ready

### Incremental Delivery

1. Setup + Foundational → App shell ready
2. US1 → Test-taking works → Internal demo
3. US2 → Full navigation + submit → Usable MVP
4. US3 → Results + CTA → Funnel-ready product
5. US4 → Real content → Production-ready
6. US5 → Branding → Client-deliverable
7. Polish → Mobile + a11y + deploy → Launch

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to user story for traceability
- Each user story is independently testable at its checkpoint
- Commit after each task or logical group
- No test tasks generated (not requested in spec) — add via manual edit if TDD desired
- Total questions in comprehensive test-data.json should be exactly 40 per standard IELTS format
