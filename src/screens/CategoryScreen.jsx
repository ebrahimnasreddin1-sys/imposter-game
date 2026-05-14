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
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6">
      <div className="text-center mb-6">
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
          {t("round")} {currentRound} {t("of")} {totalRounds}
        </p>
        <h1 className="text-2xl font-bold text-white">{t("chooseCategory")}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t("selectTheme")}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
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
                className="flex-1 glass-card-strong p-5 text-left active:scale-[0.98] transition-transform relative overflow-hidden"
                style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.gradient} opacity-[0.07] group-active:opacity-[0.15] transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div className="text-4xl">{meta.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white" dir={lang === 'ar' ? 'ltr' : 'ltr'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'ar' ? (catNameAr[cat] || cat) : cat}
                    </h2>
                    <p className="text-zinc-500 text-sm">{meta.subtitle}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <span className={`text-zinc-400 text-lg ${lang === 'ar' ? 'rotate-180' : ''}`}>›</span>
                  </div>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings(cat);
                }}
                className="ms-2 p-4 rounded-2xl glass-card-strong active:scale-95 transition-transform flex items-center justify-center text-zinc-400 active:text-white"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
