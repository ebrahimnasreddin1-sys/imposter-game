import { Fingerprint } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PassScreen({ playerName, onReveal }) {
  const { t, lang } = useLanguage();
  return (
    <div className="animate-fadeIn flex flex-col items-center h-full px-6 bg-[var(--color-paper-bg)] relative">
      {/* Top Header Label */}
      <div className="mt-8 mb-16 relative z-10">
          <div className="bg-[#83a373] text-white px-6 py-3 rounded-xl shadow-md torn-top relative flex justify-center items-center">
            <div className="paper-strip">
              <span className="font-black text-lg">{lang === 'ar' ? 'مرر الهاتف' : 'Pass the Device'}</span>
            </div>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="w-full max-w-sm text-center flex flex-col items-center z-10">
        <p className="text-[#2d3748] text-2xl font-black mb-12">
          {lang === 'ar' ? 'مرّر الهاتف إلى' : 'Pass the phone to'}
          <br/>
          <span className="text-[#83a373] text-4xl leading-relaxed">{playerName}</span>
        </p>

        <button
          onClick={onReveal}
          className="paper-card w-full aspect-[4/3] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all shadow-md border-2 border-dashed border-[#d1ccba] hover:bg-[#faf9f6]"
        >
          <span className="text-xl font-bold text-[#2d3748]">{lang === 'ar' ? 'اضغط للكشف' : 'Tap to Reveal'}</span>
          <Fingerprint className="w-16 h-16 text-[#2d3748]" strokeWidth={1} />
        </button>
        
        <p className="text-[#718096] text-sm mt-8 font-bold">
          {lang === 'ar' ? 'لا تظهر البطاقة لغيرك!' : 'Do not show your card to anyone!'}
        </p>
      </div>
    </div>
  );
}
