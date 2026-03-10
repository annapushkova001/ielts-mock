import { useMemo } from 'react';
import PassageViewer from '../ui/PassageViewer';
import type { TestConfig, Result, CTAConfig } from '../../types';

interface ResultsScreenProps {
  config: TestConfig;
  result: Result;
  onRetake: () => void;
}

const BAND_LABELS: Record<number, string> = {
  9: 'Expert User',
  8: 'Very Good User',
  7: 'Good User',
  6: 'Competent User',
  5: 'Modest User',
  4: 'Limited User',
  3: 'Extremely Limited User',
  2: 'Intermittent User',
  1: 'Non-User',
  0: 'Did not attempt',
};

function getBandLabel(score: number): string {
  const rounded = Math.round(score);
  return BAND_LABELS[rounded] || BAND_LABELS[Math.floor(score)] || '';
}

function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / 9, 1);
  const offset = circumference * (1 - percentage);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        />
      </svg>
      <div className="absolute text-center text-white">
        <div
          className="font-extrabold leading-none"
          style={{ fontSize: size * 0.3, fontVariantNumeric: 'tabular-nums' }}
        >
          {score.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

function PassageRing({ correct, total, size = 76 }: { correct: number; total: number; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? correct / total : 0;
  const offset = circumference * (1 - percentage);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EDF2FE"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2C54F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-base font-bold" style={{ color: '#2C54F6' }}>{correct}</span>
        <span className="text-[11px] text-gray-400">/{total}</span>
      </div>
    </div>
  );
}

function CTABlock({ cta }: { cta: CTAConfig }) {
  const accentColor = cta.buttonColor || '#2C54F6';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustBrightness(accentColor, -20)} 100%)`,
        borderRadius: '24px',
      }}
    >
      <div
        className="absolute -right-10 -top-10 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{cta.heading}</h2>
        {cta.description && (
          <p className="text-white/75 mb-6 max-w-lg mx-auto leading-relaxed">{cta.description}</p>
        )}
        <a
          href={cta.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3.5 bg-white font-semibold text-lg transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ color: accentColor, borderRadius: '14px' }}
        >
          {cta.buttonText}
        </a>
      </div>
    </div>
  );
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default function ResultsScreen({ config, result, onRetake }: ResultsScreenProps) {
  const passageMap = useMemo(() => {
    const map: Record<string, { title: string; content: string }> = {};
    config.passages.forEach(p => {
      map[p.id] = { title: p.title, content: p.content };
    });
    return map;
  }, [config.passages]);

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
  const accentColor = cta.buttonColor || config.branding.accentColor || '#2C54F6';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F8FC' }}>
      {/* Hero Band Score */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${adjustBrightness(accentColor, 15)} 0%, ${accentColor} 40%, ${adjustBrightness(accentColor, -30)} 100%)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
          />
          <div
            className="absolute -left-16 bottom-0 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center py-14 md:py-20 px-4">
          <p className="text-sm text-white/50 uppercase tracking-[0.2em] mb-8 font-medium">
            Your Band Score
          </p>
          <ScoreRing score={result.bandScore} />
          <p className="text-xl text-white/90 mt-5 font-semibold tracking-wide">
            {getBandLabel(result.bandScore)}
          </p>
          <p className="text-white/45 mt-2 text-sm">
            {result.totalCorrect} out of {result.totalQuestions} correct
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Passage Breakdown Cards — overlapping hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-8 mb-10">
          {result.passageBreakdown.map((pb, i) => (
            <div
              key={pb.passageId}
              className="bg-white p-6 text-center transition-shadow hover:shadow-xl animate-[fadeInUp_0.5s_ease-out_both]"
              style={{
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(44, 84, 246, 0.08)',
                animationDelay: `${i * 120}ms`,
              }}
            >
              <PassageRing correct={pb.correct} total={pb.total} />
              <p className="text-sm text-gray-600 mt-3 leading-snug font-medium line-clamp-2">
                {pb.passageTitle}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((pb.correct / pb.total) * 100)}% correct
              </p>
            </div>
          ))}
        </div>

        {/* CTA Block 1 */}
        <div className="mb-10">
          <CTABlock cta={cta} />
        </div>

        {/* Detailed Review */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Detailed Review</h2>
          <div className="space-y-3">
            {result.questionResults.map(qr => {
              const passageId = questionPassageMap[qr.questionId];
              const passage = passageMap[passageId];

              return (
                <div
                  key={qr.questionId}
                  className="bg-white overflow-hidden"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-start gap-4 p-5">
                    {/* Question number badge */}
                    <div
                      className="shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        borderRadius: '12px',
                        backgroundColor: qr.isCorrect ? '#93C685' : '#EF4444',
                      }}
                    >
                      {qr.questionNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Status badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1"
                          style={{
                            borderRadius: '8px',
                            backgroundColor: qr.isCorrect ? '#F0F7ED' : '#FEF2F2',
                            color: qr.isCorrect ? '#5A8A4C' : '#DC2626',
                          }}
                        >
                          {qr.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Answers grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-400 text-xs block mb-0.5">Your answer</span>
                          <p className="font-medium text-gray-800">
                            {qr.userAnswer === null
                              ? '— (no answer)'
                              : Array.isArray(qr.userAnswer)
                                ? qr.userAnswer.join(', ')
                                : qr.userAnswer}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block mb-0.5">Correct answer</span>
                          <p className="font-medium" style={{ color: '#5A8A4C' }}>
                            {Array.isArray(qr.correctAnswer)
                              ? qr.correctAnswer.join(', ')
                              : qr.correctAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Passage highlight */}
                      {qr.passageHighlight && passage && (
                        <div
                          className="mb-3 max-h-32 overflow-y-auto text-sm"
                          style={{
                            backgroundColor: '#FFFBEB',
                            borderRadius: '12px',
                            padding: '12px',
                          }}
                        >
                          <PassageViewer
                            title=""
                            content={passage.content}
                            highlight={qr.passageHighlight}
                          />
                        </div>
                      )}

                      {/* Explanation */}
                      <p className="text-sm text-gray-500 leading-relaxed">{qr.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Block 2 */}
        <div className="mb-10">
          <CTABlock cta={cta} />
        </div>

        {/* Retake */}
        <div className="text-center pb-12">
          <button
            onClick={onRetake}
            className="px-8 py-3 text-gray-500 font-medium hover:text-gray-800 hover:bg-white/80 transition-all cursor-pointer"
            style={{ borderRadius: '12px' }}
          >
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
}
