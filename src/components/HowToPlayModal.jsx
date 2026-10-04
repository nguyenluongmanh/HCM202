import React from 'react';
import { X, CheckCircle2, Clock, Zap, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-bamboo-grow">
      <div className="w-full max-w-lg bg-emerald-950 border-2 border-emerald-600 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🎋</span>
          <h2 className="text-2xl font-black text-amber-300 tracking-tight uppercase">
            HƯỚNG DẪN CHƠI
          </h2>
          <p className="text-emerald-300 text-xs sm:text-sm mt-1">
            Thử thách kiến thức Chương V – Tư tưởng Hồ Chí Minh
          </p>
        </div>

        {/* Rules List */}
        <div className="space-y-3.5 text-sm">
          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">Thời gian toàn trận:</span>
              <p className="text-emerald-300/90 text-xs mt-0.5">
                Mỗi trận đấu kéo dài đúng <strong className="text-amber-300">3 phút (180 giây)</strong>. Hết giờ hệ thống sẽ tự động dừng và tính tổng số đốt tre.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">20 giây cho mỗi câu hỏi:</span>
              <p className="text-emerald-300/90 text-xs mt-0.5">
                Mỗi câu hỏi có 4 đáp án (A, B, C, D). Bạn có tối đa 20 giây để chọn câu trả lời đúng.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">Cơ chế tính đốt tre (Tốc độ = Chiều cao):</span>
              <p className="text-emerald-300/90 text-xs mt-0.5">
                Trả lời đúng trong 0–2s: <strong className="text-amber-300">10 đốt</strong>. Cứ mỗi 2 giây trôi qua giảm 1 đốt (2-4s: 9 đốt, 4-6s: 8 đốt,... 18-20s: 1 đốt).
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">Trả lời sai hoặc hết 20s:</span>
              <p className="text-emerald-300/90 text-xs mt-0.5">
                Nhận <strong className="text-rose-300">0 đốt tre</strong>. Cây tre sẽ giữ nguyên chiều cao hiện tại và chuyển sang câu tiếp theo.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">Mục tiêu tối thượng:</span>
              <p className="text-emerald-300/90 text-xs mt-0.5">
                Xây dựng <strong className="text-amber-300">cây tre cao nhất</strong> trong phòng đấu và ghi danh vào Bảng Vàng Tre Việt Nam!
              </p>
            </div>
          </div>
        </div>

        {/* Footer close */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold shadow-lg shadow-emerald-900/50 transition-all cursor-pointer active:scale-95"
          >
            ĐÃ HIỂU - SẴN SÀNG TRANH TÀI!
          </button>
        </div>
      </div>
    </div>
  );
}
