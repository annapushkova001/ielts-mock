import type { TestConfig, Session } from '../../types';
import { useMemo } from 'react';

interface NavigationBarProps {
  config: TestConfig;
  session: Session;
  currentQuestionIndex: number;
  onNavigate: (questionIndex: number) => void;
  onPartChange: (partIndex: number) => void;
  onReview: () => void;
}

export default function NavigationBar({
  config,
  session,
  currentQuestionIndex,
  onNavigate,
  onPartChange,
  onReview,
}: NavigationBarProps) {
  // Build flat question list with passage info
  const allQuestions = useMemo(() => {
    const questions: { id: string; number: number; passageIndex: number; globalIndex: number }[] = [];
    let globalIndex = 0;
    config.passages.forEach((passage, pi) => {
      passage.questionGroups.forEach(group => {
        group.questions.forEach(q => {
          questions.push({ id: q.id, number: q.number, passageIndex: pi, globalIndex });
          globalIndex++;
        });
      });
    });
    return questions;
  }, [config.passages]);

  // Current passage index
  const currentPassageIndex = allQuestions[currentQuestionIndex]?.passageIndex ?? 0;

  // Per-passage stats
  const passageStats = useMemo(() => {
    return config.passages.map((_, pi) => {
      const passageQuestions = allQuestions.filter(q => q.passageIndex === pi);
      const attempted = passageQuestions.filter(q => session.answers[q.id] !== undefined).length;
      return { total: passageQuestions.length, attempted };
    });
  }, [config.passages, allQuestions, session.answers]);

  // Questions for current passage
  const currentPassageQuestions = allQuestions.filter(q => q.passageIndex === currentPassageIndex);

  const totalQuestions = allQuestions.length;

  const handlePrev = () => {
    if (currentQuestionIndex > 0) onNavigate(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) onNavigate(currentQuestionIndex + 1);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-300 shadow-lg">
      {/* Part tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {config.passages.map((_, pi) => {
          const stats = passageStats[pi];
          return (
            <button
              key={pi}
              onClick={() => onPartChange(pi)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                pi === currentPassageIndex
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Part {pi + 1}
              <span className="ml-1.5 text-xs text-gray-400">
                {stats.attempted}/{stats.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Question numbers + navigation */}
      <div className="flex items-center px-2 py-2 gap-2">
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {currentPassageQuestions.map(q => {
            const isActive = q.globalIndex === currentQuestionIndex;
            const isAnswered = session.answers[q.id] !== undefined;
            const isFlagged = session.reviewFlags.includes(q.id);

            return (
              <button
                key={q.id}
                onClick={() => onNavigate(q.globalIndex)}
                className={`w-8 h-8 text-xs rounded font-medium shrink-0 cursor-pointer relative ${
                  isActive
                    ? 'ring-2 ring-blue-600 bg-blue-100 text-blue-800'
                    : isAnswered
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {q.number}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            →
          </button>
          <button
            onClick={onReview}
            className="px-3 py-1.5 text-sm rounded font-medium cursor-pointer"
            style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
          >
            ✓ Review
          </button>
        </div>
      </div>
    </div>
  );
}
