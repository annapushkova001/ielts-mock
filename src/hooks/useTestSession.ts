import { useState, useCallback, useEffect } from 'react';
import { saveSession, loadSession, clearSession } from '../utils/session';
import type { Session, TestConfig } from '../types';

function createNewSession(config: TestConfig): Session {
  return {
    testId: config.title,
    status: 'not-started',
    startedAt: null,
    remainingSeconds: config.duration,
    currentQuestionIndex: 0,
    answers: {},
    reviewFlags: [],
  };
}

export function useTestSession(config: TestConfig) {
  const [session, setSession] = useState<Session>(() => {
    const existing = loadSession();
    if (existing && existing.status === 'in-progress' && existing.testId === config.title) {
      return existing;
    }
    return createNewSession(config);
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    if (session.status !== 'not-started') {
      saveSession(session);
    }
  }, [session]);

  const startTest = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'in-progress',
      startedAt: Date.now(),
    }));
  }, []);

  const resumeTest = useCallback(() => {
    // Session is already loaded from localStorage
    // Just ensure it stays in-progress
  }, []);

  const startNewTest = useCallback(() => {
    clearSession();
    const newSession = createNewSession(config);
    setSession(newSession);
  }, [config]);

  const submitTest = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'completed',
    }));
  }, []);

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setSession(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setSession(prev => {
      const flags = prev.reviewFlags.includes(questionId)
        ? prev.reviewFlags.filter(id => id !== questionId)
        : [...prev.reviewFlags, questionId];
      return { ...prev, reviewFlags: flags };
    });
  }, []);

  const setCurrentQuestion = useCallback((index: number) => {
    setSession(prev => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  }, []);

  return {
    session,
    startTest,
    resumeTest,
    startNewTest,
    submitTest,
    setAnswer,
    toggleFlag,
    setCurrentQuestion,
  };
}
