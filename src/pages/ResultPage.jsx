import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import BambooTree from '../components/BambooTree';
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw, Home, Award, Sparkles } from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import { soundManager } from '../utils/audio';

export default function ResultPage({
  resultData,
  onPlayAgain,
  onGoLeaderboard,
  onGoHome
}) {
  const {
    playerName = 'Người chơi',
    totalSegments = 0,
    correctAnswers = 0,
    wrongAnswers = 0,
    timeoutAnswers = 0,
    totalQuestionsAnswered = 0,
    rank = 1,
    isMultiplayer = false,
    players = []
  } = resultData || {};

  // Fire celebratory confetti on mount
  useEffect(() => {
    soundManager.playGameOver();

    // Save score to Global Leaderboard
    leaderboardService.saveRecord({
      username: playerName,
      highestSegments: totalSegments,
      correctAnswers,
      gamesPlayed: 1
    });

    // Confetti cannon
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [playerName, totalSegments, correctAnswers]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
      {/* Result Card */}
      <main className="w-full max-w-2xl bg-emerald-950/85 backdrop-blur-md border border-emerald-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto text-center">
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KẾT THÚC TRẬN ĐẤU (3 PHÚT)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 uppercase tracking-tight">
            🎉 GAME OVER 🎉
          </h1>
          <p className="text-sm text-emerald-200">
            Cảm ơn bạn đã tham gia học tập Tư tưởng Hồ Chí Minh!
          </p>
        </div>

        {/* Center Bamboo Tree + Stats Grid */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
          {/* Bamboo Tree Showcase */}
          <div className="w-48 h-64 shrink-0 flex items-center justify-center">
            <BambooTree segments={totalSegments} maxHeight="240px" />
          </div>

          {/* Detailed Statistics */}
          <div className="flex-1 w-full space-y-3 text-left">
            {/* Height Badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-900/80 border border-emerald-600/70 flex items-center justify-between shadow">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                🌿 CHIỀU CAO CÂY TRE
              </span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {totalSegments} <span className="text-xs font-bold text-emerald-200 uppercase">ĐỐT</span>
              </span>
            </div>

            {/* Rank Badge */}
            {isMultiplayer && (
              <div className="p-3.5 rounded-2xl bg-teal-900/80 border border-teal-600/70 flex items-center justify-between shadow">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>THỨ HẠNG TRẬN ĐẤU</span>
                </span>
                <span className="text-xl font-black text-white font-mono">
                  #{rank}
                </span>
              </div>
            )}

            {/* Correct count */}
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-sm">
              <span className="text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Số câu trả lời đúng</span>
              </span>
              <span className="font-black text-emerald-300 font-mono text-base">
                {correctAnswers}
              </span>
            </div>

            {/* Wrong count */}
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-sm">
              <span className="text-rose-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Số câu trả lời sai</span>
              </span>
              <span className="font-black text-rose-300 font-mono text-base">
                {wrongAnswers}
              </span>
            </div>

            {/* Timeout count */}
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-sm">
              <span className="text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Số câu hết giờ (20s)</span>
              </span>
              <span className="font-black text-amber-300 font-mono text-base">
                {timeoutAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons (Section 13) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CHƠI LẠI</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoLeaderboard();
            }}
            className="py-3.5 px-4 rounded-2xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/70 text-amber-200 font-bold text-sm shadow transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>BẢNG XẾP HẠNG</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="py-3.5 px-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 font-bold text-sm shadow transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>VỀ TRANG CHỦ</span>
          </button>
        </div>
      </main>
    </div>
  );
}
