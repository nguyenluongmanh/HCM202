import React, { useState } from 'react';
import { ArrowLeft, LogIn, Loader2, KeyRound } from 'lucide-react';
import { roomService } from '../services/roomService';
import { soundManager } from '../utils/audio';

export default function JoinRoom({ playerName, avatar, onRoomJoined, onBackHome }) {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoin = async (e) => {
    e?.preventDefault();
    if (!roomCode.trim()) {
      setErrorMsg('Vui lòng nhập mã phòng!');
      return;
    }

    soundManager.playClick();
    setLoading(true);
    setErrorMsg('');

    try {
      const room = await roomService.joinRoom(roomCode.trim(), {
        name: playerName || 'Người chơi',
        avatar: avatar || '🌿'
      });
      onRoomJoined(room);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể tham gia phòng. Vui lòng kiểm tra mã!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-950/85 backdrop-blur-md border border-emerald-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Back button */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackHome();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>

        <div>
          <span className="text-4xl block mb-2">🚪</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            THAM GIA PHÒNG
          </h2>
          <p className="text-emerald-300 text-xs sm:text-sm mt-1">
            Nhập mã phòng 5 ký tự do chủ phòng cung cấp
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Mã phòng</span>
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="VD: A7K92"
              maxLength={6}
              className="w-full px-4 py-3.5 rounded-2xl bg-emerald-900/90 border-2 border-emerald-600 focus:border-amber-400 focus:outline-none text-center text-white placeholder-emerald-500/50 text-2xl font-black tracking-widest uppercase font-mono shadow-inner"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-900/50 border border-rose-500 text-rose-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang kết nối...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>VÀO PHÒNG NGAY</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
