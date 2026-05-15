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
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden bg-[#f9f6f0]">
      {/* Remove scanline overlay for papercraft feel */}
      <div className="relative text-center paper-card-strong p-10 torn-top">
        <div className="w-24 h-24 rounded-full border-4 border-[#e6e2d6] flex items-center justify-center mb-8 mx-auto relative">
          <ScanLine className="w-10 h-10 text-[#718d53] animate-pulse" />
          {/* Rotating ring */}
          <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[#718d53]" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>

        <p className="text-[#6a675d] text-sm font-black uppercase tracking-[0.3em] mb-4">Processing</p>

        {/* Progress bar */}
        <div className="w-48 h-2 bg-[#e6e2d6] rounded-full overflow-hidden mx-auto shadow-inner">
          <div
            className="h-full bg-[#718d53] rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[#a9a69b] text-xs mt-4 font-black">{progress}%</p>
      </div>
    </div>
  );
}
