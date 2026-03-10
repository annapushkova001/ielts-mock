import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import React from 'react';
import type { TextSize, ContrastMode, AccessibilityState } from '../types';

const A11Y_KEY = 'ielts-accessibility';

interface StoredA11y {
  textSize: TextSize;
  contrastMode: ContrastMode;
}

function loadA11y(): StoredA11y {
  try {
    const data = localStorage.getItem(A11Y_KEY);
    if (data) return JSON.parse(data) as StoredA11y;
  } catch {
    // ignore
  }
  return { textSize: 'md', contrastMode: 'normal' };
}

function saveA11y(state: StoredA11y): void {
  try {
    localStorage.setItem(A11Y_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const AccessibilityContext = createContext<AccessibilityState>({
  textSize: 'md',
  contrastMode: 'normal',
  setTextSize: () => {},
  setContrastMode: () => {},
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredA11y>(loadA11y);

  useEffect(() => {
    saveA11y(state);
    const root = document.documentElement;

    // Text size
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    root.classList.add(`text-size-${state.textSize}`);

    // Contrast
    if (state.contrastMode === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [state]);

  const setTextSize = useCallback((size: TextSize) => {
    setState(prev => ({ ...prev, textSize: size }));
  }, []);

  const setContrastMode = useCallback((mode: ContrastMode) => {
    setState(prev => ({ ...prev, contrastMode: mode }));
  }, []);

  const value: AccessibilityState = {
    ...state,
    setTextSize,
    setContrastMode,
  };

  return React.createElement(AccessibilityContext.Provider, { value }, children);
}

export function useAccessibility(): AccessibilityState {
  return useContext(AccessibilityContext);
}
