import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import type { TextSize } from '../../types';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReview: () => void;
}

export default function OptionsMenu({ isOpen, onClose, onGoToReview }: OptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { textSize, contrastMode, setTextSize, setContrastMode } = useAccessibility();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const textSizes: { label: string; value: TextSize }[] = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed top-14 right-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-64 p-4 space-y-4"
    >
      <button
        onClick={() => { onGoToReview(); onClose(); }}
        className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 cursor-pointer"
      >
        Go to submission page
      </button>

      <div>
        <p className="text-sm font-medium mb-2">Contrast</p>
        <button
          onClick={() => setContrastMode(contrastMode === 'normal' ? 'high' : 'normal')}
          className={`w-full py-1.5 rounded text-sm border cursor-pointer ${
            contrastMode === 'high'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {contrastMode === 'high' ? 'High Contrast: ON' : 'High Contrast: OFF'}
        </button>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Text Size</p>
        <div className="flex gap-1">
          {textSizes.map(ts => (
            <button
              key={ts.value}
              onClick={() => setTextSize(ts.value)}
              className={`flex-1 py-1.5 rounded text-sm border cursor-pointer ${
                textSize === ts.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {ts.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
