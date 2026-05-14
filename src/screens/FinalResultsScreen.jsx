import { Trophy, RotateCcw, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FinalResultsScreen({ players, scores, onPlayAgain, onNewGame, onResetScores }) {
  const { t } = useLanguage();
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const topScore = scores[sorted[0]] || 0;
  const winners = sorted.filter(n => (scores[n] || 0) === topScore);
  const isTie = winners.length > 1;

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="animate-crownBounce text-5xl mb-3">👑</div>
        <h1 className="text-3xl font-black text-white mb-1">{t("finalResults")}</h1>
        {isTie ? (
          <p className="text-yellow-400 text-sm font-semibold">{t("itsATie")}</p>
        ) : (
          <p className="text-yellow-400 text-sm font-semibold">{t("isTheChampion").replace("{{name}}", winners[0])}</p>
        )}
      </div>

      {/* Leaderboard */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-2">
          {sorted.map((name, i) => {
            const pts = scores[name] || 0;
            const isWinner = pts === topScore;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

            return (
              <div
                key={name}
                className={`animate-slideUp flex items-center justify-between p-4 rounded-2xl transition-all ${
                  isWinner
                    ? 'glass-card-strong border border-yellow-500/30 bg-yellow-500/[0.06]'
                    : 'glass-card'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{medal || `#${i + 1}`}</span>
                  <div>
                    <p className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>{name}</p>
                    {isWinner && <p className="text-yellow-400/60 text-xs">{t("winner")}</p>}
                  </div>
                </div>
                <div className="text-right text-end">
                  <p className={`text-lg font-black ${isWinner ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    {pts}
                  </p>
                  <p className="text-zinc-600 text-xs">{t("points")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button onClick={onPlayAgain} className="btn-primary text-base">
          <RotateCcw className="w-5 h-5" /> {t("playAgainSame")}
        </button>
        <button onClick={onNewGame} className="btn-ghost text-sm">
          <Plus className="w-4 h-4" /> {t("newGame")}
        </button>
        <button onClick={onResetScores} className="btn-ghost text-sm text-red-400">
          <RotateCcw className="w-4 h-4" /> {t("resetScores")}
        </button>
      </div>
    </div>
  );
}
