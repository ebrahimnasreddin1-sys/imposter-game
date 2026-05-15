import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/characters';
import { getEnabledCharacters, saveEnabledCharacters } from '../utils/gameLogic';
import { ArrowLeft, Check, CheckSquare, Square, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategorySettingsScreen({ category, onBack }) {
  const { t, lang } = useLanguage();
  const [enabledChars, setEnabledChars] = useState([]);
  const [error, setError] = useState('');

  const allChars = CATEGORIES[category] || [];

  const catNameAr = {
    "Jujutsu Kaisen": "Jujutsu Kaisen / جوجوتسو كايسن",
    "Demon Slayer": "Demon Slayer / ديمون سلاير",
    "Brawl Stars": "Brawl Stars / براول ستارز"
  };

  useEffect(() => {
    setEnabledChars(getEnabledCharacters(category));
  }, [category]);

  const handleToggle = (charName) => {
    setEnabledChars(prev => {
      if (prev.includes(charName)) {
        return prev.filter(name => name !== charName);
      } else {
        return [...prev, charName];
      }
    });
  };

  const handleSelectAll = () => {
    setEnabledChars(allChars.map(c => c.name));
    setError('');
  };

  const handleDeselectAll = () => {
    setEnabledChars([]);
  };

  const handleSave = () => {
    if (enabledChars.length < 7) {
      setError(t("minCharactersError"));
      return;
    }
    saveEnabledCharacters(category, enabledChars);
    onBack();
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 bg-[#f9f6f0] absolute inset-0 z-10 relative">
      {/* Decorative background doodles could go here */}
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-3 text-[#2b2a26] hover:bg-[#e6e2d6] rounded-xl transition-all">
          <ArrowLeft className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex-1 text-center pe-12">
          <p className="text-[#718d53] text-xs font-black uppercase tracking-widest">{lang === 'ar' ? (catNameAr[category] || category) : category}</p>
          <h1 className="text-2xl font-black text-[#2b2a26]">{t("characterSettings")}</h1>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-[#c95c4e]/10 border border-[#c95c4e]/20 text-[#c95c4e] text-sm font-bold text-center animate-shake">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 mb-5">
        <button onClick={handleSelectAll} className="flex-1 py-3 bg-white border border-[#e6e2d6] rounded-xl text-sm text-[#2b2a26] font-bold active:bg-[#faf9f6] shadow-sm">
          {t("selectAll")}
        </button>
        <button onClick={handleDeselectAll} className="flex-1 py-3 bg-white border border-[#e6e2d6] rounded-xl text-sm text-[#6a675d] font-bold active:bg-[#faf9f6] shadow-sm">
          {t("deselectAll")}
        </button>
      </div>

      <div className="text-[#6a675d] text-sm font-bold mb-3 flex justify-between px-1">
        <span>{t("enabled")}: {enabledChars.length}/{allChars.length}</span>
        <span>{t("min")}: 7</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
        {allChars.map((char) => {
          const isEnabled = enabledChars.includes(char.name);
          return (
            <button
              key={char.name}
              onClick={() => handleToggle(char.name)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all shadow-sm ${
                isEnabled ? 'bg-[#718d53]/10 border-2 border-[#718d53]' : 'bg-white border-2 border-[#e6e2d6] hover:bg-[#faf9f6]'
              }`}
            >
              <span className={`text-base font-black ${isEnabled ? 'text-[#5d7543]' : 'text-[#6a675d]'}`}>
                {char.name}
              </span>
              {isEnabled ? (
                <CheckSquare className="w-6 h-6 text-[#718d53]" />
              ) : (
                <Square className="w-6 h-6 text-[#d2cdbc]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="btn-primary py-4 text-base">
        <Save className="w-5 h-5" /> {t("saveSettings")}
      </button>
    </div>
  );
}
