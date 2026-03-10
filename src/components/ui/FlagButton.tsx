interface FlagButtonProps {
  isFlagged: boolean;
  onToggle: () => void;
}

export default function FlagButton({ isFlagged, onToggle }: FlagButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-1.5 rounded transition-colors cursor-pointer ${
        isFlagged
          ? 'text-orange-500 bg-orange-50 hover:bg-orange-100'
          : 'text-gray-400 hover:text-orange-400 hover:bg-gray-100'
      }`}
      aria-label={isFlagged ? 'Remove flag' : 'Flag for review'}
      title={isFlagged ? 'Remove flag' : 'Flag for review'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    </button>
  );
}
