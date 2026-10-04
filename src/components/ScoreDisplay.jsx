import React from 'react';
import { Award, Zap } from 'lucide-react';

export default function ScoreDisplay({ totalSegments = 0, currentRank = 1, totalPlayers = 1 }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Bamboo Segments Badge */}
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-emerald-900/80 border border-emerald-600/50 backdrop-blur-md shadow-md flex items-center gap-2 text-emerald-200">
        <span className="text-lg sm:text-xl">🌿</span>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-emerald-300">
            ĐỐT TRE
          </span>
          <span className="text-base sm:text-xl font-black text-amber-300 font-mono">
            {totalSegments}
          </span>
        </div>
      </div>

      {/* Rank Badge */}
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-teal-900/80 border border-teal-600/50 backdrop-blur-md shadow-md flex items-center gap-2 text-teal-200">
        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-teal-300">
            HẠNG
          </span>
          <span className="text-base sm:text-xl font-black text-white font-mono">
            #{currentRank}
            {totalPlayers > 1 && <span className="text-xs font-normal text-teal-400">/{totalPlayers}</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
