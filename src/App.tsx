import { useState, useEffect } from 'react';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { validateTestConfig, asTestConfig } from './utils/configValidator';
import { useTestSession } from './hooks/useTestSession';
import type { TestConfig, Screen } from './types';
import testDataRaw from './data/test-data.json';
import WelcomeScreen from './components/screens/WelcomeScreen';
import TestScreen from './components/screens/TestScreen';
import ReviewScreen from './components/screens/ReviewScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import { useScoring } from './hooks/useScoring';

function AppContent({ config }: { config: TestConfig }) {
  // Wire dynamic accent color from config
  useEffect(() => {
    const accent = config.branding.accentColor || '#dc2626';
    document.documentElement.style.setProperty('--accent-color', accent);
  }, [config.branding.accentColor]);

  const [screen, setScreen] = useState<Screen>('welcome');
  const {
    session,
    startTest,
    startNewTest,
    submitTest,
    setAnswer,
    toggleFlag,
    setCurrentQuestion,
  } = useTestSession(config);

  const hasExistingSession = session.status === 'in-progress';
  const result = useScoring(config, session);

  const handleStart = () => {
    startTest();
    setScreen('test');
  };

  const handleResume = () => {
    setScreen('test');
  };

  const handleStartNew = () => {
    startNewTest();
  };

  const handleSubmit = () => {
    submitTest();
    setScreen('results');
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setScreen('test');
  };

  const handleRetake = () => {
    startNewTest();
    setScreen('welcome');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {screen === 'welcome' && (
        <WelcomeScreen
          config={config}
          hasExistingSession={hasExistingSession}
          onStart={handleStart}
          onResume={handleResume}
          onStartNew={handleStartNew}
        />
      )}
      {screen === 'test' && (
        <TestScreen
          config={config}
          session={session}
          onAnswer={setAnswer}
          onToggleFlag={toggleFlag}
          onSubmit={handleSubmit}
          onNavigateToReview={() => setScreen('review')}
          currentQuestionIndex={session.currentQuestionIndex}
          onSetCurrentQuestion={setCurrentQuestion}
        />
      )}
      {screen === 'review' && (
        <ReviewScreen
          config={config}
          session={session}
          onGoToQuestion={handleGoToQuestion}
          onSubmit={handleSubmit}
          onBackToTest={() => setScreen('test')}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          config={config}
          result={result}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = validateTestConfig(testDataRaw);
    if (!result.valid) {
      setError(`Invalid test config:\n${result.errors.join('\n')}`);
      return;
    }
    setConfig(asTestConfig(testDataRaw));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h1 className="text-xl font-bold text-red-800 mb-2">Configuration Error</h1>
          <pre className="text-red-600 text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <AccessibilityProvider>
      <AppContent config={config} />
    </AccessibilityProvider>
  );
}
