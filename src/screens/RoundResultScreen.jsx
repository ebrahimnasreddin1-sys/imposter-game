import { ChevronRight, ChevronLeft, Trophy, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RoundResultScreen({
  imposterName, secretChar, roundWinner, scores, players, votes,
  currentRound, totalRounds, onNextRound, onChangeCategory, onFinalResults,
  category
}) {
  const { t, lang } = useLanguage();
  const isLastRound = currentRound >= totalRounds;
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  const catNameAr = {
    "Jujutsu Kaisen": "Jujutsu Kaisen / جوجوتسو كايسن",
    "Demon Slayer": "Demon Slayer / ديمون سلاير",
    "Brawl Stars": "Brawl Stars / براول ستارز"
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] relative">
      
      {/* Top Header Label */}
      <div className="pt-8 mb-6 relative z-10 flex justify-center">
        <div className="bg-[#83a373] text-white px-6 py-3 rounded-xl shadow-md torn-top relative flex justify-center items-center">
          <div className="paper-strip">
            <span className="font-black text-lg text-center leading-tight">
              {lang === 'ar' ? 'نتيجة الجولة' : 'Round Result'}
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
        <div className="text-center mb-6">
          <p className="text-sm font-black uppercase tracking-widest text-[#718096] mb-2">
            {t("round")} {currentRound} {t("of")} {totalRounds}
          </p>
          <h1 className={`text-3xl font-black ${roundWinner === 'imposter' ? 'text-[#d97768]' : 'text-[#83a373]'}`}>
            {roundWinner === 'imposter' ? `🎯 ${t("imposterWin")}` : `🛡️ ${t("crewWin")}`}
          </h1>
        </div>

        {/* Round info */}
        <div className="paper-card p-5 mb-5 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-[#f5f2e9] p-3 rounded-xl border border-[#e2dfd3]">
              <span className="text-[#718096] text-sm font-bold">{t("secretCharacter")}</span>
              <div className="paper-strip px-3 py-1">
                <span className="text-[#6a8c59] font-black">{secretChar.name}</span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[#718096] text-sm font-bold">{t("categoryText")}</span>
              <div className="paper-strip-alt px-3 py-1">
                <span className="text-[var(--color-ink-main)] font-black text-sm">{lang === 'ar' ? (catNameAr[category] || category) : category}</span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[#718096] text-sm font-bold">{t("imposterText")}</span>
              <div className="paper-strip px-3 py-1">
                <span className="text-[#c45b4c] font-black text-sm">{imposterName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Results */}
        {votes && Object.keys(votes).length > 0 && (
          <div className="paper-card p-5 mb-5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-dashed border-[#e2dfd3] pb-2">
              <Users className="w-5 h-5 text-[#83a373]" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#718096]">{t("votingResults")}</p>
            </div>
            <div className="space-y-2">
              {Object.entries(votes).map(([voter, votedFor]) => {
                const isCorrect = votedFor === imposterName && voter !== imposterName;
                return (
                  <div key={voter} className="flex items-center justify-between text-sm bg-[#faf9f6] p-3 rounded-xl border border-[#e2dfd3]">
                    <span className="text-[#718096]">
                      <span className="font-bold text-[#2d3748]">{voter}</span> {t("votedFor")} <span className="font-bold text-[#2d3748]">{votedFor}</span>
                    </span>
                    {voter !== imposterName && (
                      <span className={`text-xs font-black px-2 py-1 rounded ${isCorrect ? 'bg-[#e6edd8] text-[#6a8c59]' : 'bg-[#fbeae7] text-[#c45b4c]'}`}>
                        {isCorrect ? '+1' : t("wrong")}
                      </span>
                    )}
                    {voter === imposterName && (
                      <span className="text-xs text-[#a0aec0] font-bold uppercase tracking-widest">{t("imposterText")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="paper-card p-5 mb-6 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-sm flex-1">
          <div className="flex items-center gap-2 mb-4 border-b border-dashed border-[#e2dfd3] pb-2">
            <Trophy className="w-5 h-5 text-[#e6b95c]" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#718096]">{t("scoreboard")}</p>
          </div>
          <div className="space-y-2">
            {sorted.map((name, i) => (
              <div key={name} className={`flex items-center justify-between p-4 rounded-xl ${
                i === 0 ? 'bg-[#fef4e3] border border-[#e6b95c]' : 'bg-white border border-[#e2dfd3]'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-black w-6 text-center ${i === 0 ? 'text-[#dca843]' : 'text-[#a0aec0]'}`}>
                    {i + 1}
                  </span>
                  <span className={`text-base font-bold ${i === 0 ? 'text-[#dca843]' : 'text-[#2d3748]'}`}>{name}</span>
                  {name === imposterName && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#fbeae7] text-[#c45b4c] font-black">IMP</span>
                  )}
                </div>
                <span className={`text-sm font-black ${i === 0 ? 'text-[#dca843]' : 'text-[#718096]'}`}>
                  {scores[name] || 0} {t("pts")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-auto space-y-3">
          {isLastRound ? (
            <button onClick={onFinalResults} className="btn-primary p-2 w-full">
              <div className="paper-strip w-full py-2 px-6 text-lg border-none shadow-sm flex items-center justify-center gap-2 h-full">
                <Trophy className="w-5 h-5" /> {t("finalResults")}
              </div>
            </button>
          ) : (
            <>
              <button onClick={onNextRound} className="btn-primary p-2 w-full">
                <div className="paper-strip w-full py-2 px-6 text-lg border-none shadow-sm flex items-center justify-center gap-2 h-full">
                  {lang === 'ar' ? <ChevronLeft className="w-6 h-6" /> : null}
                  {t("nextRound")} 
                  {lang === 'en' ? <ChevronRight className="w-6 h-6" /> : null}
                </div>
              </button>
              <button onClick={onChangeCategory} className="w-full text-center py-3 text-sm font-bold text-[#718096] active:scale-95 transition-transform hover:text-[#2d3748]">
                {t("changeCategory")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
