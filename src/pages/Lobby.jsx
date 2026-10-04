import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Play, LogOut, Crown, Sparkles } from 'lucide-react';
import PlayerList from '../components/PlayerList';
import SoundToggle from '../components/SoundToggle';
import { roomService } from '../services/roomService';
import { soundManager } from '../utils/audio';

export default function Lobby({ room, onStartGame, onLeaveRoom }) {
  const [currentRoom, setCurrentRoom] = useState(room);
  const [copied, setCopied] = useState(false);
  const socketId = roomService.getSocketId();

  const isHost = currentRoom?.hostId === socketId || currentRoom?.players?.find(p => p.id === socketId)?.isHost;

  useEffect(() => {
    // Listen for room updates from server
    const unsubUpdate = roomService.on('roomUpdated', (updatedRoom) => {
      setCurrentRoom(updatedRoom);
    });

    const unsubStart = roomService.on('gameStarted', (data) => {
      soundManager.playGameStart();
      onStartGame(data);
    });

    return () => {
      unsubUpdate();
      unsubStart();
    };
  }, [onStartGame]);

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(currentRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHostStart = () => {
    soundManager.playClick();
    soundManager.playGameStart();
    roomService.startGame(currentRoom.code);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎋</span>
          <span className="font-extrabold text-sm sm:text-base tracking-wider text-emerald-300 uppercase">
            PHÒNG CHỜ THI ĐẤU
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={() => {
              soundManager.playClick();
              roomService.leaveRoom(currentRoom.code);
              onLeaveRoom();
            }}
            className="p-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Rời phòng</span>
          </button>
        </div>
      </header>

      {/* Main Lobby Box */}
      <main className="w-full max-w-lg bg-emerald-950/85 backdrop-blur-md border border-emerald-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        {/* Room Code Display */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            MÃ PHÒNG CHIA SẺ
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-amber-300 drop-shadow">
              {currentRoom.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-3 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white border border-emerald-600 transition shadow active:scale-95 cursor-pointer"
              title="Sao chép mã phòng"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-emerald-400/80">
            Gửi mã này cho bạn bè để cùng tham gia tranh tài!
          </p>
        </div>

        {/* Players List Header */}
        <div className="pt-2 border-t border-emerald-800/80">
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Thí sinh đã vào phòng ({currentRoom.players?.length || 0})</span>
            </span>
          </div>

          {/* Player Cards */}
          <PlayerList
            players={currentRoom.players || []}
            currentUserId={socketId}
            isLiveGame={false}
          />
        </div>

        {/* Host Start or Waiting Status */}
        <div className="pt-2">
          {isHost ? (
            <div className="space-y-2 text-center">
              <button
                onClick={handleHostStart}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-slate-950" />
                <span>BẮT ĐẦU TRẬN ĐẤU (180 GIÂY)</span>
              </button>
              <p className="text-[11px] text-emerald-400/80">
                Bạn là Chủ phòng. Bấm bắt đầu khi tất cả thí sinh đã sẵn sàng!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
                <Crown className="w-4 h-4 animate-bounce" />
                <span>Đang chờ Chủ phòng bắt đầu trận đấu...</span>
              </div>
              <p className="text-xs text-emerald-300/80">
                Chuẩn bị sẵn sàng! Trận đấu sẽ diễn ra trong 3 phút ngay khi bắt đầu.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-emerald-400/60 py-4">
        Mỗi câu hỏi 20s • Trả lời càng nhanh càng nhiều đốt tre!
      </footer>
    </div>
  );
}
