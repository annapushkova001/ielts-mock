import { useMemo } from 'react';
import Button from '../ui/Button';
import PassageViewer from '../ui/PassageViewer';
import type { TestConfig, Result } from '../../types';

interface ResultsScreenProps {
  config: TestConfig;
  result: Result;
  onRetake: () => void;
}

export default function ResultsScreen({ config, result, onRetake }: ResultsScreenProps) {
  // Map passage IDs to their content for highlight display
  const passageMap = useMemo(() => {
    const map: Record<string, { title: string; content: string }> = {};
    config.passages.forEach(p => {
      map[p.id] = { title: p.title, content: p.content };
    });
    return map;
  }, [config.passages]);

  // Map questionId → passageId
  const questionPassageMap = useMemo(() => {
    const map: Record<string, string> = {};
    config.passages.forEach(p => {
      p.questionGroups.forEach(g => {
        g.questions.forEach(q => {
          map[q.id] = p.id;
        });
      });
    });
    return map;
  }, [config.passages]);

  const { cta } = config;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Band Score Header */}
      <div className="bg-white border-b py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Your Band Score</p>
          <p className="text-6xl font-bold mb-3" style={{ color: 'var(--accent-color)' }}>
            {result.bandScore.toFixed(1)}
          </p>
          <p className="text-lg text-gray-700">
            {result.totalCorrect} out of {result.totalQuestions} correct
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Passage Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.passageBreakdown.map(pb => (
            <div key={pb.passageId} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500 mb-1 truncate">{pb.passageTitle}</p>
              <p className="text-2xl font-bold">
                {pb.correct}/{pb.total}
              </p>
            </div>
          ))}
        </div>

        {/* Per-Question Review */}
        <div>
          <h2 className="text-xl font-bold mb-4">Detailed Review</h2>
          <div className="space-y-4">
            {result.questionResults.map(qr => {
              const passageId = questionPassageMap[qr.questionId];
              const passage = passageMap[passageId];

              return (
                <div
                  key={qr.questionId}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                    qr.isCorrect ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: qr.isCorrect ? '#22c55e' : '#ef4444' }}
                    >
                      {qr.questionNumber}
                    </span>
                    <span className={`text-sm font-semibold ${qr.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {qr.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Your answer: </span>
                      <span className="font-medium">
                        {qr.userAnswer === null
                          ? '—'
                          : Array.isArray(qr.userAnswer)
                            ? qr.userAnswer.join(', ')
                            : qr.userAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Correct answer: </span>
                      <span className="font-medium text-green-700">
                        {Array.isArray(qr.correctAnswer)
                          ? qr.correctAnswer.join(', ')
                          : qr.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Passage highlight */}
                  {qr.passageHighlight && passage && (
                    <div className="bg-yellow-50 rounded p-3 mb-3 max-h-40 overflow-y-auto text-sm">
                      <PassageViewer
                        title=""
                        content={passage.content}
                        highlight={qr.passageHighlight}
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-sm text-gray-600 italic">{qr.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Block */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center" style={{ borderTop: `4px solid ${cta.buttonColor || config.branding.accentColor || '#dc2626'}` }}>
          <h2 className="text-2xl font-bold mb-2">{cta.heading}</h2>
          {cta.description && <p className="text-gray-600 mb-4">{cta.description}</p>}
          <a
            href={cta.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-white font-semibold rounded-lg text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: cta.buttonColor || config.branding.accentColor || '#dc2626' }}
          >
            {cta.buttonText}
          </a>
        </div>

        {/* Retake */}
        <div className="text-center pb-8">
          <Button variant="ghost" size="lg" onClick={onRetake}>
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
}
