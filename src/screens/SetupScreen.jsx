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
    <div className="animate-fadeIn flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Language Toggle */}
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center gap-2 text-xs font-bold active:scale-95 transition-all"
          >
            <Languages className="w-4 h-4" />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Users className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t("playerSetup")}</h1>
          <p className="text-zinc-500 text-sm mt-1">{t("addPlayersToBegin")}</p>
        </div>

        {/* Player inputs */}
        <div className="space-y-2.5 mb-6">
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-2 animate-slideUp" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex-1 relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => updatePlayer(i, e.target.value)}
                  placeholder={`${t("player")} ${i + 1}`}
                  maxLength={16}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl ps-10 pe-4 py-3.5 text-white placeholder-zinc-600 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
              {players.length > 2 && (
                <button onClick={() => removePlayer(i)} className="p-3 rounded-xl bg-red-500/10 text-red-400 active:scale-95 transition-transform">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add player button */}
        {players.length < 12 && (
          <button onClick={addPlayer} className="btn-ghost mb-6 text-sm">
            <UserPlus className="w-4 h-4" /> {t("addPlayer")} ({players.length}/12)
          </button>
        )}

        {/* Round selector */}
        <div className="glass-card p-4 mb-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t("numberOfRounds")}</p>
          <div className="grid grid-cols-5 gap-2">
            {ROUND_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setRoundMode(opt)}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  roundMode === opt
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
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
              className="mt-3 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          )}
        </div>

        {/* Validation hints */}
        {hasDuplicates && (
          <p className="text-red-400 text-xs text-center mb-2">{t("duplicateNames")}</p>
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
