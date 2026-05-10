import { useState, useEffect } from 'react';
import { ScanLine } from 'lucide-react';

export default function SuspenseScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);
    const timer = setTimeout(onComplete, 2000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 suspense-overlay pointer-events-none" />

      {/* Scanning line */}
      <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/60 animate-scan shadow-[0_0_20px_rgba(0,240,255,0.5)]" />

      <div className="relative text-center">
        <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 flex items-center justify-center mb-6 mx-auto relative">
          <ScanLine className="w-10 h-10 text-cyan-400 animate-pulse" />
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400" style={{ animation: 'spin 1s linear infinite' }} />
        </div>

        <p className="text-cyan-400 text-sm font-bold uppercase tracking-[0.3em] mb-3">Decrypting</p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-white/[0.06] rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-zinc-600 text-xs mt-3 font-mono">{progress}%</p>
      </div>
    </div>
  );
}
