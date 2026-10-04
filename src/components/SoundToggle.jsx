import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function SoundToggle({ className = '' }) {
  const [muted, setMuted] = useState(soundManager.isMuted());

  const handleToggle = () => {
    const next = soundManager.toggleMute();
    setMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5 text-sm ${className}`}
      title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
    >
      {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
      <span className="hidden sm:inline font-medium">{muted ? 'Tắt âm' : 'Âm thanh'}</span>
    </button>
  );
}
