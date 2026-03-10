import Timer from '../ui/Timer';
import type { BrandingConfig } from '../../types';

interface HeaderProps {
  branding: BrandingConfig;
  remainingSeconds: number;
  onMenuToggle: () => void;
}

export default function Header({ branding, remainingSeconds, onMenuToggle }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 h-14"
      style={{ backgroundColor: branding.primaryColor }}
    >
      <div className="flex items-center gap-3">
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt={branding.title} className="h-8 object-contain" />
        ) : (
          <span className="text-white font-bold text-lg">{branding.title}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Timer remainingSeconds={remainingSeconds} />
        <button
          onClick={onMenuToggle}
          className="text-white text-2xl leading-none p-1 hover:bg-white/10 rounded cursor-pointer"
          aria-label="Options menu"
        >
          ≡
        </button>
      </div>
    </header>
  );
}
