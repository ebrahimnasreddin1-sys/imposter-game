import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/characters';
import { getEnabledCharacters, saveEnabledCharacters } from '../utils/gameLogic';
import { ArrowLeft, Check, CheckSquare, Square, Save } from 'lucide-react';

export default function CategorySettingsScreen({ category, onBack }) {
  const [enabledChars, setEnabledChars] = useState([]);
  const [error, setError] = useState('');

  const allChars = CATEGORIES[category] || [];

  useEffect(() => {
    setEnabledChars(getEnabledCharacters(category));
  }, [category]);

  const handleToggle = (charName) => {
    setEnabledChars(prev => {
      if (prev.includes(charName)) {
        return prev.filter(name => name !== charName);
      } else {
        return [...prev, charName];
      }
    });
  };

  const handleSelectAll = () => {
    setEnabledChars(allChars.map(c => c.name));
    setError('');
  };

  const handleDeselectAll = () => {
    setEnabledChars([]);
  };

  const handleSave = () => {
    if (enabledChars.length < 7) {
      setError('You must enable at least 7 characters.');
      return;
    }
    saveEnabledCharacters(category, enabledChars);
    onBack();
  };

  return (
    <div className="animate-fadeIn flex flex-col h-full px-4 pt-6 pb-6 bg-zinc-950 absolute inset-0 z-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 text-zinc-400 active:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center pr-10">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">{category}</p>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button onClick={handleSelectAll} className="flex-1 py-2 bg-white/[0.05] rounded-lg text-sm text-white font-semibold active:bg-white/[0.1]">
          Select All
        </button>
        <button onClick={handleDeselectAll} className="flex-1 py-2 bg-white/[0.05] rounded-lg text-sm text-zinc-400 font-semibold active:bg-white/[0.1]">
          Deselect All
        </button>
      </div>

      <div className="text-zinc-500 text-xs mb-3 flex justify-between">
        <span>Enabled: {enabledChars.length}/{allChars.length}</span>
        <span>Min: 7</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-6 pr-2">
        {allChars.map((char) => {
          const isEnabled = enabledChars.includes(char.name);
          return (
            <button
              key={char.name}
              onClick={() => handleToggle(char.name)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                isEnabled ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/[0.03] border border-white/[0.05]'
              }`}
            >
              <span className={`text-sm font-semibold ${isEnabled ? 'text-cyan-400' : 'text-zinc-500'}`}>
                {char.name}
              </span>
              {isEnabled ? (
                <CheckSquare className="w-5 h-5 text-cyan-400" />
              ) : (
                <Square className="w-5 h-5 text-zinc-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="btn-primary py-4 text-base">
        <Save className="w-5 h-5" /> Save Settings
      </button>
    </div>
  );
}
