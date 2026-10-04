import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, Globe, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import { soundManager } from '../utils/audio';

export default function Leaderboard({ roomPlayers = [], onBackHome }) {
  const [activeTab, setActiveTab] = useState(roomPlayers.length > 0 ? 'room' : 'global');
  const [globalList, setGlobalList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    fetchGlobalLeaderboard(limit);
  }, [limit]);

  const fetchGlobalLeaderboard = async (lim) => {
    setLoading(true);
    try {
      const data = await leaderboardService.getGlobalLeaderboard(lim);
      setGlobalList(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa và đặt lại toàn bộ dữ liệu bảng xếp hạng không?')) {
      soundManager.playClick();
      await leaderboardService.resetLeaderboard();
      setGlobalList([]);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center font-black text-base shadow">
          🥇
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300 flex items-center justify-center font-black text-base shadow">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-700/20 text-amber-500 border border-amber-600 flex items-center justify-center font-black text-base shadow">
          🥉
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-xl bg-emerald-950/70 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-sm">
        #{rank}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Header */}
      <header className="w-full max-w-3xl flex items-center justify-between pb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackHome();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Về Trang Chủ
        </button>

        <div className="flex items-center gap-2">
          {activeTab === 'global' && (
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-semibold transition cursor-pointer active:scale-95"
              title="Đặt lại bảng điểm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset BXH</span>
            </button>
          )}
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider hidden sm:inline">
            BẢNG VÀNG THÀNH TÍCH
          </span>
        </div>
      </header>

      {/* Main Board */}
      <main className="w-full max-w-3xl bg-emerald-950/85 backdrop-blur-md border border-emerald-700/70 rounded-3xl p-5 sm:p-8 shadow-2xl flex-1 flex flex-col my-auto">
        {/* Title */}
        <div className="text-center mb-5">
          <span className="text-4xl block mb-1">🏆</span>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200 uppercase tracking-tight">
            BẢNG XẾP HẠNG TRE ĐOÀN KẾT
          </h1>
          <p className="text-xs sm:text-sm text-emerald-300 mt-1">
            Vinh danh những người chơi có cây tre cao nhất
          </p>
          {resetSuccess && (
            <div className="mt-2 text-xs font-semibold text-emerald-300 bg-emerald-900/60 py-1 px-3 rounded-full inline-block border border-emerald-500">
              ✓ Đã reset bảng xếp hạng thành công!
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {roomPlayers.length > 0 && (
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('room');
              }}
              className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'room'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Phòng Đấu Vừa Rồi</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('global');
            }}
            className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'global'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Top Tre Toàn Hệ Thống</span>
          </button>
        </div>

        {/* Filter buttons if Global tab */}
        {activeTab === 'global' && globalList.length > 0 && (
          <div className="flex items-center justify-end gap-1.5 mb-3 text-xs">
            <span className="text-emerald-400 font-semibold mr-1">Hiển thị:</span>
            {[10, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => {
                  soundManager.playClick();
                  setLimit(num);
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
                  limit === num
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-emerald-900/70 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                Top {num}
              </button>
            ))}
          </div>
        )}

        {/* Leaderboard Table List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeTab === 'room' ? (
            // Room Leaderboard
            roomPlayers.length > 0 ? (
              roomPlayers.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {getRankBadge(player.rank || idx + 1)}
                    <span className="text-2xl">{player.avatar || '🎋'}</span>
                    <div>
                      <span className="font-bold text-white text-sm sm:text-base block">
                        {player.name}
                      </span>
                      <span className="text-xs text-emerald-400">
                        {player.correctAnswers || 0} câu đúng
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
                      {player.totalSegments || 0}
                    </span>
                    <span className="text-xs text-emerald-300 font-bold ml-1 uppercase">ĐỐT</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-emerald-400 py-8">Chưa có kết quả phòng đấu nào.</p>
            )
          ) : (
            // Global Leaderboard
            globalList.length > 0 ? (
              globalList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-between gap-3 hover:bg-emerald-900/80 transition"
                >
                  <div className="flex items-center gap-3">
                    {getRankBadge(idx + 1)}
                    <span className="text-2xl">🎋</span>
                    <div>
                      <span className="font-bold text-white text-sm sm:text-base block">
                        {item.username}
                      </span>
                      <span className="text-xs text-emerald-400">
                        {item.correctAnswers || 0} câu đúng • {item.gamesPlayed || 1} trận đã chơi
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
                      {item.highestSegments}
                    </span>
                    <span className="text-xs text-emerald-300 font-bold ml-1 uppercase">ĐỐT</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="my-auto text-center py-12 px-4 space-y-3">
                <span className="text-5xl block animate-bounce">🌱</span>
                <h3 className="text-lg font-bold text-emerald-200">
                  Bảng xếp hạng đang trống!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400/80 max-w-sm mx-auto">
                  Hãy bắt đầu thi đấu để trở thành người đầu tiên nuôi dưỡng cây tre và ghi danh vào Bảng Vàng Tre Đoàn Kết.
                </p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl text-center text-xs text-emerald-400/60 py-4">
        Điểm số được xếp theo Số đốt tre &gt; Số câu đúng &gt; Tốc độ trả lời
      </footer>
    </div>
  );
}
