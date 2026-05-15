import { useState } from 'react';
import { UserPlus, Trash2, Edit2, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ROUND_OPTIONS = [1, 3, 5, 10, 'custom'];

export default function PlayersScreen({ onContinue, onBack }) {
  const { t, lang } = useLanguage();
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
    <div className="animate-fadeIn flex flex-col h-full relative bg-[var(--color-paper-bg)]">
      
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <button 
          onClick={onBack}
          className="paper-card w-10 h-10 rounded-xl flex items-center justify-center text-[#2d3748] active:scale-95 transition-all shadow-sm"
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 top-2">
          <div className="bg-[#83a373] text-white px-6 py-2 rounded-xl text-lg font-bold shadow-md torn-top relative">
            <span className="relative z-10">{lang === 'ar' ? 'اللاعبين' : 'Players'}</span>
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
          </div>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 z-10">
        <p className="text-[#718096] text-center text-sm font-semibold mb-6">
          {lang === 'ar' ? 'إضافة اللاعبين وتعديلهم قبل بدء اللعبة' : 'Add and edit players before starting'}
        </p>

        {/* Player inputs */}
        <div className="space-y-3 mb-8">
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-2 animate-slideUp" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex-1 relative paper-card flex items-center p-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                
                {/* Crown for host / first player */}
                {i === 0 ? (
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-[#e6b95c] animate-crownBounce" />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <div className="w-5 h-5 bg-[#e2dfd3] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#d1ccba] rounded-full"></div>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={name}
                  onChange={e => updatePlayer(i, e.target.value)}
                  placeholder={`${t("player")} ${i + 1}`}
                  maxLength={16}
                  className="flex-1 bg-transparent border-none py-2 px-2 text-[#2d3748] placeholder-[#a0aec0] text-base font-bold focus:outline-none"
                />

                <button className="w-10 h-10 flex items-center justify-center shrink-0 text-[#718096] hover:bg-[#f5f2e9] rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Delete Button */}
              {players.length > 2 && (
                <button 
                  onClick={() => removePlayer(i)} 
                  className="w-12 h-[56px] flex items-center justify-center shrink-0 rounded-xl bg-[#fbeae7] text-[#d97768] active:scale-95 transition-transform border border-[#d97768]/30 shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add player button */}
        {players.length < 12 && (
          <button 
            onClick={addPlayer} 
            className="w-full bg-[#83a373] text-white py-4 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] flex items-center justify-center gap-2 font-bold text-lg shadow-[0_4px_0_#6a8c59] active:translate-y-1 active:shadow-[0_0px_0_#6a8c59] transition-all mb-8 relative"
          >
            <UserPlus className="w-5 h-5" /> {lang === 'ar' ? 'إضافة لاعب' : 'Add Player'}
          </button>
        )}

        {/* Round selector */}
        <div className="paper-card-strong p-5 mb-4 torn-top">
          <p className="text-sm font-bold text-[#718096] text-center mb-4">{t("numberOfRounds")}</p>
          <div className="grid grid-cols-5 gap-2">
            {ROUND_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setRoundMode(opt)}
                className={`py-3 rounded-xl text-base font-bold transition-all active:scale-95 border-2 ${
                  roundMode === opt
                    ? 'bg-[#83a373] text-white border-[#6a8c59] shadow-[0_2px_0_#6a8c59]'
                    : 'bg-white text-[#718096] border-[#e2dfd3] hover:bg-[#faf9f6]'
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
              className="mt-4 w-full bg-white border-2 border-[#e2dfd3] rounded-xl px-4 py-3 text-[#2d3748] placeholder-[#a0aec0] text-base font-bold focus:outline-none focus:border-[#83a373] transition-all shadow-sm"
            />
          )}
        </div>

        {/* Validation hints */}
        {hasDuplicates && (
          <p className="text-[#d97768] text-sm font-bold text-center mb-2">{t("duplicateNames")}</p>
        )}
      </div>

      {/* Continue button */}
      <div className="px-4 pb-6 pt-2 z-10">
        <button
          onClick={() => isValid && onContinue(filledPlayers, rounds)}
          disabled={!isValid}
          className="btn-primary text-base"
        >
          {t("continue")} {lang === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
