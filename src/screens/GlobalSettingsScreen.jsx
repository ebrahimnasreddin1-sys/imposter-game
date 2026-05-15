import { ChevronLeft, ChevronRight, Moon, Sun, Volume2, VolumeX, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

export default function GlobalSettingsScreen({ onBack }) {
  const { lang, setLang } = useLanguage();
  const { soundEnabled, setSoundEnabled, darkMode, setDarkMode } = useSettings();

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
          <div className="bg-[#718096] text-white px-6 py-3 rounded-xl shadow-md torn-top relative whitespace-nowrap flex items-center justify-center">
            <div className="paper-strip">
              <span className="font-black text-lg">{lang === 'ar' ? 'الإعدادات العامة' : 'Settings'}</span>
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#718096] to-transparent opacity-50 blur-[2px]"></div>
          </div>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-6 z-10 flex flex-col gap-4">

        {/* Sound Effects Toggle */}
        <div className="w-full flex items-center justify-between p-5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] paper-card shadow-sm">
          <div className="flex items-center gap-4">
            {soundEnabled ? <Volume2 className="w-6 h-6 text-[#83a373]" /> : <VolumeX className="w-6 h-6 text-[#718096]" />}
            <div>
              <p className="text-lg font-bold text-[#2d3748]">
                {lang === 'ar' ? 'المؤثرات الصوتية' : 'Sound Effects'}
              </p>
              <p className="text-sm font-bold text-[#718096]">
                {soundEnabled ? (lang === 'ar' ? 'تشغيل' : 'On') : (lang === 'ar' ? 'إيقاف' : 'Off')}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shadow-inner ${soundEnabled ? 'bg-[#83a373]' : 'bg-[#e2dfd3]'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 border border-[#e2dfd3] ${soundEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="w-full flex items-center justify-between p-5 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] paper-card shadow-sm">
          <div className="flex items-center gap-4">
            {darkMode ? <Moon className="w-6 h-6 text-[#e6b95c]" /> : <Sun className="w-6 h-6 text-[#d97768]" />}
            <div>
              <p className="text-lg font-bold text-[#2d3748]">
                {lang === 'ar' ? 'المظهر' : 'Appearance'}
              </p>
              <p className="text-sm font-bold text-[#718096]">
                {darkMode ? (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode') : (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shadow-inner ${darkMode ? 'bg-[#2d3748]' : 'bg-[#e2dfd3]'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 border border-[#e2dfd3] ${darkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Language Selection */}
        <div className="w-full flex items-center justify-between p-5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] paper-card shadow-sm">
          <div className="flex items-center gap-4">
            <Languages className="w-6 h-6 text-[#2d3748]" />
            <p className="text-lg font-bold text-[#2d3748]">
              {lang === 'ar' ? 'اللغة' : 'Language'}
            </p>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-4 py-2 bg-white border border-[#e2dfd3] rounded-xl text-sm text-[#2d3748] font-bold active:scale-95 transition-transform shadow-sm"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
}
