import { useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RevealScreen({ playerName, isImposter, secretChar, category, onDone }) {
  const { t, lang } = useLanguage();
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (isImposter) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
        <div className="paper-card-strong p-10 w-full max-w-sm text-center relative overflow-hidden bg-[#f7e6e3] border-2 border-[#c95c4e] shadow-md torn-top">
          <div className="relative">
            <AlertTriangle className="w-14 h-14 text-[#c95c4e] mx-auto mb-5 animate-paperFloat" />
            <p className="text-[#a84d41] text-sm font-black uppercase tracking-widest mb-2">{playerName}</p>
            <h1 className="text-4xl font-black text-[#a84d41] tracking-wider mb-2">
              {t("imposterTitle").toUpperCase()}
            </h1>
            <p className="text-[#c95c4e] text-sm mt-3 font-bold">{t("imposterInstructions")}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full max-w-sm mt-8 h-2 bg-[#e6e2d6] rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-[#c95c4e] rounded-full animate-shrinkX" />
        </div>
        <p className="text-[#6a675d] text-xs mt-3 font-bold">{t("autoHiding")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
      <div className="paper-card-strong p-10 w-full max-w-sm text-center relative overflow-hidden bg-[#e5ecd6] border-2 border-[#718d53] shadow-md torn-top">
        <div className="relative flex flex-col items-center">
          <Shield className="w-10 h-10 text-[#718d53] mb-4 animate-paperFloat" />
          <p className="text-[#5d7543] text-sm font-black uppercase tracking-widest mb-4">{playerName}</p>

          <p className="text-[#718d53] text-xs font-bold uppercase tracking-widest mb-2">
            {lang === 'ar' && category === 'Jujutsu Kaisen' ? 'Jujutsu Kaisen / جوجوتسو كايسن' : 
             lang === 'ar' && category === 'Demon Slayer' ? 'Demon Slayer / ديمون سلاير' :
             lang === 'ar' && category === 'Brawl Stars' ? 'Brawl Stars / براول ستارز' : category}
          </p>
          <div className="bg-[#ffffff] border-2 border-[#718d53] px-6 py-5 rounded-2xl mb-2 shadow-sm w-full">
            <h1 className="text-3xl font-black text-[#5d7543] tracking-wider text-center">
              {secretChar.name}
            </h1>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8 h-2 bg-[#e6e2d6] rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-[#718d53] rounded-full animate-shrinkX" />
      </div>
      <p className="text-[#6a675d] text-xs mt-3 font-bold">{t("autoHiding")}</p>
    </div>
  );
}
