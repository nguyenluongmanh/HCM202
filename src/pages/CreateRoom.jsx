import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { roomService } from '../services/roomService';
import { soundManager } from '../utils/audio';

export default function CreateRoom({ playerName, avatar, onRoomCreated, onBackHome }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = async () => {
    soundManager.playClick();
    setLoading(true);
    setErrorMsg('');

    try {
      const room = await roomService.createRoom({
        name: playerName || 'Chủ phòng',
        avatar: avatar || '🎋'
      });
      onRoomCreated(room);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể kết nối đến máy chủ.');
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
          <span className="text-4xl block mb-2">🎋</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            TẠO PHÒNG THI ĐẤU
          </h2>
          <p className="text-emerald-300 text-xs sm:text-sm mt-1">
            Khởi tạo phòng đấu nhiều người chơi và mời bạn bè tham gia
          </p>
        </div>

        {/* Player preview card */}
        <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-500/50 flex items-center justify-center text-2xl shadow">
            {avatar}
          </div>
          <div className="text-left">
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
              CHỦ PHÒNG
            </span>
            <span className="text-base font-bold text-white">
              {playerName || 'Chủ phòng'}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-900/50 border border-rose-500 text-rose-200 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tạo phòng...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>TẠO MÃ PHÒNG</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
