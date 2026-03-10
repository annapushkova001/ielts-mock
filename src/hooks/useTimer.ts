import { useState, useEffect, useRef, useCallback } from 'react';
import { saveSession, loadSession } from '../utils/session';

interface UseTimerProps {
  duration: number;
  startedAt: number | null;
  onTimeUp: () => void;
}

export function useTimer({ duration, startedAt, onTimeUp }: UseTimerProps) {
  const computeRemaining = useCallback(() => {
    if (!startedAt) return duration;
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    return Math.max(0, duration - elapsed);
  }, [duration, startedAt]);

  const [remainingSeconds, setRemainingSeconds] = useState(computeRemaining);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!startedAt) return;

    const interval = setInterval(() => {
      const remaining = computeRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);

    // Sync to localStorage every 10 seconds
    const syncInterval = setInterval(() => {
      const session = loadSession();
      if (session) {
        session.remainingSeconds = computeRemaining();
        saveSession(session);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
    };
  }, [startedAt, computeRemaining]);

  return { remainingSeconds };
}
