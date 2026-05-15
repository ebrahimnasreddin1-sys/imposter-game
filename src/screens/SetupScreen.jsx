import { useState } from 'react';
import { UserPlus, Trash2, Users, ChevronRight, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ROUND_OPTIONS = [1, 3, 5, 10, 'custom'];

export default function SetupScreen({ onContinue }) {
  const { t, lang, setLang } = useLanguage();
  const [players, setPlayers] = useState(['', '']);
  const [totalRounds, setTotalRounds] = useState(3);
  const [customRounds, setCustomRounds] = useState('');
  const [roundMode, setRoundMode] = useState(3);

  const addPlayer = () => {
    if (players.length < 12) setPlayers([...players, '']);
  };

  const removePlayer = (i) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i));
  };

  const updatePlayer = (i, val) => {
    const next = [...players];
    next[i] = val;
    setPlayers(next);
  };

  const trimmedPlayers = players.map(p => p.trim());
  const filledPlayers = trimmedPlayers.filter(p => p.length > 0);
  const hasDuplicates = new Set(filledPlayers.map(n => n.toLowerCase())).size !== filledPlayers.length;
  const rounds = roundMode === 'custom' ? parseInt(customRounds) || 0 : roundMode;
  const isValid = filledPlayers.length >= 2 && !hasDuplicates && rounds >= 1 && rounds <= 50 && filledPlayers.length === players.length;

  return (
    <div className="animate-fadeIn flex flex-col h-full relative">
      {/* Decorative background doodles could go here */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="paper-card p-2 px-3 rounded-xl text-[#2b2a26] hover:bg-[#faf9f6] flex items-center gap-2 text-xs font-bold active:scale-95 transition-all shadow-sm"
          >
            <Languages className="w-4 h-4 text-[#6a675d]" />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#718d53]/10 border border-[#718d53]/20 mb-4 animate-paperFloat">
            <Users className="w-8 h-8 text-[#718d53]" />
          </div>
          <div className="relative inline-block">
            <h1 className="text-3xl font-black text-[#2b2a26] relative z-10">{t("playerSetup")}</h1>
          </div>
          <p className="text-[#6a675d] text-sm mt-2 font-semibold">{t("addPlayersToBegin")}</p>
        </div>

        {/* Player inputs */}
        <div className="space-y-3 mb-8">
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-2 animate-slideUp" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex-1 relative paper-card overflow-hidden">
                <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[#d2cdbc] text-sm font-black">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => updatePlayer(i, e.target.value)}
                  placeholder={`${t("player")} ${i + 1}`}
                  maxLength={16}
                  className="w-full bg-transparent border-none rounded-xl ps-12 pe-4 py-4 text-[#2b2a26] placeholder-[#a9a69b] text-base font-bold focus:outline-none focus:bg-[#faf9f6] transition-all"
                />
              </div>
              {players.length > 2 && (
                <button onClick={() => removePlayer(i)} className="p-4 rounded-xl bg-[#c95c4e]/10 text-[#c95c4e] active:scale-95 transition-transform hover:bg-[#c95c4e]/20 border border-[#c95c4e]/20">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add player button */}
        {players.length < 12 && (
          <button onClick={addPlayer} className="btn-ghost mb-8 text-base">
            <UserPlus className="w-5 h-5" /> {t("addPlayer")} ({players.length}/12)
          </button>
        )}

        {/* Round selector */}
        <div className="paper-card-strong p-5 mb-4 torn-top">
          <p className="text-xs font-black text-[#6a675d] uppercase tracking-widest mb-4">{t("numberOfRounds")}</p>
          <div className="grid grid-cols-5 gap-2">
            {ROUND_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setRoundMode(opt)}
                className={`py-3 rounded-xl text-base font-black transition-all active:scale-95 border-2 ${
                  roundMode === opt
                    ? 'bg-[#718d53] text-white border-[#5d7543] shadow-[0_2px_0_#5d7543]'
                    : 'bg-white text-[#6a675d] border-[#e6e2d6] hover:bg-[#faf9f6]'
                }`}
              >
                {opt === 'custom' ? '...' : opt}
              </button>
            ))}
          </div>
          {roundMode === 'custom' && (
            <input
              type="number"
              min="1"
              max="50"
              value={customRounds}
              onChange={e => setCustomRounds(e.target.value)}
              placeholder={t("enterRounds")}
              className="mt-4 w-full bg-white border-2 border-[#e6e2d6] rounded-xl px-4 py-3 text-[#2b2a26] placeholder-[#a9a69b] text-base font-bold focus:outline-none focus:border-[#718d53] transition-all shadow-sm"
            />
          )}
        </div>

        {/* Validation hints */}
        {hasDuplicates && (
          <p className="text-[#c95c4e] text-sm font-bold text-center mb-2">{t("duplicateNames")}</p>
        )}
      </div>

      {/* Continue button */}
      <div className="px-4 pb-6 pt-2">
        <button
          onClick={() => isValid && onContinue(filledPlayers, rounds)}
          disabled={!isValid}
          className="btn-primary text-base"
        >
          {t("continue")} <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
