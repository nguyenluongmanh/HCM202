import React, { useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

export default function BambooTree({ segments = 0, recentGrowth = 0, maxHeight = '100%' }) {
  const containerRef = useRef(null);
  const prevSegmentsRef = useRef(segments);

  // Play growing sound effect when segments increase
  useEffect(() => {
    if (segments > prevSegmentsRef.current) {
      soundManager.playBambooGrow();
    }
    prevSegmentsRef.current = segments;

    // Auto-scroll to top of bamboo to keep newest segment visible
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [segments]);

  // Generate segment elements from top (newest) to bottom (oldest)
  const segmentItems = [];
  for (let i = segments; i >= 1; i--) {
    const isRecent = i > segments - recentGrowth;
    const hasBranchLeft = i % 4 === 1;
    const hasBranchRight = i % 4 === 3;
    const segmentHeightPx = 28; // height of each segment

    segmentItems.push(
      <div
        key={`seg-${i}`}
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isRecent ? 'animate-bamboo-grow' : ''
        }`}
        style={{ height: `${segmentHeightPx}px` }}
      >
        {/* Left branch */}
        {hasBranchLeft && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 pr-0.5 pointer-events-none animate-leaf-sway">
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path d="M28 9 C18 7 10 3 0 0 C4 6 12 11 28 10 Z" fill="#4ade80" />
              <path d="M28 9 C18 10 12 14 2 17 C8 15 16 12 28 10 Z" fill="#22c55e" />
            </svg>
          </div>
        )}

        {/* Bamboo Node Body */}
        <div className="w-9 h-full rounded-sm bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-700 shadow-md border-x border-emerald-800 relative flex items-center justify-center">
          {/* Vertical bamboo fibers texture */}
          <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />

          {/* Segment number index */}
          <span className="text-[10px] font-bold text-emerald-950/70 select-none z-10">
            {i}
          </span>

          {/* Node ring (Joint ring between segments) */}
          <div className="absolute -bottom-1 left-[-2px] right-[-2px] h-[5px] bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-full shadow-sm border-t border-b border-amber-900 z-10" />
        </div>

        {/* Right branch */}
        {hasBranchRight && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 pl-0.5 pointer-events-none animate-leaf-sway" style={{ animationDelay: '0.8s' }}>
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path d="M0 9 C10 7 18 3 28 0 C24 6 16 11 0 10 Z" fill="#4ade80" />
              <path d="M0 9 C10 10 16 14 26 17 C20 15 12 12 0 10 Z" fill="#22c55e" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full w-full max-w-[260px] bg-emerald-950/60 rounded-2xl border border-emerald-800/60 p-3 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background bamboo forest subtle atmosphere */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-300 via-emerald-800 to-transparent pointer-events-none" />

      {/* Header with Height Stat */}
      <div className="z-20 w-full text-center pb-2 border-b border-emerald-800/70 mb-2">
        <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center gap-1">
          <span>🌿</span> CÂY TRE CỦA BẠN
        </div>
        <div className="text-2xl font-black text-amber-300 drop-shadow-sm flex items-center justify-center gap-1.5 mt-0.5">
          <span>{segments}</span>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-normal">Đốt Tre</span>
        </div>
        <div className="text-[11px] text-emerald-400/80 font-medium">
          ~ {(segments * 0.12).toFixed(1)} mét
        </div>
      </div>

      {/* Scrollable Bamboo Column */}
      <div
        ref={containerRef}
        className="flex-1 w-full flex flex-col items-center justify-start overflow-y-auto px-4 py-2 scroll-smooth"
        style={{ maxHeight }}
      >
        {/* Crown of Bamboo (Leaf top) */}
        <div className="mb-0 flex flex-col items-center pointer-events-none z-10">
          <span className="text-3xl filter drop-shadow animate-pulse" title="Ngọn tre">🎋</span>
          <div className="w-5 h-3 bg-emerald-500 rounded-t-full -mt-1 border-t border-emerald-300" />
        </div>

        {/* Stacked Segments */}
        {segments > 0 ? (
          <div className="flex flex-col items-center w-full">
            {segmentItems}
          </div>
        ) : (
          <div className="my-auto text-center py-6 px-2 text-emerald-300/80">
            <span className="text-4xl block mb-2 animate-bounce">🌱</span>
            <p className="text-xs font-medium">Chưa có đốt tre nào.</p>
            <p className="text-[11px] text-emerald-400/70 mt-1">Trả lời đúng để nuôi dưỡng cây tre!</p>
          </div>
        )}

        {/* Base / Soil Mound & Roots */}
        <div className="mt-0 flex flex-col items-center w-full pt-1 pointer-events-none z-10">
          <div className="w-16 h-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-t-full border-t-2 border-amber-600 shadow-md flex items-center justify-center">
            <span className="text-[11px]">🌱</span>
          </div>
          <div className="w-24 h-2 bg-emerald-950/80 rounded-full blur-[1px] mt-0.5" />
          <span className="text-[10px] text-emerald-400/70 font-semibold mt-1">Gốc Tre Đoàn Kết</span>
        </div>
      </div>
    </div>
  );
}
