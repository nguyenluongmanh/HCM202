import React from 'react';
import { Crown, User, CheckCircle2 } from 'lucide-react';

export default function PlayerList({
  players = [],
  currentUserId,
  isLiveGame = false,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {players.map((p, index) => {
        const isSelf = p.id === currentUserId;
        const rank = p.rank || index + 1;

        let rankBadge = `${rank}`;
        let rankColor = 'bg-emerald-950 text-emerald-300 border-emerald-700';

        if (rank === 1) {
          rankBadge = '🥇';
          rankColor = 'bg-amber-500/20 text-amber-300 border-amber-400';
        } else if (rank === 2) {
          rankBadge = '🥈';
          rankColor = 'bg-slate-400/20 text-slate-200 border-slate-300';
        } else if (rank === 3) {
          rankBadge = '🥉';
          rankColor = 'bg-amber-700/20 text-amber-500 border-amber-600';
        }

        return (
          <div
            key={p.id || index}
            className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
              isSelf
                ? 'bg-emerald-800/80 border-emerald-400 shadow-md shadow-emerald-950/60 ring-2 ring-emerald-400/30'
                : 'bg-emerald-950/60 border-emerald-800/60 hover:bg-emerald-900/40 text-slate-200'
            }`}
          >
            {/* Left: Avatar + Name + Host badge */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Rank if live game */}
              {isLiveGame && (
                <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${rankColor}`}>
                  {rankBadge}
                </span>
              )}

              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-emerald-900/90 border border-emerald-600/50 flex items-center justify-center text-lg shrink-0">
                {p.avatar || '🎋'}
              </div>

              {/* Name & tags */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-bold text-sm text-white truncate max-w-[130px] sm:max-w-[160px]">
                    {p.name}
                  </span>
                  {isSelf && (
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-semibold shrink-0">
                      Bạn
                    </span>
                  )}
                </div>

                {p.isHost && (
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                    <Crown className="w-3 h-3" /> Chủ phòng
                  </span>
                )}
              </div>
            </div>

            {/* Right: Segments stats or ready state */}
            {isLiveGame ? (
              <div className="flex flex-col items-end shrink-0 leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-sm">🎋</span>
                  <span className="text-base font-black text-amber-300 font-mono">
                    {p.totalSegments || 0}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">đốt</span>
                </div>
                <span className="text-[11px] text-emerald-400/70 mt-1">
                  {p.correctAnswers || 0} câu đúng
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sẵn sàng</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
