import { useState } from 'react';
import { Users, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function VotingScreen({ players, currentVoterIdx, onVote }) {
  const { t, lang } = useLanguage();
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
      <div className="flex flex-col items-center justify-center h-full px-6 animate-fadeIn relative">
        {/* Decorative background doodles could go here */}
        <div className="text-center mb-10">
          <p className="text-[#6a675d] text-sm font-black uppercase tracking-widest mb-3">{t("votingPhase")}</p>
          <h1 className="text-4xl font-black text-[#2b2a26]">{t("passDeviceTo")}</h1>
          <h2 className="text-5xl font-black text-[#718d53] mt-4">{voterName}</h2>
        </div>
        <button onClick={() => setPassScreen(false)} className="btn-primary py-4 px-12 text-lg font-black shadow-md w-auto">
          {t("iAm")} {voterName}
        </button>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn">
        <div className="paper-card-strong p-10 text-center w-full max-w-sm torn-top">
          <Lock className="w-14 h-14 text-[#718d53] mx-auto mb-5" />
          <h1 className="text-3xl font-black text-[#2b2a26]">{t("voteLocked")}</h1>
          <p className="text-[#6a675d] mt-3 font-bold">{t("passToNextPlayer")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 relative">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#718d53]/10 border border-[#718d53]/20 mb-4 animate-paperFloat">
          <Users className="w-8 h-8 text-[#718d53]" />
        </div>
        <p className="text-[#718d53] text-sm font-black uppercase tracking-widest mb-2">
          {t("player")} {currentVoterIdx + 1} {t("of")} {players.length}
        </p>
        <h1 className="text-2xl font-black text-[#2b2a26]">{voterName}, {t("castYourVote")}</h1>
        <p className="text-[#6a675d] text-sm mt-2 font-bold">{t("whoDoYouThink")}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6 px-1">
        {options.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`w-full p-4 rounded-xl text-left font-black transition-all shadow-sm ${
              selected === name 
                ? 'bg-[#c95c4e]/10 border-2 border-[#c95c4e] text-[#a84d41]' 
                : 'bg-white border-2 border-[#e6e2d6] text-[#2b2a26] hover:bg-[#faf9f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === name ? 'border-[#c95c4e]' : 'border-[#d2cdbc]'}`}>
                {selected === name && <div className="w-2.5 h-2.5 rounded-full bg-[#c95c4e]" />}
              </div>
              {name}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!selected}
        className="btn-primary py-4 text-lg disabled:opacity-50 disabled:active:scale-100"
      >
        {t("lockVote")}
      </button>
    </div>
  );
}
