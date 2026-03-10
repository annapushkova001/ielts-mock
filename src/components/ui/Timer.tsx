interface TimerProps {
  remainingSeconds: number;
}

export default function Timer({ remainingSeconds }: TimerProps) {
  const minutes = Math.max(0, Math.floor(remainingSeconds / 60));
  const seconds = Math.max(0, Math.floor(remainingSeconds % 60));
  const isWarning = remainingSeconds < 300; // < 5 minutes

  return (
    <span
      className={`font-mono text-lg font-bold ${
        isWarning ? 'text-red-500 animate-pulse' : 'text-white'
      }`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}
