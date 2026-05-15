import { CATEGORY_META } from '../data/characters';
import { Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategoryScreen({ onSelect, onOpenSettings, currentRound, totalRounds }) {
  const { t, lang } = useLanguage();
  const categories = Object.keys(CATEGORY_META);

  const catNameAr = {
    "Jujutsu Kaisen": "Jujutsu Kaisen / جوجوتسو كايسن",
    "Demon Slayer": "Demon Slayer / ديمون سلاير",
    "Brawl Stars": "Brawl Stars / براول ستارز"
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 relative">
      {/* Decorative background doodles could go here */}
      <div className="text-center mb-8">
        <p className="text-[#718d53] text-sm font-black uppercase tracking-widest mb-2">
          {t("round")} {currentRound} {t("of")} {totalRounds}
        </p>
        <h1 className="text-3xl font-black text-[#2b2a26]">{t("chooseCategory")}</h1>
        <p className="text-[#6a675d] text-sm mt-2 font-semibold">{t("selectTheme")}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {categories.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          return (
            <div
              key={cat}
              className="animate-slideUp relative flex items-center group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <button
                onClick={() => onSelect(cat)}
                className="flex-1 paper-card-strong p-6 text-left active:scale-[0.98] transition-all hover:bg-[#faf9f6]"
                style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
              >
                <div className="flex items-center gap-5">
                  <div className="text-5xl">{meta.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-[#2b2a26]" dir={lang === 'ar' ? 'ltr' : 'ltr'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'ar' ? (catNameAr[cat] || cat) : cat}
                    </h2>
                    <p className="text-[#6a675d] text-sm font-semibold">{meta.subtitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#f9f6f0] flex items-center justify-center border border-[#e6e2d6]">
                    <span className={`text-[#2b2a26] text-xl font-bold ${lang === 'ar' ? 'rotate-180' : ''}`}>›</span>
                  </div>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings(cat);
                }}
                className="ms-3 p-5 rounded-2xl paper-card-strong active:scale-95 transition-all flex items-center justify-center text-[#6a675d] hover:text-[#2b2a26] hover:bg-[#faf9f6]"
              >
                <Settings className="w-7 h-7" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
