# Quickstart: IELTS Reading Section Simulator

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
# Clone and checkout feature branch
git clone <repo-url>
cd ielts-mock
git checkout 001-ielts-reading-simulator

# Install dependencies
npm install

# Start dev server
npm run dev
```

Dev server runs at `http://localhost:5173`.

## Project Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| Vite | 6 | Build tool + dev server |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| @dnd-kit/core | latest | Drag-and-drop (Matching Headings) |
| react-resizable-panels | latest | Split-screen layout |

## Key Files

```
src/
├── App.tsx                     # Root component + routing between screens
├── data/test-data.json         # Test content (passages, questions, answers, branding, CTA)
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Branded header with timer
│   │   ├── SplitScreen.tsx     # Resizable passage/questions panels
│   │   ├── NavigationBar.tsx   # Bottom nav: parts, question numbers, prev/next
│   │   └── InstructionBar.tsx  # Part indicator + instruction text
│   ├── screens/
│   │   ├── WelcomeScreen.tsx   # Start screen with instructions
│   │   ├── TestScreen.tsx      # Main test-taking screen (orchestrator)
│   │   ├── ReviewScreen.tsx    # Pre-submit answer overview
│   │   └── ResultsScreen.tsx   # Band score + detailed review + CTA
│   ├── questions/
│   │   ├── TrueFalseNotGiven.tsx
│   │   ├── YesNoNotGiven.tsx
│   │   ├── MultipleChoiceSingle.tsx
│   │   ├── MultipleChoiceMulti.tsx
│   │   ├── MatchingHeadings.tsx
│   │   ├── NoteCompletion.tsx
│   │   ├── SummaryCompletion.tsx
│   │   ├── MatchingInformation.tsx
│   │   ├── MatchingFeatures.tsx
│   │   ├── MatchingSentenceEndings.tsx
│   │   └── QuestionRenderer.tsx  # Routes question type → component
│   └── ui/
│       ├── Timer.tsx
│       ├── OptionsMenu.tsx
│       ├── PassageViewer.tsx    # Passage renderer with highlight support
│       ├── FlagButton.tsx       # Review flag toggle
│       └── Button.tsx
├── hooks/
│   ├── useTimer.ts             # Countdown timer (start only, no pause)
│   ├── useTestSession.ts       # Session state management + localStorage
│   ├── useAccessibility.ts     # Contrast mode + text size context
│   └── useScoring.ts           # Answer checking + band score calculation
├── types/
│   └── index.ts                # TypeScript interfaces (TestConfig, Question, etc.)
└── utils/
    ├── scoring.ts              # Band score conversion table (with normalization)
    ├── validation.ts           # Answer comparison (case-insensitive, trim, acceptableAnswers)
    ├── configValidator.ts      # Runtime validation of test-data.json
    └── session.ts              # localStorage read/write helpers
```

## Customizing Test Content

Edit `src/data/test-data.json` following the schema in `specs/001-ielts-reading-simulator/contracts/test-data-schema.json`.

Structure:
```json
{
  "title": "Practice Reading Test 1",
  "duration": 3600,
  "branding": { "title": "YourBrand", "primaryColor": "#000000" },
  "cta": { "heading": "...", "buttonText": "...", "buttonUrl": "https://..." },
  "passages": [
    {
      "id": "passage-1",
      "title": "...",
      "content": "...",
      "questionGroups": [ ... ]
    }
  ]
}
```

## Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
npx vercel --yes --prod
```

## Testing

```bash
npm run test          # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
```
