import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FinalGuessScreen({ imposterName, options, secretChar, onGuess }) {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handlePick = (charObj) => {
    if (revealed) return;
    setSelected(charObj.name);
    setRevealed(true);
    setTimeout(() => onGuess(charObj.name === secretChar.name), 2000);
  };

  const getCardStyle = (charObj) => {
    if (!revealed) return 'bg-white border border-[#e2dfd3] hover:bg-[#faf9f6] active:scale-95 shadow-sm';
    if (charObj.name === selected && charObj.name === secretChar.name)
      return 'bg-[#e6edd8] border-2 border-[#83a373] shadow-md scale-105 z-10';
    if (charObj.name === selected && charObj.name !== secretChar.name)
      return 'bg-[#fbeae7] border-2 border-[#d97768] shadow-md scale-105 z-10';
    if (charObj.name === secretChar.name)
      return 'bg-[#e6edd8] border-2 border-[#83a373] shadow-md animate-pulse';
    return 'bg-white border border-[#e2dfd3] opacity-50 scale-95';
  };

  const getNameColor = (charObj) => {
    if (!revealed) return 'text-[#2d3748]';
    if (charObj.name === selected && charObj.name === secretChar.name) return 'text-[#6a8c59]';
    if (charObj.name === selected) return 'text-[#c45b4c]';
    if (charObj.name === secretChar.name) return 'text-[#6a8c59]';
    return 'text-[#a0aec0]';
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] relative">
      
      {/* Top Header Label */}
      <div className="pt-8 mb-6 relative z-10 flex justify-center">
        <div className="bg-[#d97768] text-white px-6 py-3 rounded-xl shadow-md torn-top relative flex justify-center items-center">
          <div className="paper-strip">
            <span className="font-black text-lg text-center leading-tight">
              {lang === 'ar' ? 'التخمين النهائي' : 'Final Guess'}
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#d97768] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
        <div className="text-center mb-8">
          <p className="text-[#d97768] text-lg font-black mb-1">
            {lang === 'ar' ? `أنت الإمبوستر يا ${imposterName}` : `You are the Imposter, ${imposterName}`}
          </p>
          <p className="text-[#718096] text-sm font-bold">
            {lang === 'ar' ? 'خمن الشخصية السرية للفوز' : 'Guess the secret character to win'}
          </p>
        </div>

        {revealed && (
          <div className="text-center mb-6 animate-scaleIn bg-white p-4 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] border border-[#e2dfd3] shadow-sm paper-card relative z-20">
            <p className={`text-xl font-black ${selected === secretChar.name ? 'text-[#83a373]' : 'text-[#d97768]'}`}>
              {selected === secretChar.name ? `🎯 ${t("imposterWin").toUpperCase()}` : `🛡️ ${t("crewWin").toUpperCase()}`}
            </p>
          </div>
        )}

        {/* Character Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {options.map((charObj, i) => (
            <button
              key={charObj.name}
              onClick={() => handlePick(charObj)}
              disabled={revealed}
              className={`p-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all flex flex-col items-center justify-center min-h-[100px] paper-card ${getCardStyle(charObj)}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {charObj.icon && (
                <span className={`text-3xl mb-2 ${!revealed ? 'opacity-80' : ''}`}>
                  {charObj.icon}
                </span>
              )}
              <span className={`text-sm font-bold text-center leading-tight ${getNameColor(charObj)}`}>
                {charObj.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
