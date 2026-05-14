import { ChevronRight, Trophy, Users } from 'lucide-react';

export default function RoundResultScreen({
  imposterName, secretChar, roundWinner, scores, players, votes,
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

      {/* Round info without character image */}
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            <span className="text-zinc-400 text-sm">Secret Character</span>
            <span className="text-cyan-400 font-bold">{secretChar.name}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-zinc-500 text-sm">Category</span>
            <span className="text-zinc-300 font-medium text-sm">{category}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-zinc-500 text-sm">Imposter</span>
            <span className="text-red-400 font-bold text-sm">{imposterName}</span>
          </div>
        </div>
      </div>

      {/* Voting Results */}
      {votes && Object.keys(votes).length > 0 && (
        <div className="glass-card-strong p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-cyan-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Voting Results</p>
          </div>
          <div className="space-y-2">
            {Object.entries(votes).map(([voter, votedFor]) => {
              const isCorrect = votedFor === imposterName && voter !== imposterName;
              return (
                <div key={voter} className="flex items-center justify-between text-sm bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                  <span className="text-zinc-300">
                    <span className="font-semibold text-white">{voter}</span> voted for <span className="font-semibold text-white">{votedFor}</span>
                  </span>
                  {voter !== imposterName && (
                    <span className={`text-xs font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '+1 pt' : 'wrong'}
                    </span>
                  )}
                  {voter === imposterName && (
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Imposter</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
