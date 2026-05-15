import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/characters';
import { getEnabledCharacters, saveEnabledCharacters } from '../utils/gameLogic';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
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
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] absolute inset-0 z-10 relative">
      
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <button 
          onClick={onBack}
          className="paper-card w-10 h-10 rounded-xl flex items-center justify-center text-[#2d3748] active:scale-95 transition-all shadow-sm"
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 top-2">
          <div className="bg-[#83a373] text-white px-6 py-2 rounded-xl text-lg font-bold shadow-md torn-top relative whitespace-nowrap">
            <span className="relative z-10">{lang === 'ar' ? 'إعدادات الشخصيات' : 'Character Settings'}</span>
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
          </div>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 z-10 flex flex-col">
        <p className="text-[#83a373] text-center text-sm font-black uppercase tracking-widest mb-6">
          {lang === 'ar' ? (catNameAr[category] || category) : category}
        </p>

        {error && (
          <div className="mb-4 p-4 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] bg-[#fbeae7] border border-[#d97768]/30 text-[#d97768] text-sm font-bold text-center animate-shake shadow-sm">
            {error}
          </div>
        )}

        <div className="text-[#718096] text-sm font-bold mb-3 flex justify-between px-1">
          <span>{t("enabled")}: {enabledChars.length}/{allChars.length}</span>
          <span>{t("min")}: 7</span>
        </div>

        {/* List */}
        <div className="flex-1 space-y-3 mb-6">
          {allChars.map((char) => {
            const isEnabled = enabledChars.includes(char.name);
            return (
              <div
                key={char.name}
                className="w-full flex items-center justify-between p-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] paper-card shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {char.icon && <span className="text-2xl">{char.icon}</span>}
                  <span className="text-base font-bold text-[#2d3748]">
                    {char.name}
                  </span>
                </div>
                
                {/* Paper Toggle Switch */}
                <button 
                  onClick={() => handleToggle(char.name)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shadow-inner ${isEnabled ? 'bg-[#83a373]' : 'bg-[#e2dfd3]'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 border border-[#e2dfd3] ${isEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-5">
          <button onClick={handleSelectAll} className="flex-1 py-3 bg-white border border-[#e2dfd3] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] text-sm text-[#2d3748] font-bold active:scale-95 transition-transform shadow-sm">
            {lang === 'ar' ? 'تحديد الكل' : 'Select All'}
          </button>
          <button onClick={handleDeselectAll} className="flex-1 py-3 bg-white border border-[#e2dfd3] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-sm text-[#718096] font-bold active:scale-95 transition-transform shadow-sm">
            {lang === 'ar' ? 'إلغاء تحديد الكل' : 'Deselect All'}
          </button>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="btn-primary py-4 text-base mt-auto">
          {lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
