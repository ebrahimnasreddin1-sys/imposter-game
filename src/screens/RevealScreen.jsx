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
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn bg-[var(--color-paper-bg)]">
        <div className="paper-card p-10 w-full max-w-sm text-center relative overflow-hidden bg-[#fbeae7] border border-[#d97768]/30 shadow-md torn-top rounded-[15px_225px_15px_255px/255px_15px_225px_15px]">
          <div className="relative">
            <AlertTriangle className="w-14 h-14 text-[#c45b4c] mx-auto mb-5 animate-paperFloat" strokeWidth={1.5} />
            <p className="text-[#c45b4c] text-sm font-black uppercase tracking-widest mb-2">{playerName}</p>
            <h1 className="text-4xl font-black text-[#c45b4c] tracking-wider mb-2">
              {lang === 'ar' ? 'أنت الإمبوستر' : 'YOU ARE THE IMPOSTER'}
            </h1>
            <p className="text-[#d97768] text-sm mt-3 font-bold">
              {lang === 'ar' ? 'حاول الاندماج مع الآخرين!' : 'Try to blend in!'}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full max-w-sm mt-8 h-2 bg-[#e2dfd3] rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-[#d97768] rounded-full animate-shrinkX" />
        </div>
        <p className="text-[#718096] text-xs mt-3 font-bold">{lang === 'ar' ? 'إخفاء تلقائي...' : 'Auto-hiding...'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn bg-[var(--color-paper-bg)]">
      <div className="paper-card p-10 w-full max-w-sm text-center relative overflow-hidden bg-[#e6edd8] border border-[#83a373]/30 shadow-md torn-top rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
        <div className="relative flex flex-col items-center">
          <Shield className="w-10 h-10 text-[#6a8c59] mb-4 animate-paperFloat" strokeWidth={1.5} />
          <p className="text-[#6a8c59] text-sm font-black uppercase tracking-widest mb-4">{playerName}</p>

          <p className="text-[#83a373] text-xs font-bold uppercase tracking-widest mb-2">
            {lang === 'ar' && category === 'Jujutsu Kaisen' ? 'Jujutsu Kaisen / جوجوتسو كايسن' : 
             lang === 'ar' && category === 'Demon Slayer' ? 'Demon Slayer / ديمون سلاير' :
             lang === 'ar' && category === 'Brawl Stars' ? 'Brawl Stars / براول ستارز' : category}
          </p>
          <div className="bg-white border-2 border-dashed border-[#83a373] px-6 py-5 rounded-2xl mb-2 shadow-sm w-full">
            <h1 className="text-3xl font-black text-[#6a8c59] tracking-wider text-center">
              {secretChar.name}
            </h1>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8 h-2 bg-[#e2dfd3] rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-[#83a373] rounded-full animate-shrinkX" />
      </div>
      <p className="text-[#718096] text-xs mt-3 font-bold">{lang === 'ar' ? 'إخفاء تلقائي...' : 'Auto-hiding...'}</p>
    </div>
  );
}
