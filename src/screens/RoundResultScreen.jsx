import { ChevronRight, Trophy } from 'lucide-react';
import CharacterImage from '../components/CharacterImage';

export default function RoundResultScreen({
  imposterName, secretChar, roundWinner, scores, players,
  currentRound, totalRounds, onNextRound, onChangeCategory, onFinalResults,
  category
}) {
  const isLastRound = currentRound >= totalRounds;
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6">
      <div className="text-center mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
          Round {currentRound} / {totalRounds} — Result
        </p>
        <h1 className={`text-2xl font-black ${roundWinner === 'imposter' ? 'text-red-400' : 'text-cyan-400'}`}>
          {roundWinner === 'imposter' ? '🎯 Imposter Wins!' : '🛡️ Crewmates Win!'}
        </h1>
      </div>

      {/* Round info with character image */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center gap-4">
          <CharacterImage
            name={secretChar.name}
            image={secretChar.image}
            size="md"
            glowColor="cyan"
          />
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Secret Character</span>
              <span className="text-cyan-400 font-bold">{secretChar.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Category</span>
              <span className="text-zinc-300 font-medium">{category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Imposter</span>
              <span className="text-red-400 font-bold">{imposterName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="glass-card-strong p-4 flex-1 overflow-y-auto mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Scoreboard</p>
        </div>
        <div className="space-y-1.5">
          {sorted.map((name, i) => (
            <div key={name} className={`flex items-center justify-between p-3 rounded-xl ${
              i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/[0.02]'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold w-5 text-center ${i === 0 ? 'text-yellow-400' : 'text-zinc-600'}`}>
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-white">{name}</span>
                {name === imposterName && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">IMP</span>
                )}
              </div>
              <span className={`text-sm font-bold ${i === 0 ? 'text-yellow-400' : 'text-zinc-400'}`}>
                {scores[name] || 0} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {isLastRound ? (
          <button onClick={onFinalResults} className="btn-primary text-base">
            <Trophy className="w-5 h-5" /> Final Results
          </button>
        ) : (
          <>
            <button onClick={onNextRound} className="btn-primary text-base">
              Next Round <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onChangeCategory} className="btn-ghost text-sm">
              Change Category
            </button>
          </>
        )}
      </div>
    </div>
  );
}
