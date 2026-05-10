import { Fingerprint } from 'lucide-react';

export default function PassScreen({ playerName, onReveal }) {
  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="glass-card-strong p-8 w-full max-w-sm">
        <p className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">Pass the phone to</p>
        <h1 className="text-3xl font-bold text-white mb-8">{playerName}</h1>
        <button
          onClick={onReveal}
          className="btn-primary text-base w-full flex flex-col items-center gap-3 py-6"
        >
          <Fingerprint className="w-10 h-10" />
          <span>Tap to Reveal</span>
        </button>
        <p className="text-zinc-600 text-xs mt-4">Only {playerName} should see the screen</p>
      </div>
    </div>
  );
}
