import { useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import CharacterImage from '../components/CharacterImage';

export default function RevealScreen({ playerName, isImposter, secretChar, category, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (isImposter) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
        <div className="glass-card-strong neon-red p-8 w-full max-w-sm text-center animate-heartbeat relative overflow-hidden">
          {/* Red ambient glow */}
          <div className="absolute inset-0 bg-red-500/[0.04] pointer-events-none" />
          <div className="relative">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{playerName}</p>
            <h1 className="text-4xl font-black text-red-500 animate-glitch tracking-wider" style={{ '--glow-color': '#ff003c' }}>
              IMPOSTER
            </h1>
            <p className="text-red-400/60 text-sm mt-3">You don't know the word. Blend in!</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full max-w-sm mt-6 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full animate-shrinkX" />
        </div>
        <p className="text-zinc-600 text-xs mt-2">Auto-hiding in 3 seconds</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
      <div className="glass-card-strong neon-cyan p-8 w-full max-w-sm text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/[0.03] pointer-events-none" />
        <div className="relative flex flex-col items-center">
          <Shield className="w-8 h-8 text-cyan-400 mb-3" />
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">{playerName}</p>

          {/* Character Image */}
          <CharacterImage
            name={secretChar.name}
            image={secretChar.image}
            size="lg"
            glowColor="cyan"
            className="mb-4"
          />

          <p className="text-cyan-400/60 text-xs uppercase tracking-wider mb-1">{category}</p>
          <h1 className="text-4xl font-black text-cyan-400 animate-textGlow tracking-wider" style={{ '--glow-color': '#00f0ff' }}>
            {secretChar.name.toUpperCase()}
          </h1>
          <p className="text-cyan-400/40 text-sm mt-2">{secretChar.fullName}</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full max-w-sm mt-6 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full animate-shrinkX" />
      </div>
      <p className="text-zinc-600 text-xs mt-2">Auto-hiding in 3 seconds</p>
    </div>
  );
}
