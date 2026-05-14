import { useState } from 'react';
import { Users, Lock } from 'lucide-react';

export default function VotingScreen({ players, currentVoterIdx, onVote }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [passScreen, setPassScreen] = useState(true);

  const voterName = players[currentVoterIdx];
  const options = players.filter(p => p !== voterName);

  const handleVote = () => {
    if (!selected) return;
    setLocked(true);
    setTimeout(() => {
      onVote(voterName, selected);
      setSelected(null);
      setLocked(false);
      if (currentVoterIdx < players.length - 1) {
        setPassScreen(true);
      }
    }, 1500);
  };

  if (passScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-fadeIn">
        <div className="text-center mb-8">
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Voting Phase</p>
          <h1 className="text-3xl font-black text-white">Pass device to</h1>
          <h2 className="text-5xl font-black text-cyan-400 mt-2">{voterName}</h2>
        </div>
        <button onClick={() => setPassScreen(false)} className="btn-primary py-4 px-12 text-lg">
          I am {voterName}
        </button>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
        <div className="glass-card-strong p-8 text-center border-cyan-500/30 w-full max-w-sm">
          <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">Vote Locked</h1>
          <p className="text-zinc-400 mt-2">Pass to next player</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-3">
          <Users className="w-6 h-6 text-cyan-400" />
        </div>
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
          Player {currentVoterIdx + 1} of {players.length}
        </p>
        <h1 className="text-2xl font-bold text-white">{voterName}, cast your vote</h1>
        <p className="text-zinc-500 text-sm mt-1">Who is the imposter?</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-6">
        {options.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`w-full p-4 rounded-xl text-left font-bold transition-all ${
              selected === name 
                ? 'bg-red-500/20 border border-red-500/50 text-red-400' 
                : 'bg-white/[0.03] border border-white/[0.05] text-white hover:bg-white/[0.06]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!selected}
        className="btn-primary py-4 text-lg disabled:opacity-50 disabled:active:scale-100"
      >
        Lock Vote
      </button>
    </div>
  );
}
