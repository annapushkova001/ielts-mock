import { useState, useMemo } from 'react';
import Button from '../ui/Button';
import type { TestConfig, Session } from '../../types';

interface ReviewScreenProps {
  config: TestConfig;
  session: Session;
  onGoToQuestion: (questionIndex: number) => void;
  onSubmit: () => void;
  onBackToTest: () => void;
}

export default function ReviewScreen({
  config,
  session,
  onGoToQuestion,
  onSubmit,
  onBackToTest,
}: ReviewScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const allQuestions = useMemo(() => {
    const questions: { id: string; number: number; globalIndex: number; passageTitle: string }[] = [];
    let globalIndex = 0;
    config.passages.forEach(passage => {
      passage.questionGroups.forEach(group => {
        group.questions.forEach(q => {
          questions.push({ id: q.id, number: q.number, globalIndex, passageTitle: passage.title });
          globalIndex++;
        });
      });
    });
    return questions;
  }, [config.passages]);

  const unansweredCount = allQuestions.filter(q => session.answers[q.id] === undefined).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Review Your Answers</h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {allQuestions.map(q => {
              const isAnswered = session.answers[q.id] !== undefined;
              const isFlagged = session.reviewFlags.includes(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => onGoToQuestion(q.globalIndex)}
                  className={`relative w-full aspect-square flex items-center justify-center rounded text-sm font-medium cursor-pointer ${
                    isAnswered
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {q.number}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-green-100 border border-green-300 rounded inline-block" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-red-50 border border-red-200 rounded inline-block" />
            Unanswered ({unansweredCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-orange-500 rounded-full inline-block" />
            Flagged
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBackToTest}>
            Back to Test
          </Button>
          <Button variant="primary" onClick={() => setShowConfirm(true)}>
            Submit Test
          </Button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
              <h2 className="text-xl font-bold">Submit Test?</h2>
              <p className="text-gray-600">
                {unansweredCount > 0
                  ? `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you sure you want to submit?`
                  : 'Are you sure you want to submit your test?'}
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                  Yes, Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
