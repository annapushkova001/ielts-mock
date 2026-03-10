import { useState, useMemo, useCallback, useEffect } from 'react';
import Header from '../layout/Header';
import InstructionBar from '../layout/InstructionBar';
import SplitScreen from '../layout/SplitScreen';
import NavigationBar from '../layout/NavigationBar';
import PassageViewer from '../ui/PassageViewer';
import OptionsMenu from '../ui/OptionsMenu';
import FlagButton from '../ui/FlagButton';
import QuestionRenderer from '../questions/QuestionRenderer';
import { useTimer } from '../../hooks/useTimer';
import type { TestConfig, Session, QuestionGroup } from '../../types';

interface TestScreenProps {
  config: TestConfig;
  session: Session;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onToggleFlag: (questionId: string) => void;
  onSubmit: () => void;
  onNavigateToReview: () => void;
  currentQuestionIndex: number;
  onSetCurrentQuestion: (index: number) => void;
}

export default function TestScreen({
  config,
  session,
  onAnswer,
  onToggleFlag,
  onSubmit,
  onNavigateToReview,
  currentQuestionIndex,
  onSetCurrentQuestion,
}: TestScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { remainingSeconds } = useTimer({
    duration: config.duration,
    startedAt: session.startedAt,
    onTimeUp: onSubmit,
  });

  // Build flat list of all question groups with their passage index
  const allGroups = useMemo(() => {
    const groups: { passageIndex: number; group: QuestionGroup; startIndex: number }[] = [];
    let cumulative = 0;
    config.passages.forEach((passage, pi) => {
      passage.questionGroups.forEach(group => {
        groups.push({ passageIndex: pi, group, startIndex: cumulative });
        cumulative += group.questions.length;
      });
    });
    return groups;
  }, [config.passages]);

  // Find which group contains the current question index
  const findCurrentGroup = useCallback(() => {
    for (const entry of allGroups) {
      const groupEnd = entry.startIndex + entry.group.questions.length;
      if (currentQuestionIndex < groupEnd) {
        return entry;
      }
    }
    return allGroups[allGroups.length - 1];
  }, [allGroups, currentQuestionIndex]);

  const { passageIndex } = findCurrentGroup();
  const currentPassage = config.passages[passageIndex];

  // Current question ID for flagging
  const currentQuestionId = useMemo(() => {
    let idx = 0;
    for (const passage of config.passages) {
      for (const group of passage.questionGroups) {
        for (const q of group.questions) {
          if (idx === currentQuestionIndex) return q.id;
          idx++;
        }
      }
    }
    return '';
  }, [config.passages, currentQuestionIndex]);

  // Handle part change — jump to first question of that passage
  const handlePartChange = useCallback((partIndex: number) => {
    let idx = 0;
    for (let pi = 0; pi < config.passages.length; pi++) {
      if (pi === partIndex) {
        onSetCurrentQuestion(idx);
        return;
      }
      for (const group of config.passages[pi].questionGroups) {
        idx += group.questions.length;
      }
    }
  }, [config.passages, onSetCurrentQuestion]);

  // All question groups for the current passage
  const passageGroups = currentPassage.questionGroups;

  // Instruction text — full range for the passage
  const allPassageQuestions = passageGroups.flatMap(g => g.questions);
  const firstQ = allPassageQuestions[0];
  const lastQ = allPassageQuestions[allPassageQuestions.length - 1];
  const instructionText = `Read the text and answer questions ${firstQ.number}–${lastQ.number}`;

  const isFlagged = session.reviewFlags.includes(currentQuestionId);

  // Scroll to current question with offset + auto-focus first input
  useEffect(() => {
    if (!currentQuestionId) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`question-${currentQuestionId}`);
      if (!el) return;

      // Scroll with offset so the question isn't glued to the top
      const scrollContainer = el.closest('.overflow-y-auto');
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = elRect.top - containerRect.top + scrollContainer.scrollTop - 16;
        scrollContainer.scrollTo({ top: offset, behavior: 'smooth' });
      }

      // Auto-focus first interactive element in the question
      const focusable = el.querySelector<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      if (focusable) {
        focusable.focus({ preventScroll: true });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [currentQuestionId]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        branding={config.branding}
        remainingSeconds={remainingSeconds}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />
      <OptionsMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onGoToReview={onNavigateToReview}
      />
      <InstructionBar
        partNumber={passageIndex + 1}
        instructionText={instructionText}
      />
      <div className="flex-1 overflow-hidden pb-20 flex flex-col">
        <SplitScreen
          left={
            <PassageViewer
              title={currentPassage.title}
              content={currentPassage.content}
            />
          }
          right={
            <div className="p-4 md:p-6 overflow-y-auto h-full">
              <div className="flex items-center justify-end mb-4">
                <FlagButton
                  isFlagged={isFlagged}
                  onToggle={() => onToggleFlag(currentQuestionId)}
                />
              </div>
              <div className="space-y-8">
                {passageGroups.map(group => (
                  <QuestionRenderer
                    key={group.id}
                    questionGroup={group}
                    answers={session.answers}
                    onAnswer={onAnswer}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>
      <NavigationBar
        config={config}
        session={session}
        currentQuestionIndex={currentQuestionIndex}
        onNavigate={onSetCurrentQuestion}
        onPartChange={handlePartChange}
        onReview={onNavigateToReview}
      />
    </div>
  );
}
