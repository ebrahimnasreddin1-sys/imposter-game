import { Fingerprint } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PassScreen({ playerName, onReveal }) {
  const { t } = useLanguage();
  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full px-6 text-center relative">
      <div className="paper-card-strong p-8 w-full max-w-sm torn-top">
        <p className="text-[#6a675d] text-sm font-black mb-2 uppercase tracking-widest">{t("passThePhoneTo")}</p>
        <h1 className="text-4xl font-black text-[#2b2a26] mb-8">{playerName}</h1>
        <button
          onClick={onReveal}
          className="btn-primary text-base w-full flex flex-col items-center gap-3 py-6"
        >
          <Fingerprint className="w-10 h-10" />
          <span>{t("tapToReveal")}</span>
        </button>
        <p className="text-[#a9a69b] text-xs mt-4 font-bold">{t("onlyShouldSeeScreen").replace("{{name}}", playerName)}</p>
      </div>
    </div>
  );
}
