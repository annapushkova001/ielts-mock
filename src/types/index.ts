export type QuestionType =
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'multiple-choice-single'
  | 'multiple-choice-multi'
  | 'matching-headings'
  | 'note-completion'
  | 'summary-completion'
  | 'matching-information'
  | 'matching-features'
  | 'matching-sentence-endings';

export interface Option {
  id: string;
  text: string;
}

export interface MatchOption {
  id: string;
  text: string;
}

export interface PassageHighlight {
  startText: string;
  endText: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  options?: Option[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  passageHighlight?: PassageHighlight;
  explanation: string;
}

export interface QuestionGroup {
  id: string;
  type: QuestionType;
  title: string;
  instruction: string;
  wordLimit?: string;
  chooseCount?: number;
  navGrouped?: boolean;
  options?: MatchOption[];
  questions: Question[];
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  questionGroups: QuestionGroup[];
}

export interface BrandingConfig {
  logoUrl?: string;
  title: string;
  primaryColor: string;
  accentColor?: string;
}

export interface CTAConfig {
  heading: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor?: string;
}

export interface TestConfig {
  title: string;
  duration: number;
  branding: BrandingConfig;
  cta: CTAConfig;
  passages: Passage[];
}

export type SessionStatus = 'not-started' | 'in-progress' | 'completed';

export interface Session {
  testId: string;
  status: SessionStatus;
  startedAt: number | null;
  remainingSeconds: number;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  reviewFlags: string[];
}

export interface PassageResult {
  passageId: string;
  passageTitle: string;
  correct: number;
  total: number;
}

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  userAnswer: string | string[] | null;
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
  passageHighlight: PassageHighlight | null;
}

export interface Result {
  totalCorrect: number;
  totalQuestions: number;
  bandScore: number;
  passageBreakdown: PassageResult[];
  questionResults: QuestionResult[];
}

export type Screen = 'welcome' | 'test' | 'review' | 'results';

export type TextSize = 'sm' | 'md' | 'lg';
export type ContrastMode = 'normal' | 'high';

export interface AccessibilityState {
  textSize: TextSize;
  contrastMode: ContrastMode;
  setTextSize: (size: TextSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
}
