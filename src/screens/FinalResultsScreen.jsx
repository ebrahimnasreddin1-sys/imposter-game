import { Trophy, RotateCcw, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FinalResultsScreen({ players, scores, onPlayAgain, onNewGame, onResetScores }) {
  const { t } = useLanguage();
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const topScore = scores[sorted[0]] || 0;
  const winners = sorted.filter(n => (scores[n] || 0) === topScore);
  const isTie = winners.length > 1;

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 relative">
      {/* Decorative background doodles could go here */}
      {/* Header */}
      <div className="text-center mb-8">
        <div className="animate-crownBounce text-6xl mb-4">👑</div>
        <h1 className="text-4xl font-black text-[#2b2a26] mb-2">{t("finalResults")}</h1>
        {isTie ? (
          <p className="text-[#dca843] text-sm font-black tracking-widest uppercase">{t("itsATie")}</p>
        ) : (
          <p className="text-[#dca843] text-sm font-black tracking-widest uppercase">{t("isTheChampion").replace("{{name}}", winners[0])}</p>
        )}
      </div>

      {/* Leaderboard */}
      <div className="flex-1 overflow-y-auto mb-6 px-1 pb-2">
        <div className="space-y-3">
          {sorted.map((name, i) => {
            const pts = scores[name] || 0;
            const isWinner = pts === topScore;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

            return (
              <div
                key={name}
                className={`animate-slideUp flex items-center justify-between p-5 rounded-2xl transition-all shadow-sm ${
                  isWinner
                    ? 'paper-card-strong border-2 border-[#dca843] bg-[#fcf1d7]'
                    : 'bg-white border-2 border-[#e6e2d6]'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">{medal || <span className="text-lg font-black text-[#a9a69b]">#{i + 1}</span>}</span>
                  <div>
                    <p className={`font-black text-lg ${isWinner ? 'text-[#dca843]' : 'text-[#2b2a26]'}`}>{name}</p>
                    {isWinner && <p className="text-[#dca843] text-xs font-bold uppercase tracking-widest">{t("winner")}</p>}
                  </div>
                </div>
                <div className="text-right text-end">
                  <p className={`text-2xl font-black ${isWinner ? 'text-[#dca843]' : 'text-[#6a675d]'}`}>
                    {pts}
                  </p>
                  <p className="text-[#a9a69b] text-xs font-bold uppercase tracking-widest">{t("points")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button onClick={onPlayAgain} className="btn-primary text-base">
          <RotateCcw className="w-5 h-5" /> {t("playAgainSame")}
        </button>
        <button onClick={onNewGame} className="btn-ghost text-sm">
          <Plus className="w-4 h-4" /> {t("newGame")}
        </button>
        <button onClick={onResetScores} className="btn-ghost text-sm text-[#c95c4e] hover:text-[#c95c4e] hover:bg-[#c95c4e]/10 border-[#c95c4e]/30">
          <RotateCcw className="w-4 h-4" /> {t("resetScores")}
        </button>
      </div>
    </div>
  );
}
