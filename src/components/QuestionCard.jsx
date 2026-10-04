import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function QuestionCard({
  questionNumber = 1,
  question,
  timeRemaining = 20,
  maxTime = 20,
  isLocked = false,
  answerResult = null,
  onSelectOption
}) {
  const [selectedOpt, setSelectedOpt] = useState(null);

  useEffect(() => {
    // Reset selection when new question arrives
    if (!isLocked) {
      setSelectedOpt(null);
    }
  }, [question?.id, isLocked]);

  const handleSelect = (key) => {
    if (isLocked) return;
    soundManager.playClick();
    setSelectedOpt(key);
    onSelectOption(key);
  };

  if (!question) {
    return (
      <div className="p-8 text-center bg-emerald-950/70 border border-emerald-800 rounded-2xl">
        <div className="animate-spin text-3xl mb-2">🌿</div>
        <p className="text-emerald-300">Đang chuẩn bị câu hỏi tiếp theo...</p>
      </div>
    );
  }

  // Calculate percentage of 20s remaining
  const timePercent = Math.max(0, Math.min(100, (timeRemaining / maxTime) * 100));

  // Determine option styling
  const getOptionButtonClass = (key) => {
    const base = 'w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-medium transition-all duration-200 relative flex items-start gap-3 text-sm sm:text-base cursor-pointer shadow-md select-none ';

    if (!isLocked) {
      return base + 'bg-emerald-900/60 hover:bg-emerald-800/90 hover:border-emerald-400 border-emerald-700/60 text-slate-100 hover:scale-[1.01] active:scale-[0.99]';
    }

    // Locked state styling
    const isThisCorrect = key === question.correctAnswer;
    const isThisSelected = key === selectedOpt;

    if (isThisCorrect) {
      return base + 'bg-emerald-600/90 border-emerald-300 text-white shadow-emerald-500/50 shadow-lg scale-[1.01]';
    }
    if (isThisSelected && !isThisCorrect) {
      return base + 'bg-red-900/80 border-red-500 text-red-100 animate-shake';
    }
    return base + 'bg-emerald-950/50 border-emerald-900/40 text-emerald-300/40 opacity-50 cursor-not-allowed';
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl bg-emerald-950/80 backdrop-blur-md border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-5 relative overflow-hidden">
      {/* Top Question Info & 20s Countdown */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-emerald-800/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold uppercase tracking-wider">
            CÂU HỎI {questionNumber}
          </span>
          <span className="text-xs text-emerald-400/80 font-medium hidden sm:inline">
            (Mã: #{question.id})
          </span>
        </div>

        {/* 20-second circular / digital countdown */}
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${timeRemaining <= 5 ? 'text-red-400 animate-ping' : 'text-amber-400'}`} />
          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-black font-mono leading-none ${
              timeRemaining <= 5 ? 'text-red-400' : timeRemaining <= 10 ? 'text-amber-400' : 'text-emerald-300'
            }`}>
              {Math.ceil(timeRemaining)}s
            </span>
          </div>
        </div>
      </div>

      {/* 20-second countdown bar */}
      <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800/60 -mt-2">
        <div
          className={`h-full transition-all duration-200 ease-linear rounded-full ${
            timeRemaining <= 5
              ? 'bg-gradient-to-r from-red-600 to-rose-400'
              : timeRemaining <= 10
              ? 'bg-gradient-to-r from-amber-600 to-yellow-400'
              : 'bg-gradient-to-r from-emerald-500 to-green-400'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="min-h-[70px] sm:min-h-[85px] flex items-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
        {optionLetters.map((key) => {
          const text = question.options[key];
          if (!text) return null;

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={isLocked}
              className={getOptionButtonClass(key)}
            >
              {/* Option badge */}
              <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black flex items-center justify-center shrink-0 text-xs sm:text-sm shadow ${
                isLocked && key === question.correctAnswer
                  ? 'bg-white text-emerald-900 font-extrabold'
                  : isLocked && key === selectedOpt && key !== question.correctAnswer
                  ? 'bg-white text-red-900 font-extrabold'
                  : 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/50'
              }`}>
                {key}
              </span>

              {/* Option Text */}
              <span className="flex-1 pt-0.5 leading-snug break-words">
                {text}
              </span>

              {/* Status Icons */}
              {isLocked && key === question.correctAnswer && (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" />
              )}
              {isLocked && key === selectedOpt && key !== question.correctAnswer && (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Banner (Sections 2 & 8) */}
      {isLocked && answerResult && (
        <div
          className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all duration-300 animate-bamboo-grow ${
            answerResult.isCorrect
              ? 'bg-emerald-800/90 border-emerald-400 text-white shadow-lg shadow-emerald-900/50'
              : answerResult.isTimeout
              ? 'bg-amber-900/90 border-amber-500 text-amber-100 shadow-lg'
              : 'bg-red-900/90 border-red-500 text-white shadow-lg'
          }`}
        >
          <div className="flex items-center gap-2 text-base sm:text-lg font-black uppercase tracking-wide">
            {answerResult.isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-300 animate-bounce" />
                <span>CHÍNH XÁC!</span>
                <span className="text-amber-300 ml-1">+{answerResult.segmentsEarned} ĐỐT TRE</span>
              </>
            ) : answerResult.isTimeout ? (
              <>
                <AlertCircle className="w-6 h-6 text-amber-300" />
                <span>HẾT GIỜ!</span>
                <span className="text-amber-200 ml-1">+0 ĐỐT TRE</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-300" />
                <span>CHƯA ĐÚNG!</span>
                <span className="text-red-200 ml-1">+0 ĐỐT TRE</span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm opacity-90">
            {answerResult.isCorrect
              ? `Tốc độ trả lời tuyệt vời! Cây tre đã mọc thêm ${answerResult.segmentsEarned} đốt.`
              : `Đáp án đúng là: ${question.correctAnswer}. Hãy cố gắng ở câu tiếp theo!`}
          </p>
        </div>
      )}
    </div>
  );
}
