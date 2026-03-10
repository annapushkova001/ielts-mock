import Button from '../ui/Button';
import type { TestConfig } from '../../types';

interface WelcomeScreenProps {
  config: TestConfig;
  hasExistingSession: boolean;
  onStart: () => void;
  onResume: () => void;
  onStartNew: () => void;
}

export default function WelcomeScreen({
  config,
  hasExistingSession,
  onStart,
  onResume,
  onStartNew,
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-3xl font-bold">{config.title}</h1>

        <div className="text-left bg-gray-50 rounded-lg p-6 space-y-4 text-sm">
          <h2 className="font-bold text-lg">IELTS Academic Reading — Instructions</h2>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>The test contains 3 passages with a total of 40 questions.</li>
            <li>You have <strong>60 minutes</strong> to complete the test.</li>
            <li>Answer all questions — there is no penalty for wrong answers.</li>
            <li>You can navigate between passages and questions freely.</li>
            <li>Use the flag button to mark questions for review.</li>
            <li>Your progress is saved automatically.</li>
            <li>The test will auto-submit when the timer runs out.</li>
          </ul>
        </div>

        {hasExistingSession ? (
          <div className="space-y-3">
            <p className="text-gray-600">You have an unfinished test session.</p>
            <div className="flex justify-center gap-4">
              <Button variant="primary" size="lg" onClick={onResume}>
                Resume Test
              </Button>
              <Button variant="secondary" size="lg" onClick={onStartNew}>
                Start New Test
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="primary" size="lg" onClick={onStart}>
            Start Test
          </Button>
        )}
      </div>
    </div>
  );
}
