import { useState } from 'react';
import { Users, Lock, User, Check, ChevronRight, ChevronLeft } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-full px-6 animate-fadeIn bg-[var(--color-paper-bg)] relative">
        <div className="paper-card p-10 text-center w-full max-w-sm rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-sm">
          <p className="text-[#718096] text-sm font-black uppercase tracking-widest mb-4">
            {lang === 'ar' ? 'مرحلة التصويت' : 'Voting Phase'}
          </p>
          <h1 className="text-3xl font-black text-[#2d3748]">
            {lang === 'ar' ? 'مرّر الهاتف إلى' : 'Pass phone to'}
          </h1>
          <h2 className="text-4xl font-black text-[#83a373] mt-4 mb-8">
            {voterName}
          </h2>
          <button 
            onClick={() => setPassScreen(false)} 
            className="btn-primary p-2 w-full"
          >
            <div className="paper-strip w-full py-2 px-12 text-lg font-black border-none shadow-sm flex items-center justify-center h-full">
              {lang === 'ar' ? `أنا ${voterName}` : `I am ${voterName}`}
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 animate-scaleIn bg-[var(--color-paper-bg)] relative">
        <div className="paper-card p-10 text-center w-full max-w-sm rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-sm border border-[#e2dfd3]">
          <Lock className="w-14 h-14 text-[#83a373] mx-auto mb-5" />
          <h1 className="text-2xl font-black text-[#2d3748]">
            {lang === 'ar' ? 'تم قفل التصويت' : 'Vote Locked'}
          </h1>
          <p className="text-[#718096] mt-3 font-bold">
            {lang === 'ar' ? 'مرّر الهاتف للاعب التالي' : 'Pass to next player'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn flex flex-col h-full bg-[var(--color-paper-bg)] relative">
      
      {/* Top Header Label */}
      <div className="pt-8 mb-6 relative z-10 flex justify-center">
        <div className="bg-[#83a373] text-white px-6 py-3 rounded-xl shadow-md torn-top relative flex justify-center items-center">
          <div className="paper-strip">
            <span className="font-black text-lg text-center leading-tight">
              {lang === 'ar' ? 'صوّت: من هو الإمبوستر؟' : 'Vote: Who is the Imposter?'}
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#83a373] to-transparent opacity-50 blur-[2px]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col">
        <div className="text-center mb-6">
          <p className="text-[#83a373] text-sm font-black uppercase tracking-widest mb-2">
            {t("player")} {currentVoterIdx + 1} {t("of")} {players.length}
          </p>
          <h1 className="text-xl font-bold text-[#2d3748]">
            <span className="text-[#83a373]">{voterName}</span>, {lang === 'ar' ? 'صوّت الآن' : 'cast your vote'}
          </h1>
        </div>

        <div className="flex-1 space-y-3 mb-6 px-1">
          {options.map((name) => (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`w-full p-4 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] text-left font-bold transition-all shadow-sm flex items-center justify-between ${
                selected === name 
                  ? 'bg-[#e6edd8] border-2 border-[#83a373] text-[#2d3748]' 
                  : 'bg-white border-2 border-[#e2dfd3] text-[#2d3748] hover:bg-[#faf9f6]'
              }`}
            >
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-[#718096]" />
                <span className="text-lg">{name}</span>
              </div>
              
              {/* Radio Circle */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected === name ? 'border-[#83a373] bg-[#83a373]' : 'border-[#d1ccba] bg-transparent'}`}>
                {selected === name && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>

        {/* Start Vote Button */}
        <div className="mt-auto flex justify-center">
          <button
            onClick={handleVote}
            disabled={!selected}
            className="btn-primary p-2 w-full max-w-xs"
          >
            <div className="paper-strip w-full py-2 px-10 text-lg border-none shadow-sm flex items-center justify-center gap-2 h-full">
              {lang === 'ar' ? 'بدء التصويت' : 'Submit Vote'} <Vote className="w-5 h-5 inline" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
