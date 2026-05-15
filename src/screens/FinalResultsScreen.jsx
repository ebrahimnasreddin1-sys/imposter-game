import { Trophy, RotateCcw, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FinalResultsScreen({ players, scores, onPlayAgain, onNewGame, onResetScores }) {
  const { t, lang } = useLanguage();
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const topScore = scores[sorted[0]] || 0;
  const winners = sorted.filter(n => (scores[n] || 0) === topScore);
  const isTie = winners.length > 1;

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] relative">
      
      {/* Top Header Label */}
      <div className="pt-8 mb-6 relative z-10 flex justify-center">
        <div className="bg-[#e6b95c] text-white px-6 py-3 rounded-xl shadow-md torn-top relative flex justify-center items-center">
          <div className="paper-strip">
            <span className="font-black text-lg text-center leading-tight">
              {lang === 'ar' ? 'النتائج النهائية' : 'Final Results'}
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#e6b95c] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
        {/* Header Content */}
        <div className="text-center mb-8">
          <div className="animate-crownBounce text-7xl mb-4">👑</div>
          {isTie ? (
            <p className="text-[#e6b95c] text-lg font-black tracking-widest uppercase">{t("itsATie")}</p>
          ) : (
            <p className="text-[#2d3748] text-xl font-black">
              <span className="text-[#e6b95c] text-3xl block mb-1">{winners[0]}</span>
              {lang === 'ar' ? 'هو البطل!' : 'is the Champion!'}
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="flex-1 mb-6">
          <div className="space-y-3">
            {sorted.map((name, i) => {
              const pts = scores[name] || 0;
              const isWinner = pts === topScore;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

              return (
                <div
                  key={name}
                  className={`animate-slideUp flex items-center justify-between p-5 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] transition-all shadow-sm paper-card ${
                    isWinner
                      ? 'border-2 border-[#e6b95c] bg-[#fef4e3] scale-105 z-10 my-4'
                      : 'border border-[#e2dfd3] bg-white'
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl w-10 text-center">{medal || <span className="text-xl font-black text-[#a0aec0]">#{i + 1}</span>}</span>
                    <div>
                      <p className={`font-black text-xl ${isWinner ? 'text-[#dca843]' : 'text-[#2d3748]'}`}>{name}</p>
                      {isWinner && <p className="text-[#e6b95c] text-xs font-bold uppercase tracking-widest">{t("winner")}</p>}
                    </div>
                  </div>
                  <div className="text-right text-end">
                    <p className={`text-3xl font-black ${isWinner ? 'text-[#dca843]' : 'text-[#718096]'}`}>
                      {pts}
                    </p>
                    <p className="text-[#a0aec0] text-xs font-bold uppercase tracking-widest">{t("points")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-auto space-y-3">
          <button onClick={onPlayAgain} className="btn-primary p-2 w-full">
            <div className="paper-strip w-full py-2 px-6 text-lg border-none shadow-sm flex items-center justify-center gap-2 h-full">
              <RotateCcw className="w-5 h-5" /> {t("playAgainSame")}
            </div>
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onNewGame} className="paper-card py-4 rounded-xl text-[#2d3748] font-bold active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 border border-[#e2dfd3] hover:bg-[#faf9f6]">
              <Plus className="w-5 h-5" /> {t("newGame")}
            </button>
            <button onClick={onResetScores} className="paper-card py-4 rounded-xl text-[#d97768] font-bold active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 border border-[#d97768]/30 bg-[#fbeae7] hover:bg-[#f5e0dc]">
              <RotateCcw className="w-5 h-5" /> {t("resetScores")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
