# Data Model: IELTS Reading Section Simulator

**Date**: 2026-03-10
**Source**: spec.md Key Entities + UI Reference

## Entity Relationship

```
TestConfig (1) ──── BrandingConfig (1)
    │
    ├── CTAConfig (1)
    │
    └── Passage (1..N)
           │
           └── QuestionGroup (1..N)
                  │
                  └── Question (1..N)

Session (runtime, client-side)
    │
    ├── UserAnswer (0..40)
    │
    └── Result (1, computed on submit)
```

## Entities

### TestConfig

Root configuration object loaded from `test-data.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Test title (e.g., "IELTS Academic Reading Practice Test 1") |
| duration | number | yes | Duration in seconds (default: 3600 = 60 min) |
| branding | BrandingConfig | yes | Header branding settings |
| cta | CTAConfig | yes | Results page CTA block |
| passages | Passage[] | yes | Ordered list of passages (typically 3) |

### BrandingConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| logoUrl | string | no | URL to logo image; if omitted, text-only header |
| title | string | yes | Brand name displayed in header |
| primaryColor | string | yes | Hex color for header background (default: "#000000") |
| accentColor | string | no | Hex color for accent elements (default: "#dc2626", IELTS red) |

### CTAConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| heading | string | yes | CTA heading text (Russian) |
| description | string | no | CTA body text (Russian) |
| buttonText | string | yes | Button label (Russian) |
| buttonUrl | string | yes | External URL to navigate to |
| buttonColor | string | no | Hex color for CTA button (default: accentColor) |

### Passage

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique identifier (e.g., "passage-1") |
| title | string | yes | Passage title displayed in bold |
| content | string | yes | Passage body text (HTML). Supported tags: `<p>`, `<h2>`, `<h3>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<tr>`, `<td>`, `<th>`, `<img>` (with src). No `<script>`, `<style>`, `<iframe>`. Content is admin-provided and bundled at build time |
| questionGroups | QuestionGroup[] | yes | Ordered list of question groups for this passage |

### QuestionGroup

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique identifier (e.g., "qg-1") |
| type | QuestionType | yes | One of the supported question types |
| title | string | yes | Group heading (e.g., "Questions 1–6") |
| instruction | string | yes | Instruction text with bold markers (e.g., "Choose **TRUE** if...") |
| wordLimit | string | no | For completion types: "ONE WORD ONLY", "NO MORE THAN TWO WORDS", etc. |
| questions | Question[] | yes | Ordered list of questions |
| options | MatchOption[] | no | Shared options for all matching types: heading options, paragraph labels, feature categories, sentence endings. Structure: `{id, text}` |
| navGrouped | boolean | no | If true, questions share grouped nav buttons (e.g., "18–19") |
| chooseCount | number | no | For MC-multi: number of required selections (e.g., 2) |

### QuestionType (enum)

```
"true-false-not-given"
"yes-no-not-given"
"multiple-choice-single"
"multiple-choice-multi"
"matching-headings"
"note-completion"
"summary-completion"
"matching-information"
"matching-features"
"matching-sentence-endings"
```

### Question

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique identifier (e.g., "q-1") |
| number | number | yes | Display number (1–40, globally unique across test) |
| text | string | yes | Question text or statement |
| options | Option[] | no | For MC/TFNG/YNNG: list of selectable options |
| correctAnswer | string \| string[] | yes | Correct answer(s); string for single, string[] for multi-select |
| acceptableAnswers | string[] | no | Alternative correct answers for text input types (any match = correct). Not used for multi-select types |
| passageHighlight | PassageHighlight | no | Reference to passage fragment for review highlighting |
| explanation | string | yes | Explanation text for review (Russian language) |

### Option

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Option identifier (e.g., "a", "b", "true") |
| text | string | yes | Option display text |

### MatchOption

Shared option type for all matching/heading question types (Matching Headings, Information, Features, Sentence Endings).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Option identifier |
| text | string | yes | Option display text |

### PassageHighlight

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| startText | string | yes | Starting fragment of the highlighted text (for fuzzy match in passage) |
| endText | string | yes | Ending fragment |

## Runtime Entities (Client-Side Only)

### Session

Stored in localStorage. Key: `ielts-session`.

| Field | Type | Description |
|-------|------|-------------|
| testId | string | Identifier for the loaded test config (hash or title) |
| status | "not-started" \| "in-progress" \| "completed" | Session lifecycle |
| startedAt | number \| null | Unix timestamp of test start |
| remainingSeconds | number | Seconds remaining on timer |
| currentQuestionIndex | number | Index of active question (0-based) |
| answers | Record<string, string \| string[]> | Map of question ID → user answer(s) |
| reviewFlags | string[] | Array of question IDs flagged for review |

### Result

Computed on test submission, not stored persistently.

| Field | Type | Description |
|-------|------|-------------|
| totalCorrect | number | Count of correct answers (0–40) |
| totalQuestions | number | Total questions in test |
| bandScore | number | Converted band score (1.0–9.0, step 0.5) |
| passageBreakdown | PassageResult[] | Per-passage breakdown |
| questionResults | QuestionResult[] | Per-question detail for review |

### PassageResult

| Field | Type | Description |
|-------|------|-------------|
| passageId | string | Reference to passage |
| passageTitle | string | Passage title for display |
| correct | number | Correct answers in this passage |
| total | number | Total questions in this passage |

### QuestionResult

| Field | Type | Description |
|-------|------|-------------|
| questionId | string | Reference to question |
| questionNumber | number | Display number |
| userAnswer | string \| string[] \| null | What user answered |
| correctAnswer | string \| string[] | Expected answer |
| isCorrect | boolean | Comparison result |
| explanation | string | Explanation text (Russian) |
| passageHighlight | PassageHighlight \| null | Highlighted passage fragment |

## Validation Rules

1. **Question numbers**: Must be globally unique and sequential (1–N) across all passages
2. **Question IDs**: Must be unique across entire test
3. **Passage count**: Minimum 1, standard IELTS is 3
4. **correctAnswer for text inputs**: Stored lowercase, trimmed; comparison is case-insensitive with trim
5. **correctAnswer for multi-select**: Array of option IDs; order doesn't matter for comparison
6. **wordLimit**: Enforced on text input fields (client-side validation)
7. **chooseCount**: For MC-multi, exactly this many checkboxes must be checked
8. **acceptableAnswers**: For text input types only; if present, user answer matches if it equals correctAnswer OR any item in acceptableAnswers (case-insensitive, trimmed)
9. **Band score normalization**: If totalQuestions ≠ 40, normalize: `normalizedScore = round(rawCorrect / totalQuestions * 40)`, then apply standard conversion table
10. **Runtime config validation**: On load, verify required fields exist (passages, questions) before rendering; show error screen if invalid

## State Transitions

```
Session.status:
  "not-started" → "in-progress"   (user clicks Start Test)
  "in-progress" → "completed"     (user clicks Submit OR timer reaches 0)

No reverse transitions. Once completed, session is read-only (results displayed).
New test attempt = new session (old session cleared).

On app load with existing "in-progress" session:
  → Show "Resume / Start New" screen
  → Resume: restore session, recalculate remaining = duration - (now - startedAt)
  → Start New: clear session, show WelcomeScreen

Timer source of truth: startedAt (not remainingSeconds).
  On resume: remaining = duration - (now - startedAt)
  remainingSeconds in localStorage is a periodic snapshot, NOT authoritative.
```
