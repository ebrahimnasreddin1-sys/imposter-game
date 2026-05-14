import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';

export default function DiscussionScreen({ players, onEndRound }) {
  const [seconds, setSeconds] = useState(180);
  const [running, setRunning] = useState(true);
  const [rouletteResult, setRouletteResult] = useState(null);
  const [rouletteAnimating, setRouletteAnimating] = useState(false);
  const [displayNames, setDisplayNames] = useState({ asker: '', answerer: '' });
  const lastAsker = useRef(null);
  const lastAnswerer = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds <= 0) { setRunning(false); onEndRound(); }
  }, [seconds, onEndRound]);

  const spinRoulette = useCallback(() => {
    if (rouletteAnimating || players.length < 2) return;
    setRouletteAnimating(true);

    let count = 0;
    const total = 15;
    const iv = setInterval(() => {
      const a = Math.floor(Math.random() * players.length);
      let b;
      do { b = Math.floor(Math.random() * players.length); } while (b === a);
      setDisplayNames({ asker: players[a], answerer: players[b] });
      count++;
      if (count >= total) {
        clearInterval(iv);
        // Pick final avoiding repeats
        let askerIdx, answererIdx;
        const attempts = 20;
        for (let i = 0; i < attempts; i++) {
          askerIdx = Math.floor(Math.random() * players.length);
          if (askerIdx !== lastAsker.current || i === attempts - 1) break;
        }
        do { answererIdx = Math.floor(Math.random() * players.length); }
        while (answererIdx === askerIdx);
        if (answererIdx === lastAnswerer.current && players.length > 2) {
          do { answererIdx = Math.floor(Math.random() * players.length); }
          while (answererIdx === askerIdx || answererIdx === lastAnswerer.current);
        }
        lastAsker.current = askerIdx;
        lastAnswerer.current = answererIdx;
        const final = { asker: players[askerIdx], answerer: players[answererIdx] };
        setDisplayNames(final);
        setRouletteResult(final);
        setRouletteAnimating(false);
      }
    }, 100);
  }, [players, rouletteAnimating]);

  const pct = (seconds / 180) * 100;
  const isLow = seconds <= 30;

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6">
      <div className="text-center mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">Discussion Time</p>
        <h1 className={`text-6xl font-black font-mono tabular-nums ${isLow ? 'text-red-400' : 'text-white'}`}>
          {formatTime(seconds)}
        </h1>
        {/* Timer bar */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Timer controls */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button onClick={() => setRunning(!running)} className="btn-ghost text-sm py-3">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={() => { setSeconds(180); setRunning(false); }} className="btn-ghost text-sm py-3">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={onEndRound} className="btn-danger text-sm py-3">
          <SkipForward className="w-4 h-4" /> End
        </button>
      </div>

      {/* Interrogation Roulette */}
      <div className="glass-card-strong p-5 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 text-center">
          ⚡ Interrogation Roulette
        </p>

        {(rouletteResult || rouletteAnimating) && (
          <div className={`text-center mb-4 p-4 glass-card ${rouletteAnimating ? 'opacity-60' : 'neon-cyan'}`}>
            <p className="text-lg font-bold text-cyan-400">{displayNames.asker}</p>
            <p className="text-zinc-500 text-xs my-1">asks</p>
            <p className="text-lg font-bold text-white">{displayNames.answerer}</p>
          </div>
        )}

        <button onClick={spinRoulette} disabled={rouletteAnimating} className="btn-primary text-sm">
          <Shuffle className="w-4 h-4" />
          {rouletteAnimating ? 'Spinning...' : 'Spin Roulette'}
        </button>
      </div>
    </div>
  );
}
