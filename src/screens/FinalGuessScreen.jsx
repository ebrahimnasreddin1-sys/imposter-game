import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FinalGuessScreen({ imposterName, options, secretChar, onGuess }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handlePick = (charObj) => {
    if (revealed) return;
    setSelected(charObj.name);
    setRevealed(true);
    setTimeout(() => onGuess(charObj.name === secretChar.name), 2000);
  };

  const getCardStyle = (charObj) => {
    if (!revealed) return 'bg-white border-2 border-[#e6e2d6] hover:bg-[#faf9f6] active:scale-[0.98] shadow-sm';
    if (charObj.name === selected && charObj.name === secretChar.name)
      return 'bg-[#718d53]/10 border-2 border-[#718d53] shadow-sm';
    if (charObj.name === selected && charObj.name !== secretChar.name)
      return 'bg-[#c95c4e]/10 border-2 border-[#c95c4e] shadow-sm';
    if (charObj.name === secretChar.name)
      return 'bg-[#718d53]/10 border-2 border-[#718d53] shadow-sm';
    return 'bg-white border-2 border-[#e6e2d6] opacity-50';
  };

  const getNameColor = (charObj) => {
    if (!revealed) return 'text-[#2b2a26]';
    if (charObj.name === selected && charObj.name === secretChar.name) return 'text-[#5d7543]';
    if (charObj.name === selected) return 'text-[#a84d41]';
    if (charObj.name === secretChar.name) return 'text-[#5d7543]';
    return 'text-[#6a675d]';
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-5 pb-6 relative">
      {/* Decorative background doodles could go here */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c95c4e]/10 border border-[#c95c4e]/20 mb-3 animate-paperFloat">
          <Crosshair className="w-7 h-7 text-[#c95c4e]" />
        </div>
        <h1 className="text-2xl font-black text-[#2b2a26]">{t("imposterFinalGuess")}</h1>
        <p className="text-[#a84d41] text-sm font-bold mt-1">{imposterName}, {t("pickSecretCharacter")}</p>
      </div>

      {revealed && (
        <div className="text-center mb-5 animate-scaleIn bg-[#ffffff] p-4 rounded-xl border-2 border-[#e6e2d6] shadow-sm">
          <p className={`text-2xl font-black ${selected === secretChar.name ? 'text-[#718d53]' : 'text-[#c95c4e]'}`}>
            {selected === secretChar.name ? `🎯 ${t("imposterWin").toUpperCase()}` : `🛡️ ${t("crewWin").toUpperCase()}`}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-1 pb-2">
        <div className="grid gap-3">
          {options.map((charObj, i) => (
            <button
              key={charObj.name}
              onClick={() => handlePick(charObj)}
              disabled={revealed}
              className={`p-5 rounded-2xl transition-all flex items-center justify-center ${getCardStyle(charObj)}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={`text-lg font-black ${getNameColor(charObj)}`}>
                {charObj.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
