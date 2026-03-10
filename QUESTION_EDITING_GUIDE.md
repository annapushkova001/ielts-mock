# How to Edit Questions in IELTS Mock Test

## Where is the file?

All questions, passages, and settings are stored in **one single file**:

```
src/data/test-data.json
```

Open it in any text editor (VS Code, Notepad++, Sublime Text, or even plain Notepad).

> **Important**: JSON is a strict format. A single missing comma, quote, or bracket will break the entire test. Always validate your JSON after editing at https://jsonlint.com (paste your file, click "Validate JSON").

---

## Overall File Structure

```
{
  "title": "...",          ← Test title on welcome screen
  "duration": 3600,        ← Time limit in SECONDS (3600 = 60 min)
  "branding": { ... },     ← Logo, colors
  "cta": { ... },          ← Call-to-action block on results page
  "passages": [ ... ]      ← Array of reading passages with questions
}
```

---

## 1. General Settings

### Test Title
```json
"title": "IELTS Academic Reading Practice Test 1"
```
Change the text inside quotes to your test name.

### Duration
```json
"duration": 3600
```
Time in **seconds**. Common values:
- 60 minutes = `3600`
- 40 minutes = `2400`
- 20 minutes = `1200`

### Branding
```json
"branding": {
  "title": "IELTS Mock",
  "primaryColor": "#000000",
  "accentColor": "#dc2626"
}
```
| Field | What it does | Example |
|-------|-------------|---------|
| `title` | Brand name shown in the header | `"IELTS Boss"` |
| `primaryColor` | Header background color | `"#000000"` (black) |
| `accentColor` | Accent color for buttons, highlights | `"#2C54F6"` (blue) |
| `logoUrl` | *(optional)* URL to a logo image | `"https://example.com/logo.png"` |

> Colors are in **hex format**: `#` followed by 6 characters. Use https://htmlcolorcodes.com to pick colors.

### CTA (Call-to-Action block on results page)
```json
"cta": {
  "heading": "Хотите улучшить свой результат?",
  "description": "Запишитесь на курс подготовки к IELTS...",
  "buttonText": "Записаться на курс",
  "buttonUrl": "https://ieltsboss.co",
  "buttonColor": "#2C54F6"
}
```
| Field | What it does |
|-------|-------------|
| `heading` | Big title text |
| `description` | *(optional)* Smaller text below the title. Remove this line entirely if not needed |
| `buttonText` | Text on the button |
| `buttonUrl` | Where the button links to |
| `buttonColor` | *(optional)* Button color. If not set, uses `accentColor` |

---

## 2. Passages

The test has an array of passages. Standard IELTS has **3 passages** but you can have 1, 2, 3 or more.

```json
"passages": [
  {
    "id": "passage-1",
    "title": "The History of Timekeeping",
    "content": "<p>paragraph text here...</p><p>more text...</p>",
    "questionGroups": [ ... ]
  },
  {
    "id": "passage-2",
    ...
  }
]
```

| Field | Rules |
|-------|-------|
| `id` | Unique identifier. Use format `"passage-1"`, `"passage-2"`, etc. **Must be unique across all passages** |
| `title` | Passage title shown above the text |
| `content` | The actual reading text in **HTML format** |
| `questionGroups` | Array of question groups for this passage |

### Writing passage content

The `content` field uses HTML tags for formatting:

| What you want | HTML to write |
|--------------|---------------|
| A paragraph | `<p>Your text here.</p>` |
| Bold text | `<strong>bold</strong>` |
| Italic text | `<em>italic</em>` |
| A section heading | `<h2>Section Title</h2>` |
| A line break | `<br/>` |

**Example:**
```json
"content": "<p>First paragraph of the passage.</p><p>Second paragraph with <strong>bold</strong> word.</p><h2>Section A</h2><p>Text under section A.</p>"
```

> **Important**: All the text must be on ONE line in JSON. No real line breaks inside the quotes. Use `<p>...</p>` to separate paragraphs.

> **For Matching Information questions**: If your passage has labeled sections (A, B, C...), use `<h2>A</h2>` headings to label them.

---

## 3. Question Groups

Each passage has one or more **question groups**. A group is a set of questions that share the same type and instructions.

```json
"questionGroups": [
  {
    "id": "qg-1",
    "type": "true-false-not-given",
    "title": "Questions 1–5",
    "instruction": "Do the following statements agree with...",
    "questions": [ ... ]
  }
]
```

### Common fields for ALL question groups:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID like `"qg-1"`, `"qg-2"`, etc. **Must be unique across the entire test** |
| `type` | Yes | One of the 10 types listed below |
| `title` | Yes | Display title, e.g. `"Questions 1–5"` |
| `instruction` | Yes | Instructions shown to the student. Can contain HTML like `<strong>` |
| `questions` | Yes | Array of individual questions |
| `wordLimit` | Only for completion types | Text like `"ONE WORD ONLY"` or `"NO MORE THAN TWO WORDS"` |
| `chooseCount` | Only for `multiple-choice-multi` | How many answers to select, e.g. `2` |
| `navGrouped` | Only for `multiple-choice-multi` | Set to `true` — groups questions as one in navigation |
| `options` | Only for matching types | Shared answer options (see below) |

---

## 4. The 10 Question Types — Detailed Guide

### ID and Number Rules (applies to ALL types)

Every question needs:
```json
{
  "id": "q-1",        ← Unique ID. MUST be unique across the ENTIRE test
  "number": 1,        ← Question number shown to student (1, 2, 3...)
  "text": "...",       ← The question text
  "correctAnswer": "", ← The correct answer
  "explanation": "",   ← Explanation shown on results page (in Russian)
  "passageHighlight": { ... }  ← (optional) Highlights relevant passage text
}
```

**Question numbers must be sequential across the entire test** (1, 2, 3... through 40).

**Question IDs must be unique across the entire test** (`"q-1"`, `"q-2"`, ... `"q-40"`).

### passageHighlight (optional, works on all types)

Highlights a part of the passage on the results page to show where the answer comes from:
```json
"passageHighlight": {
  "startText": "first few words of the highlighted section",
  "endText": "last few words of the highlighted section"
}
```
The system finds `startText` in the passage, then finds `endText` after it, and highlights everything in between. **Copy the exact text from your passage** — it must match character-for-character.

---

### TYPE 1: `true-false-not-given`

Student reads a statement and decides if it's TRUE, FALSE, or NOT GIVEN based on the passage.

```json
{
  "id": "qg-1",
  "type": "true-false-not-given",
  "title": "Questions 1–5",
  "instruction": "Do the following statements agree with the information given in the passage? Write <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement contradicts the information, <strong>NOT GIVEN</strong> if there is no information on this.",
  "questions": [
    {
      "id": "q-1",
      "number": 1,
      "text": "The ancient Egyptians created sundials around 1500 BCE.",
      "options": [
        { "id": "true", "text": "TRUE" },
        { "id": "false", "text": "FALSE" },
        { "id": "not-given", "text": "NOT GIVEN" }
      ],
      "correctAnswer": "true",
      "explanation": "В тексте сказано: 'Around 1500 BCE, they created sundials'.",
      "passageHighlight": { "startText": "Around 1500 BCE", "endText": "indicate the time of day" }
    }
  ]
}
```

**Key rules:**
- Each question MUST have exactly 3 options with these exact IDs: `"true"`, `"false"`, `"not-given"`
- `correctAnswer` must be one of: `"true"`, `"false"`, or `"not-given"`
- Copy the `options` array exactly as shown for every question of this type

---

### TYPE 2: `yes-no-not-given`

Same as TRUE/FALSE/NOT GIVEN but about the **writer's views/claims** (not factual info).

```json
{
  "id": "qg-5",
  "type": "yes-no-not-given",
  "title": "Questions 19–22",
  "instruction": "Do the following statements agree with the views of the writer? Write <strong>YES</strong>...",
  "questions": [
    {
      "id": "q-19",
      "number": 19,
      "text": "Vertical farming could eventually replace traditional agriculture entirely.",
      "options": [
        { "id": "yes", "text": "YES" },
        { "id": "no", "text": "NO" },
        { "id": "not-given", "text": "NOT GIVEN" }
      ],
      "correctAnswer": "no",
      "explanation": "Автор пишет: 'vertical farming complements rather than replaces traditional agriculture'."
    }
  ]
}
```

**Key rules:**
- Options IDs must be: `"yes"`, `"no"`, `"not-given"`
- `correctAnswer` must be one of: `"yes"`, `"no"`, or `"not-given"`

---

### TYPE 3: `multiple-choice-single`

Student chooses ONE correct answer from A, B, C, D.

```json
{
  "id": "qg-2",
  "type": "multiple-choice-single",
  "title": "Questions 6–8",
  "instruction": "Choose the correct letter, <strong>A</strong>, <strong>B</strong>, <strong>C</strong> or <strong>D</strong>.",
  "questions": [
    {
      "id": "q-6",
      "number": 6,
      "text": "What was the main limitation of early mechanical clocks?",
      "options": [
        { "id": "a", "text": "A They were too expensive to produce" },
        { "id": "b", "text": "B They could only be used in monasteries" },
        { "id": "c", "text": "C They were significantly inaccurate" },
        { "id": "d", "text": "D They required constant maintenance" }
      ],
      "correctAnswer": "c",
      "explanation": "В тексте: 'they were notoriously inaccurate'."
    }
  ]
}
```

**Key rules:**
- Option IDs should be lowercase letters: `"a"`, `"b"`, `"c"`, `"d"`
- Option text should include the letter: `"A Some text"`, `"B Other text"`
- `correctAnswer` is one letter ID: `"a"`, `"b"`, `"c"`, or `"d"`
- You can have 3, 4, or 5 options per question

---

### TYPE 4: `multiple-choice-multi`

Student chooses TWO (or more) correct answers from a list. This is different from single choice!

```json
{
  "id": "qg-10",
  "type": "multiple-choice-multi",
  "title": "Questions 38–39",
  "instruction": "Choose <strong>TWO</strong> letters, <strong>A–E</strong>.",
  "chooseCount": 2,
  "navGrouped": true,
  "questions": [
    {
      "id": "q-38",
      "number": 38,
      "text": "Which TWO examples of choice architecture are mentioned in the passage?",
      "options": [
        { "id": "a", "text": "A Limiting the number of choices available" },
        { "id": "b", "text": "B Placing healthy food at eye level" },
        { "id": "c", "text": "C Making retirement savings opt-out by default" },
        { "id": "d", "text": "D Providing detailed nutritional information" },
        { "id": "e", "text": "E Banning unhealthy food from shops" }
      ],
      "correctAnswer": ["b", "c"],
      "explanation": "В тексте приведены два примера: расположение здоровой еды на уровне глаз и пенсионные планы по умолчанию."
    },
    {
      "id": "q-39",
      "number": 39,
      "text": "Which TWO examples of choice architecture are mentioned in the passage?",
      "options": [
        { "id": "a", "text": "A Limiting the number of choices available" },
        { "id": "b", "text": "B Placing healthy food at eye level" },
        { "id": "c", "text": "C Making retirement savings opt-out by default" },
        { "id": "d", "text": "D Providing detailed nutritional information" },
        { "id": "e", "text": "E Banning unhealthy food from shops" }
      ],
      "correctAnswer": ["b", "c"],
      "explanation": "В тексте приведены два примера."
    }
  ]
}
```

**Key rules:**
- `chooseCount`: how many answers the student must pick (usually `2`)
- `navGrouped`: set to `true` so questions appear as one block in navigation
- `correctAnswer` is an **array** (list) with square brackets: `["b", "c"]`
- **You need as many question entries as `chooseCount`**. If `chooseCount` is 2, create 2 questions (e.g. q-38 and q-39) with **identical** text, options, and correctAnswer. They share the same checkbox UI but each occupies a question number.
- All questions in the group must have the **same** `options` and `correctAnswer`

---

### TYPE 5: `matching-headings`

Student drags headings from a list to match them with sections/paragraphs. Uses drag-and-drop.

```json
{
  "id": "qg-7",
  "type": "matching-headings",
  "title": "Questions 27–30",
  "instruction": "Choose the correct heading for each section from the list of headings below.",
  "options": [
    { "id": "h-i", "text": "i. The influence of presentation on choices" },
    { "id": "h-ii", "text": "ii. Mental shortcuts and their drawbacks" },
    { "id": "h-iii", "text": "iii. Why losses hurt more than gains feel good" },
    { "id": "h-iv", "text": "iv. Designing environments for better decisions" },
    { "id": "h-v", "text": "v. The myth of the rational human" },
    { "id": "h-vi", "text": "vi. How tiredness affects judgment" }
  ],
  "questions": [
    {
      "id": "q-27",
      "number": 27,
      "text": "Paragraph 2 (Kahneman and Tversky's heuristics)",
      "correctAnswer": "h-ii",
      "explanation": "Параграф 2 описывает ментальные шаблоны (heuristics) и их недостатки."
    }
  ]
}
```

**Key rules:**
- `options` is on the **question group level** (not inside each question). These are the heading choices students pick from.
- You should have **more options than questions** (distractors). E.g. 6 headings for 4 questions.
- `correctAnswer` is the `id` of the matching option: `"h-ii"`
- `text` in each question describes which section to match (e.g. paragraph number)
- Questions do NOT have their own `options` field — they use the group's shared `options`

---

### TYPE 6: `note-completion`

Student types a word/phrase to fill in blanks in notes.

```json
{
  "id": "qg-3",
  "type": "note-completion",
  "title": "Questions 9–13",
  "instruction": "Complete the notes below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.",
  "wordLimit": "ONE WORD ONLY",
  "questions": [
    {
      "id": "q-9",
      "number": 9,
      "text": "Early humans used the sun and the _____ to track time.",
      "correctAnswer": "moon",
      "acceptableAnswers": ["Moon"],
      "explanation": "В тексте: 'the phases of the moon provided a natural calendar'."
    }
  ]
}
```

**Key rules:**
- `wordLimit`: display text telling student the word limit (shown in red)
- Use `_____` (five underscores) in the `text` to mark where the blank is
- `correctAnswer`: the expected answer (case-insensitive matching is automatic)
- `acceptableAnswers`: *(optional)* array of alternative correct answers. Example: if answer is `"twelve"`, you might add `"acceptableAnswers": ["12"]`
- No `options` field — this is a free-text input

---

### TYPE 7: `summary-completion`

Similar to note-completion but formatted as flowing text (inline blanks within a paragraph).

```json
{
  "id": "qg-6",
  "type": "summary-completion",
  "title": "Questions 23–26",
  "instruction": "Complete the summary below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.",
  "wordLimit": "NO MORE THAN TWO WORDS",
  "questions": [
    {
      "id": "q-23",
      "number": 23,
      "text": "Vertical farms can be set up in various locations including skyscrapers and converted _____.",
      "correctAnswer": "warehouses",
      "explanation": "В тексте: 'skyscrapers, converted warehouses, shipping containers'."
    }
  ]
}
```

**Key rules:**
- Same as `note-completion` — uses `_____` for blanks, free-text input
- The difference is visual: summary-completion displays as inline flowing text, note-completion displays as a list
- `acceptableAnswers` works the same way

---

### TYPE 8: `matching-information`

Student matches statements to labeled paragraphs (A, B, C, etc.).

```json
{
  "id": "qg-4",
  "type": "matching-information",
  "title": "Questions 14–18",
  "instruction": "Which paragraph contains the following information? Write the correct letter, <strong>A–G</strong>.",
  "options": [
    { "id": "A", "text": "Paragraph A" },
    { "id": "B", "text": "Paragraph B" },
    { "id": "C", "text": "Paragraph C" },
    { "id": "D", "text": "Paragraph D" },
    { "id": "E", "text": "Paragraph E" },
    { "id": "F", "text": "Paragraph F" },
    { "id": "G", "text": "Paragraph G" }
  ],
  "questions": [
    {
      "id": "q-14",
      "number": 14,
      "text": "A reference to the financial costs of establishing a vertical farm",
      "correctAnswer": "F",
      "explanation": "В параграфе F: 'The initial capital investment...'."
    }
  ]
}
```

**Key rules:**
- `options` on group level — list of paragraphs to choose from
- Option `id` should match the paragraph letter: `"A"`, `"B"`, etc.
- `correctAnswer` is the paragraph letter: `"F"`
- Your passage `content` must use `<h2>A</h2>`, `<h2>B</h2>` etc. to label sections
- Multiple questions CAN have the same correct answer (same paragraph)

---

### TYPE 9: `matching-features`

Student matches statements/findings to people, categories, or concepts.

```json
{
  "id": "qg-8",
  "type": "matching-features",
  "title": "Questions 31–34",
  "instruction": "Match each finding or concept with the correct researcher(s). Write the correct letter, <strong>A–D</strong>.",
  "options": [
    { "id": "A", "text": "A Daniel Kahneman and Amos Tversky" },
    { "id": "B", "text": "B Solomon Asch" },
    { "id": "C", "text": "C Richard Thaler and Cass Sunstein" },
    { "id": "D", "text": "D Classical economists" }
  ],
  "questions": [
    {
      "id": "q-31",
      "number": 31,
      "text": "Believed that humans always make rational decisions",
      "correctAnswer": "D",
      "explanation": "Классическая экономика предполагала, что люди — рациональные субъекты."
    }
  ]
}
```

**Key rules:**
- `options` on group level — list of people/features to match to
- Each option `text` should include its letter: `"A Daniel Kahneman..."`
- `correctAnswer` is the option ID: `"A"`, `"B"`, etc.
- Multiple questions can have the same answer

---

### TYPE 10: `matching-sentence-endings`

Student matches the beginning of a sentence with the correct ending.

```json
{
  "id": "qg-9",
  "type": "matching-sentence-endings",
  "title": "Questions 35–37",
  "instruction": "Complete each sentence with the correct ending, <strong>A–F</strong>, below.",
  "options": [
    { "id": "A", "text": "A they become more conservative in their judgments." },
    { "id": "B", "text": "B how easily they can recall similar events." },
    { "id": "C", "text": "C the mathematical facts are unchanged." },
    { "id": "D", "text": "D it restricts people's freedom of choice." },
    { "id": "E", "text": "E reinforcing people's existing beliefs." },
    { "id": "F", "text": "F people's perceptions can be altered." }
  ],
  "questions": [
    {
      "id": "q-35",
      "number": 35,
      "text": "The availability heuristic leads people to assess probability based on",
      "correctAnswer": "B",
      "explanation": "Эвристика доступности: люди оценивают вероятность по тому, насколько легко вспоминают примеры."
    }
  ]
}
```

**Key rules:**
- `options` on group level — list of sentence endings
- More options than questions (distractors)
- `text` in each question is the sentence beginning
- `correctAnswer` is the option ID: `"B"`

---

## 5. Quick Checklist Before Saving

Run through this checklist every time you edit the file:

- [ ] All `id` values are unique across the **entire** file (passage IDs, group IDs, question IDs)
- [ ] Question `number` values go sequentially from 1 to N across the **entire** test (not restarting per passage)
- [ ] Every `correctAnswer` matches an actual option `id` (for selection types) or is the expected text (for completion types)
- [ ] Every opening `{` has a closing `}`
- [ ] Every opening `[` has a closing `]`
- [ ] Every string is wrapped in `"double quotes"`
- [ ] Items in arrays/objects are separated by commas
- [ ] There is NO comma after the **last** item in any array or object
- [ ] Passage `content` is all on one line (no real line breaks inside quotes)
- [ ] For TFNG: option IDs are exactly `"true"`, `"false"`, `"not-given"`
- [ ] For YNNG: option IDs are exactly `"yes"`, `"no"`, `"not-given"`
- [ ] For multi-choice-multi: `correctAnswer` uses square brackets `["a", "b"]`
- [ ] File validates at https://jsonlint.com

---

## 6. Adding a New Passage

Copy this template and fill it in:

```json
{
  "id": "passage-4",
  "title": "YOUR PASSAGE TITLE",
  "content": "<p>First paragraph.</p><p>Second paragraph.</p>",
  "questionGroups": [
    {
      "id": "qg-NEW-UNIQUE-ID",
      "type": "PICK_A_TYPE",
      "title": "Questions N–M",
      "instruction": "Your instruction text here.",
      "questions": [

      ]
    }
  ]
}
```

Add it inside the `"passages": [...]` array, **with a comma after the previous passage's closing `}`**.

---

## 7. Common Mistakes and How to Fix Them

### "The page is blank / shows an error"
Your JSON has a syntax error. Paste the file content into https://jsonlint.com — it will show you exactly which line has the problem.

### "A question shows no options"
You forgot the `options` array inside the question (for TFNG, YNNG, MC types) or on the group level (for matching types).

### "The correct answer is marked wrong"
The `correctAnswer` value doesn't match any option `id`. Check for typos, extra spaces, or capitalization. IDs are **case-sensitive**: `"true"` is not `"True"`.

### "Passage highlight doesn't work"
The `startText` or `endText` doesn't exactly match text in your passage `content`. Copy-paste the exact text from your passage.

### "Questions are numbered wrong"
Question `number` values must be sequential across all passages. If Passage 1 has questions 1-13, Passage 2 must start at 14, not 1.

---

## 8. Full Minimal Example (1 passage, 2 question types)

```json
{
  "title": "My Practice Test",
  "duration": 1200,
  "branding": {
    "title": "My Brand",
    "primaryColor": "#000000",
    "accentColor": "#2C54F6"
  },
  "cta": {
    "heading": "Want to improve?",
    "buttonText": "Learn more",
    "buttonUrl": "https://ieltsboss.co"
  },
  "passages": [
    {
      "id": "passage-1",
      "title": "Sample Passage",
      "content": "<p>Cats are domesticated animals that have lived alongside humans for thousands of years. They were first domesticated in ancient Egypt around 4000 years ago.</p><p>Modern cats are known for their independent nature and hunting instincts.</p>",
      "questionGroups": [
        {
          "id": "qg-1",
          "type": "true-false-not-given",
          "title": "Questions 1–2",
          "instruction": "Write <strong>TRUE</strong>, <strong>FALSE</strong>, or <strong>NOT GIVEN</strong>.",
          "questions": [
            {
              "id": "q-1",
              "number": 1,
              "text": "Cats were first domesticated in ancient Egypt.",
              "options": [
                { "id": "true", "text": "TRUE" },
                { "id": "false", "text": "FALSE" },
                { "id": "not-given", "text": "NOT GIVEN" }
              ],
              "correctAnswer": "true",
              "explanation": "В тексте: 'first domesticated in ancient Egypt'."
            },
            {
              "id": "q-2",
              "number": 2,
              "text": "Cats are the most popular pet in the world.",
              "options": [
                { "id": "true", "text": "TRUE" },
                { "id": "false", "text": "FALSE" },
                { "id": "not-given", "text": "NOT GIVEN" }
              ],
              "correctAnswer": "not-given",
              "explanation": "В тексте не сказано о популярности кошек среди домашних животных."
            }
          ]
        },
        {
          "id": "qg-2",
          "type": "note-completion",
          "title": "Question 3",
          "instruction": "Complete the note. Choose <strong>ONE WORD ONLY</strong>.",
          "wordLimit": "ONE WORD ONLY",
          "questions": [
            {
              "id": "q-3",
              "number": 3,
              "text": "Cats are known for their _____ nature.",
              "correctAnswer": "independent",
              "explanation": "В тексте: 'their independent nature'."
            }
          ]
        }
      ]
    }
  ]
}
```
