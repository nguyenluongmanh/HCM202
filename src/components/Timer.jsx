import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Timer({ secondsRemaining = 180 }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Sound alert on 10s countdown
  useEffect(() => {
    if (secondsRemaining <= 10 && secondsRemaining > 0) {
      soundManager.playCountdownTick();
    }
  }, [secondsRemaining]);

  // Color & alert status styling
  let containerStyle = 'bg-emerald-900/80 border-emerald-600/50 text-emerald-200';
  let badgeText = null;
  let isPulsing = false;

  if (secondsRemaining <= 0) {
    containerStyle = 'bg-red-950/95 border-red-500 text-red-200 font-extrabold';
    badgeText = 'HẾT GIỜ!';
  } else if (secondsRemaining <= 10) {
    containerStyle = 'bg-red-900/90 border-red-500 text-white font-extrabold shadow-red-500/50 shadow-lg';
    badgeText = 'SẮP HẾT GIỜ!';
    isPulsing = true;
  } else if (secondsRemaining <= 30) {
    containerStyle = 'bg-orange-950/90 border-orange-500 text-orange-200 shadow-orange-500/30 shadow-md';
    badgeText = 'CÒN 30 GIÂY!';
    isPulsing = true;
  } else if (secondsRemaining <= 60) {
    containerStyle = 'bg-amber-950/80 border-amber-500 text-amber-200';
    badgeText = 'CÒN 1 PHÚT';
  }

  return (
    <div
      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border transition-all duration-300 flex items-center gap-2 sm:gap-2.5 backdrop-blur-md shadow-md ${containerStyle} ${
        isPulsing ? 'animate-pulse' : ''
      }`}
    >
      <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${secondsRemaining <= 30 ? 'text-orange-400 animate-spin' : 'text-emerald-400'}`} />
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
          THỜI GIAN
        </span>
        <span className="text-base sm:text-xl font-black font-mono tracking-tight">
          {secondsRemaining <= 0 ? '00:00' : formatted}
        </span>
      </div>
      {badgeText && (
        <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 uppercase tracking-tight hidden xs:inline">
          {badgeText}
        </span>
      )}
    </div>
  );
}
