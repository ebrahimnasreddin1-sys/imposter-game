import { Play, Settings, Users, HelpCircle, Languages, Navigation, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomeScreen({ onStartGame, onOpenPlayers, onOpenSettings }) {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="animate-fadeIn flex flex-col h-full relative p-4">
      
      {/* Decorative Doodles (Absolute positioned) */}
      <div className="absolute top-20 left-6 opacity-30 animate-paperFloat" style={{ animationDuration: '6s' }}>
        <Star className="w-6 h-6 text-[#83a373]" />
      </div>
      <div className="absolute top-40 right-8 opacity-40 animate-paperFloat" style={{ animationDuration: '7s' }}>
        <Navigation className="w-8 h-8 text-[#d97768] rotate-45" />
      </div>
      <div className="absolute bottom-32 left-10 opacity-30 animate-paperFloat" style={{ animationDuration: '5s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2d3748]">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
      <div className="absolute top-1/2 right-6 opacity-30 animate-paperFloat" style={{ animationDuration: '8s' }}>
        <Star className="w-5 h-5 text-[#e6b95c]" />
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-start w-full relative z-10 mb-12">
        <button 
          className="paper-card p-3 rounded-xl flex items-center justify-center text-[#2d3748] hover:bg-[#faf9f6] active:scale-95 transition-all shadow-sm"
          onClick={onOpenSettings}
        >
          <Settings className="w-5 h-5 text-[#718096]" />
        </button>

        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="paper-card p-2 px-3 rounded-xl text-[#2d3748] hover:bg-[#faf9f6] flex items-center gap-2 text-sm font-bold active:scale-95 transition-all shadow-sm"
        >
          <Languages className="w-4 h-4 text-[#718096]" />
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* Title Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-sm mx-auto">
        <div className="w-full relative mb-12 animate-slideUp">
          <div className="paper-card-strong px-6 py-10 w-full text-center torn-top bg-white relative">
            <h1 className="text-4xl md:text-5xl font-black text-[#2d3748] leading-tight mb-3 tracking-wide">
              {lang === 'ar' ? 'لعبة الإمبوستر' : 'Imposter Game'}
            </h1>
            <p className="text-[#718096] text-sm md:text-base font-semibold">
              {lang === 'ar' ? 'اكتشف الإمبوستر بيننا!' : 'Find the imposter among us!'}
            </p>
          </div>
          
          {/* Main Play Button */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-20">
            <button 
              onClick={onStartGame}
              className="btn-primary text-xl py-5"
            >
              {lang === 'ar' ? 'ابدأ اللعبة' : 'Start Game'} 
              <Play className="w-6 h-6 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="flex gap-3 justify-center w-full mt-auto mb-6 relative z-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
        <button className="paper-card flex-1 p-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform hover:bg-[#faf9f6]">
          <HelpCircle className="w-6 h-6 text-[#2d3748]" />
          <span className="text-xs font-bold text-[#2d3748]">{lang === 'ar' ? 'كيفية اللعب' : 'How to Play'}</span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="paper-card flex-1 p-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform hover:bg-[#faf9f6]"
        >
          <Settings className="w-6 h-6 text-[#2d3748]" />
          <span className="text-xs font-bold text-[#2d3748]">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
        </button>

        <button 
          onClick={onOpenPlayers}
          className="paper-card flex-1 p-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform hover:bg-[#faf9f6]"
        >
          <Users className="w-6 h-6 text-[#2d3748]" />
          <span className="text-xs font-bold text-[#2d3748]">{lang === 'ar' ? 'اللاعبين' : 'Players'}</span>
        </button>
      </div>

    </div>
  );
}
