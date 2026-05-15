import { ChevronRight, Trophy, Users } from 'lucide-react';
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
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 relative">
      {/* Decorative background doodles could go here */}
      <div className="text-center mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#6a675d] mb-2">
          {t("round")} {currentRound} {t("of")} {totalRounds} — {t("result")}
        </p>
        <h1 className={`text-3xl font-black ${roundWinner === 'imposter' ? 'text-[#c95c4e]' : 'text-[#718d53]'}`}>
          {roundWinner === 'imposter' ? `🎯 ${t("imposterWin")}` : `🛡️ ${t("crewWin")}`}
        </h1>
      </div>

      {/* Round info without character image */}
      <div className="paper-card p-5 mb-5 torn-top">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-[#f9f6f0] p-3 rounded-xl border border-[#e6e2d6]">
            <span className="text-[#6a675d] text-sm font-bold">{t("secretCharacter")}</span>
            <span className="text-[#5d7543] font-black">{secretChar.name}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-[#6a675d] text-sm font-bold">{t("categoryText")}</span>
            <span className="text-[#2b2a26] font-black text-sm">{lang === 'ar' ? (catNameAr[category] || category) : category}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-[#6a675d] text-sm font-bold">{t("imposterText")}</span>
            <span className="text-[#a84d41] font-black text-sm">{imposterName}</span>
          </div>
        </div>
      </div>

      {/* Voting Results */}
      {votes && Object.keys(votes).length > 0 && (
        <div className="paper-card-strong p-5 mb-5 torn-top">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#718d53]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#6a675d]">{t("votingResults")}</p>
          </div>
          <div className="space-y-2">
            {Object.entries(votes).map(([voter, votedFor]) => {
              const isCorrect = votedFor === imposterName && voter !== imposterName;
              return (
                <div key={voter} className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-[#e6e2d6] shadow-sm">
                  <span className="text-[#6a675d]">
                    <span className="font-black text-[#2b2a26]">{voter}</span> {t("votedFor")} <span className="font-black text-[#2b2a26]">{votedFor}</span>
                  </span>
                  {voter !== imposterName && (
                    <span className={`text-xs font-black ${isCorrect ? 'text-[#718d53]' : 'text-[#c95c4e]'}`}>
                      {isCorrect ? '+1' : t("wrong")}
                    </span>
                  )}
                  {voter === imposterName && (
                    <span className="text-xs text-[#a9a69b] font-bold uppercase tracking-widest">{t("imposterText")}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="paper-card-strong p-5 flex-1 overflow-y-auto mb-5 torn-top">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-[#dca843]" />
          <p className="text-xs font-black uppercase tracking-widest text-[#6a675d]">{t("scoreboard")}</p>
        </div>
        <div className="space-y-2 px-1 pb-1">
          {sorted.map((name, i) => (
            <div key={name} className={`flex items-center justify-between p-4 rounded-2xl shadow-sm ${
              i === 0 ? 'bg-[#fcf1d7] border-2 border-[#dca843]' : 'bg-white border-2 border-[#e6e2d6]'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-black w-6 text-center ${i === 0 ? 'text-[#dca843]' : 'text-[#a9a69b]'}`}>
                  {i + 1}
                </span>
                <span className={`text-base font-black ${i === 0 ? 'text-[#dca843]' : 'text-[#2b2a26]'}`}>{name}</span>
                {name === imposterName && (
                  <span className="text-[10px] px-2 py-1 rounded bg-[#c95c4e]/20 text-[#a84d41] font-black">IMP</span>
                )}
              </div>
              <span className={`text-sm font-black ${i === 0 ? 'text-[#dca843]' : 'text-[#6a675d]'}`}>
                {scores[name] || 0} {t("pts")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {isLastRound ? (
          <button onClick={onFinalResults} className="btn-primary text-base">
            <Trophy className="w-5 h-5" /> {t("finalResults")}
          </button>
        ) : (
          <>
            <button onClick={onNextRound} className="btn-primary text-base flex justify-center items-center gap-2">
              {lang === 'ar' ? <ChevronRight className="w-6 h-6 rotate-180" /> : null}
              {t("nextRound")} 
              {lang === 'en' ? <ChevronRight className="w-6 h-6" /> : null}
            </button>
            <button onClick={onChangeCategory} className="btn-ghost text-sm">
              {t("changeCategory")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
