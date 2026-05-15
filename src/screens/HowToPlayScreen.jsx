import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowToPlayScreen({ onBack }) {
  const { lang } = useLanguage();

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
          <div className="bg-[#d97768] text-white px-8 py-2 rounded-xl text-lg font-bold shadow-md torn-top relative whitespace-nowrap flex items-center gap-2">
            <HelpCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{lang === 'ar' ? 'طريقة اللعب' : 'How to Play'}</span>
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#d97768] to-transparent opacity-50 blur-[2px]"></div>
          </div>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-6 z-10 flex flex-col gap-4">
        <div className="paper-card p-6 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-sm">
          {lang === 'ar' ? (
            <ol className="list-decimal list-inside space-y-4 text-[#2d3748] font-bold leading-relaxed text-lg">
              <li>أضف اللاعبين.</li>
              <li>اختر الفئة.</li>
              <li>لاعب واحد يصبح الإمبوستر.</li>
              <li>باقي اللاعبين يرون نفس الشخصية السرية.</li>
              <li>تناقشوا واسألوا أسئلة لكشف الإمبوستر.</li>
              <li>كل لاعب يصوّت لمن يعتقد أنه الإمبوستر.</li>
              <li>يحصل الإمبوستر على فرصة أخيرة لتخمين الشخصية السرية.</li>
              <li>تظهر النقاط بعد كل جولة.</li>
            </ol>
          ) : (
            <ol className="list-decimal list-inside space-y-4 text-[#2d3748] font-bold leading-relaxed text-lg">
              <li>Add the players.</li>
              <li>Choose a category.</li>
              <li>One player becomes the Imposter.</li>
              <li>Everyone else sees the same secret character.</li>
              <li>Players discuss and ask questions.</li>
              <li>Everyone votes for who they think is the Imposter.</li>
              <li>The Imposter gets one final chance to guess the secret character.</li>
              <li>Scores are shown after each round.</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
