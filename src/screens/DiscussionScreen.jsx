import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';
import { jujutsuQuestions, jujutsuQuestionsAr } from '../utils/jujutsuQuestions';
import { useLanguage } from '../contexts/LanguageContext';

export default function DiscussionScreen({ players, category, currentRound, onEndRound }) {
  const { t, lang } = useLanguage();
  const [seconds, setSeconds] = useState(180);
  const [running, setRunning] = useState(true);
  const [rouletteResult, setRouletteResult] = useState(null);
  const [rouletteAnimating, setRouletteAnimating] = useState(false);
  const [displayNames, setDisplayNames] = useState({ asker: '', answerer: '' });
  const [currentQuestion, setCurrentQuestion] = useState(null);
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

  const getUnusedQuestion = useCallback(() => {
    const questionsBank = lang === 'ar' ? jujutsuQuestionsAr : jujutsuQuestions;
    let stateStr = localStorage.getItem('jjk_questions_state');
    let state = stateStr ? JSON.parse(stateStr) : { usedIndices: [], lastRoundReset: currentRound };

    if (currentRound < state.lastRoundReset || currentRound - state.lastRoundReset >= 3) {
      state = { usedIndices: [], lastRoundReset: currentRound };
    }

    if (state.usedIndices.length >= questionsBank.length) {
      state.usedIndices = [];
      state.lastRoundReset = currentRound;
    }

    let availableIndices = [];
    for (let i = 0; i < questionsBank.length; i++) {
      if (!state.usedIndices.includes(i)) {
        availableIndices.push(i);
      }
    }

    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    state.usedIndices.push(randomIdx);
    localStorage.setItem('jjk_questions_state', JSON.stringify(state));

    return questionsBank[randomIdx];
  }, [currentRound, lang]);

  const spinRoulette = useCallback((withQuestion = false) => {
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
        if (withQuestion && category === 'Jujutsu Kaisen') {
          setCurrentQuestion(getUnusedQuestion());
        }
        setRouletteAnimating(false);
      }
    }, 100);
  }, [players, rouletteAnimating, category, getUnusedQuestion]);

  const pickNewQuestion = useCallback(() => {
    setCurrentQuestion(getUnusedQuestion());
  }, [getUnusedQuestion]);

  const pct = (seconds / 180) * 100;
  const isLow = seconds <= 30;

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 relative">
      {/* Decorative background doodles could go here */}
      <div className="text-center mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#718d53] mb-1">{t("discussionTime")}</p>
        <h1 className={`text-6xl font-black font-mono tabular-nums ${isLow ? 'text-[#c95c4e]' : 'text-[#2b2a26]'}`}>
          {formatTime(seconds)}
        </h1>
        {/* Timer bar */}
        <div className="w-full h-2 bg-[#e6e2d6] rounded-full overflow-hidden mt-5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-[#c95c4e]' : 'bg-[#718d53]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Timer controls */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button onClick={() => setRunning(!running)} className="btn-ghost text-sm py-4">
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {running ? t("pause") : t("resume")}
        </button>
        <button onClick={() => { setSeconds(180); setRunning(false); }} className="btn-ghost text-sm py-4">
          <RotateCcw className="w-5 h-5" /> {t("reset")}
        </button>
        <button onClick={onEndRound} className="btn-danger text-sm py-4">
          <SkipForward className="w-5 h-5" /> {t("end")}
        </button>
      </div>

      {/* Interrogation Roulette */}
      <div className="paper-card-strong p-6 flex-1 flex flex-col torn-top">
        <p className="text-sm font-black uppercase tracking-widest text-[#6a675d] mb-5 text-center">
          {t("interrogationRoulette")}
        </p>

        {(rouletteResult || rouletteAnimating) && (
          <div className={`text-center mb-6 p-5 paper-card shadow-sm ${rouletteAnimating ? 'opacity-60 scale-95' : 'scale-100 border-[#718d53] border-2'} transition-all`}>
            <p className="text-2xl font-black text-[#718d53]">{displayNames.asker}</p>
            <p className="text-[#6a675d] text-sm my-2 font-bold">{t("asks")}</p>
            <p className="text-2xl font-black text-[#2b2a26]">{displayNames.answerer}</p>
            
            {category === 'Jujutsu Kaisen' && currentQuestion && (
              <div className={`mt-5 pt-5 border-t-2 border-[#e6e2d6] dashed ${rouletteAnimating ? 'opacity-0' : 'animate-fadeIn'}`}>
                <p className="text-xs font-black text-[#6a675d] uppercase tracking-widest mb-2">{t("questionLabel")}</p>
                <p className="text-lg font-bold text-[#2b2a26]">"{currentQuestion}"</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto">
          {category === 'Jujutsu Kaisen' ? (
            <div className="flex flex-col gap-3">
              <button onClick={() => spinRoulette(true)} disabled={rouletteAnimating} className="btn-primary text-base">
                <Shuffle className="w-5 h-5" />
                {rouletteAnimating ? t("spinning") : t("randomPairQuestion")}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => spinRoulette(false)} disabled={rouletteAnimating} className="btn-ghost text-sm px-2">
                  {t("randomPair")}
                </button>
                <button onClick={pickNewQuestion} disabled={rouletteAnimating || !rouletteResult} className="btn-ghost text-sm px-2">
                  {t("randomQuestion")}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => spinRoulette(false)} disabled={rouletteAnimating} className="btn-primary text-base">
              <Shuffle className="w-5 h-5" />
              {rouletteAnimating ? t("spinning") : t("spinRoulette")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
