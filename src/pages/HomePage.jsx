import React, { useState } from 'react';
import { Play, PlusCircle, LogIn, Trophy, HelpCircle, User, Sparkles } from 'lucide-react';
import SoundToggle from '../components/SoundToggle';
import { soundManager } from '../utils/audio';

const AVATARS = ['🎋', '🌿', '🌱', '🎍', '🍃', '🌾', '👨‍🎓', '👩‍🎓'];

export default function HomePage({
  playerName,
  setPlayerName,
  avatar,
  setAvatar,
  onStartSolo,
  onGoCreateRoom,
  onGoJoinRoom,
  onGoLeaderboard,
  onOpenHowToPlay
}) {
  const [nameInput, setNameInput] = useState(playerName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(avatar || '🎋');
  const [validationError, setValidationError] = useState('');

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
    setPlayerName(e.target.value);
    setValidationError('');
  };

  const handleSelectAvatar = (av) => {
    soundManager.playClick();
    setSelectedAvatar(av);
    setAvatar(av);
  };

  const validateAndProceed = (actionCallback) => {
    const finalName = nameInput.trim() || 'Thí sinh';
    setPlayerName(finalName);
    soundManager.playClick();
    actionCallback(finalName, selectedAvatar);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
      {/* Background Vietnamese bamboo grove aura */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-teal-600 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl animate-bounce">🎋</span>
          <span className="font-extrabold text-sm sm:text-base tracking-wider text-emerald-300 uppercase">
            HCM202 • CHƯƠNG V
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowToPlay();
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition flex items-center gap-1.5 text-xs sm:text-sm font-semibold shadow"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="hidden sm:inline">Luật chơi</span>
          </button>
          <SoundToggle />
        </div>
      </header>

      {/* Main Center Card */}
      <main className="w-full max-w-lg z-10 my-auto flex flex-col items-center text-center">
        {/* Hero Title */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-emerald-300 text-xs sm:text-sm font-semibold mb-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Game Quiz Multiplayer Trắc Nghiệm</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300 tracking-tight drop-shadow-md">
            TRE ĐOÀN KẾT
          </h1>

          <p className="text-sm sm:text-base text-emerald-200/90 max-w-md mx-auto font-medium leading-relaxed">
            Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế
          </p>
        </div>

        {/* Player Profile Setup Box */}
        <div className="w-full bg-emerald-950/80 backdrop-blur-md border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-left">
          {/* Nickname field */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Biệt danh của bạn</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={handleNameChange}
              placeholder="Nhập họ tên hoặc nickname..."
              maxLength={25}
              className="w-full px-4 py-3 rounded-2xl bg-emerald-900/90 border border-emerald-600/70 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-white placeholder-emerald-400/50 text-sm sm:text-base font-semibold shadow-inner"
            />
            {validationError && (
              <p className="text-rose-400 text-xs mt-1.5 font-medium">{validationError}</p>
            )}
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-emerald-300 mb-2 uppercase tracking-wider">
              Chọn biểu tượng tre / đại diện
            </label>
            <div className="flex items-center justify-between gap-1.5 bg-emerald-900/50 p-2 rounded-2xl border border-emerald-800">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xl sm:text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-emerald-500 scale-110 shadow-lg ring-2 ring-emerald-300 shadow-emerald-500/50'
                      : 'hover:bg-emerald-800/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Button Grid */}
          <div className="space-y-3 pt-2">
            {/* Solo Practice */}
            <button
              onClick={() => validateAndProceed(onStartSolo)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>CHƠI NGAY (LUYỆN TẬP 3 PHÚT)</span>
            </button>

            {/* Multiplayer row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => validateAndProceed(onGoCreateRoom)}
                className="py-3 px-3 sm:px-4 rounded-2xl bg-teal-900/80 hover:bg-teal-800/90 border border-teal-600/70 text-teal-100 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-teal-300" />
                <span>TẠO PHÒNG</span>
              </button>

              <button
                onClick={() => validateAndProceed(onGoJoinRoom)}
                className="py-3 px-3 sm:px-4 rounded-2xl bg-cyan-900/80 hover:bg-cyan-800/90 border border-cyan-600/70 text-cyan-100 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-cyan-300" />
                <span>VÀO PHÒNG</span>
              </button>
            </div>

            {/* Global Leaderboard Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onGoLeaderboard();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-amber-950/60 hover:bg-amber-900/70 border border-amber-600/50 text-amber-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow active:scale-95 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>BẢNG VÀNG TRE VIỆT NAM (TOP ĐIỂM)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-emerald-400/60 py-4 z-10">
        TRE ĐOÀN KẾT • Đề tài Tư tưởng Hồ Chí Minh • 50 Câu hỏi trắc nghiệm chuẩn PDF
      </footer>
    </div>
  );
}
