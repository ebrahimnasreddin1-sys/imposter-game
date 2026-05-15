import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, MessageCircle, HelpCircle, Users, XSquare } from 'lucide-react';
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
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] relative">
      
      {/* Top Header Label */}
      <div className="pt-8 mb-6 relative z-10 flex justify-center">
        <div className="bg-[#83a373] text-white px-8 py-2 rounded-xl text-lg font-bold shadow-md torn-top relative">
          <span className="relative z-10">{lang === 'ar' ? 'وقت النقاش' : 'Discussion Time'}</span>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
        {/* Timer section */}
        <div className="text-center mb-6 z-10">
          <h1 className={`text-6xl font-black font-mono tabular-nums mb-3 ${isLow ? 'text-[#d97768]' : 'text-[#83a373]'}`}>
            {formatTime(seconds)}
          </h1>
          {/* Timer bar */}
          <div className="w-full max-w-xs mx-auto h-3 bg-[#e2dfd3] rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-[#d97768]' : 'bg-[#83a373]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Roulette Interaction Area */}
        <div className="paper-card p-6 mb-6 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4">
            {/* Side Illustration */}
            <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-[#f5f2e9] rounded-xl border border-[#e2dfd3] shrink-0">
              <Users className="w-6 h-6 text-[#718096] mb-1" />
              <MessageCircle className="w-5 h-5 text-[#83a373]" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-[#718096] mb-3 text-center sm:text-start border-b border-dashed border-[#d1ccba] pb-2">
                {lang === 'ar' ? 'عجلة الاستجواب' : 'Interrogation Wheel'}
              </p>

              {(rouletteResult || rouletteAnimating) ? (
                <div className={`transition-all ${rouletteAnimating ? 'opacity-60 scale-95' : 'scale-100'}`}>
                  <div className="bg-[#fef4e3] border-l-4 border-[#e6b95c] p-3 rounded-lg mb-3 shadow-sm">
                    <p className="text-lg font-bold text-[#2d3748] text-center">
                      <span className="text-[#83a373]">{displayNames.asker}</span> {lang === 'ar' ? 'يسأل' : 'asks'} <span className="text-[#83a373]">{displayNames.answerer}</span>
                    </p>
                  </div>
                  
                  {category === 'Jujutsu Kaisen' && currentQuestion && (
                    <div className="bg-white border border-[#e2dfd3] p-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-sm">
                      <p className="text-base font-bold text-[#2d3748] text-center leading-relaxed">
                        {currentQuestion}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-[#a0aec0] font-bold">
                  {lang === 'ar' ? 'اضغط على أحد الأزرار للبدء' : 'Tap a button below to spin'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          {category === 'Jujutsu Kaisen' ? (
            <>
              <button onClick={() => spinRoulette(false)} disabled={rouletteAnimating} className="btn-primary text-base py-3 shadow-[0_3px_0_#6a8c59]">
                <Users className="w-5 h-5" />
                {rouletteAnimating ? t("spinning") : (lang === 'ar' ? 'زوج عشوائي' : 'Random Pair')}
              </button>
              <button onClick={pickNewQuestion} disabled={rouletteAnimating || !rouletteResult} className="btn-primary text-base py-3 shadow-[0_3px_0_#6a8c59]">
                <HelpCircle className="w-5 h-5" />
                {lang === 'ar' ? 'سؤال عشوائي' : 'Random Question'}
              </button>
              <button onClick={() => spinRoulette(true)} disabled={rouletteAnimating} className="btn-primary text-base py-3 shadow-[0_3px_0_#6a8c59]">
                <Shuffle className="w-5 h-5" />
                {rouletteAnimating ? t("spinning") : (lang === 'ar' ? 'زوج + سؤال عشوائي' : 'Pair + Random Question')}
              </button>
            </>
          ) : (
            <button onClick={() => spinRoulette(false)} disabled={rouletteAnimating} className="btn-primary text-base py-4 shadow-[0_3px_0_#6a8c59]">
              <Shuffle className="w-5 h-5" />
              {rouletteAnimating ? t("spinning") : (lang === 'ar' ? 'اختيار لاعبين عشوائيًا' : 'Spin Roulette')}
            </button>
          )}
        </div>

        {/* End Round Button */}
        <div className="mt-auto flex justify-center">
          <button 
            onClick={onEndRound} 
            className="paper-card flex items-center gap-3 px-6 py-3 rounded-xl text-[#d97768] font-bold active:scale-95 transition-all shadow-sm border border-[#d97768]/30 hover:bg-[#fbeae7]"
          >
            <XSquare className="w-5 h-5" fill="#d97768" stroke="white" /> 
            {lang === 'ar' ? 'إنهاء الجولة' : 'End Round'}
          </button>
        </div>
      </div>
    </div>
  );
}
