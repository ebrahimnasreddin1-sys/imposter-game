import { CATEGORY_META } from '../data/characters';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategoryScreen({ onSelect, onOpenSettings, onBack, currentRound, totalRounds }) {
  const { t, lang } = useLanguage();
  const categories = Object.keys(CATEGORY_META);

  const catNameAr = {
    "Jujutsu Kaisen": "Jujutsu Kaisen / جوجوتسو كايسن",
    "Demon Slayer": "Demon Slayer / ديمون سلاير",
    "Brawl Stars": "Brawl Stars / براول ستارز"
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full relative bg-[var(--color-paper-bg)]">
      
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <button 
          onClick={onBack}
          className={`paper-card w-10 h-10 rounded-xl flex items-center justify-center text-[#2d3748] active:scale-95 transition-all shadow-sm ${!onBack ? 'opacity-0 pointer-events-none' : ''}`}
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 top-2">
          <div className="bg-[#83a373] text-white px-6 py-2 rounded-xl text-lg font-bold shadow-md torn-top relative">
            <span className="relative z-10">{lang === 'ar' ? 'اختر الفئة' : 'Select Category'}</span>
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
          </div>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 z-10">
        <div className="text-center mb-6">
          <p className="text-[#83a373] text-sm font-black uppercase tracking-widest mb-1">
            {t("round")} {currentRound} {t("of")} {totalRounds}
          </p>
          <p className="text-[#718096] text-sm font-semibold">
            {lang === 'ar' ? 'اختر الفئة التي تريد اللعب بها' : 'Choose a category to play'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            return (
              <div
                key={cat}
                className="animate-slideUp relative flex items-stretch group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <button
                  onClick={() => onSelect(cat)}
                  className="flex-1 paper-card p-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-left active:scale-[0.98] transition-all hover:bg-[#faf9f6] flex items-center gap-4"
                  style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                >
                  <div className="text-4xl shrink-0">{meta.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#2d3748]" dir={lang === 'ar' ? 'ltr' : 'ltr'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'ar' ? (catNameAr[cat] || cat) : cat}
                    </h2>
                    <p className="text-[#718096] text-xs font-semibold">{meta.subtitle}</p>
                  </div>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSettings(cat);
                  }}
                  className="ms-2 w-[60px] paper-card rounded-[15px_225px_15px_255px/255px_15px_225px_15px] active:scale-95 transition-all flex items-center justify-center text-[#718096] hover:text-[#2d3748] hover:bg-[#faf9f6]"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
