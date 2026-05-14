import { useState } from 'react';
import { Crosshair } from 'lucide-react';

export default function FinalGuessScreen({ imposterName, options, secretChar, onGuess }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handlePick = (charObj) => {
    if (revealed) return;
    setSelected(charObj.name);
    setRevealed(true);
    setTimeout(() => onGuess(charObj.name === secretChar.name), 2000);
  };

  const getCardStyle = (charObj) => {
    if (!revealed) return 'bg-white/[0.04] border-white/[0.08] active:scale-[0.97] hover:bg-white/[0.08]';
    if (charObj.name === selected && charObj.name === secretChar.name)
      return 'bg-green-500/20 border-green-500/50 neon-green';
    if (charObj.name === selected && charObj.name !== secretChar.name)
      return 'bg-red-500/20 border-red-500/50 neon-red';
    if (charObj.name === secretChar.name)
      return 'bg-green-500/20 border-green-500/50 neon-green';
    return 'bg-white/[0.02] border-white/[0.04] opacity-40';
  };

  const getNameColor = (charObj) => {
    if (!revealed) return 'text-white';
    if (charObj.name === selected && charObj.name === secretChar.name) return 'text-green-400';
    if (charObj.name === selected) return 'text-red-400';
    if (charObj.name === secretChar.name) return 'text-green-400';
    return 'text-zinc-500';
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-5 pb-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
          <Crosshair className="w-5 h-5 text-red-400" />
        </div>
        <h1 className="text-lg font-bold text-white">Imposter's Final Guess</h1>
        <p className="text-red-400 text-sm font-semibold mt-0.5">{imposterName}, pick the secret character!</p>
      </div>

      {revealed && (
        <div className="text-center mb-3 animate-scaleIn">
          <p className={`text-2xl font-black ${selected === secretChar.name ? 'text-green-400' : 'text-red-400'}`}>
            {selected === secretChar.name ? '🎯 IMPOSTER WINS!' : '🛡️ CREWMATES WIN!'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-2.5">
          {options.map((charObj, i) => (
            <button
              key={charObj.name}
              onClick={() => handlePick(charObj)}
              disabled={revealed}
              className={`p-4 rounded-xl border transition-all flex items-center justify-center ${getCardStyle(charObj)}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={`text-base font-bold ${getNameColor(charObj)}`}>
                {charObj.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
