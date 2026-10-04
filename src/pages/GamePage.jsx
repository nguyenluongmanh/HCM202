import React, { useState, useEffect, useRef } from 'react';
import Timer from '../components/Timer';
import ScoreDisplay from '../components/ScoreDisplay';
import BambooTree from '../components/BambooTree';
import QuestionCard from '../components/QuestionCard';
import PlayerList from '../components/PlayerList';
import SoundToggle from '../components/SoundToggle';
import { GameState, GAME_DURATION_SECONDS, QUESTION_DURATION_SECONDS } from '../services/gameService';
import { roomService } from '../services/roomService';
import { soundManager } from '../utils/audio';
import { Users, LogOut } from 'lucide-react';

export default function GamePage({
  playerName,
  avatar,
  roomCode,
  initialPlayers = [],
  onGameOver,
  onLeaveGame
}) {
  // Game state instance ref
  const gameStateRef = useRef(new GameState({ playerName, avatar, roomCode }));
  const [currentQuestion, setCurrentQuestion] = useState(gameStateRef.current.getCurrentQuestion());
  const [questionNumber, setQuestionNumber] = useState(1);

  // Stats for reactive UI
  const [totalSegments, setTotalSegments] = useState(0);
  const [recentGrowth, setRecentGrowth] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);
  const [myRank, setMyRank] = useState(1);

  // Timers
  const [gameTimeRemaining, setGameTimeRemaining] = useState(GAME_DURATION_SECONDS);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(QUESTION_DURATION_SECONDS);

  // UI status
  const [isLocked, setIsLocked] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);

  // Multiplayer players
  const [players, setPlayers] = useState(initialPlayers);
  const isMultiplayer = Boolean(roomCode);

  const socketId = roomService.getSocketId();

  // 1. GLOBAL 180-SECOND GAME TIMER
  useEffect(() => {
    soundManager.playGameStart();

    const interval = setInterval(() => {
      setGameTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. 20-SECOND QUESTION TIMER
  useEffect(() => {
    if (isLocked || gameTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          // Handle timeout automatically
          handleTimeout();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isLocked, currentQuestion?.id, gameTimeRemaining]);

  // 3. MULTIPLAYER REALTIME SCORE SYNC
  useEffect(() => {
    if (!isMultiplayer) return;

    const unsubScore = roomService.on('playerScoreUpdated', (data) => {
      if (data?.players) {
        setPlayers(data.players);
        const me = data.players.find((p) => p.id === socketId);
        if (me?.rank) {
          setMyRank(me.rank);
        }
      }
    });

    return () => {
      unsubScore();
    };
  }, [isMultiplayer, socketId]);

  // Handle Timeout
  const handleTimeout = () => {
    if (isLocked) return;
    const gs = gameStateRef.current;
    const res = gs.submitAnswer(null, 0);

    setIsLocked(true);
    setAnswerResult(res);
    setTimeoutCount(gs.timeoutAnswers);
    soundManager.playWrong();

    syncProgressToServer(gs);

    // Transition to next question after 1.8s
    setTimeout(() => {
      moveToNextQuestion();
    }, 1800);
  };

  // Handle User Answer Selection
  const handleSelectOption = (selectedKey) => {
    if (isLocked) return;

    const gs = gameStateRef.current;
    const res = gs.submitAnswer(selectedKey, questionTimeRemaining);

    setIsLocked(true);
    setAnswerResult(res);
    setTotalSegments(gs.totalSegments);
    setRecentGrowth(res.segmentsEarned);
    setCorrectCount(gs.correctAnswers);
    setWrongCount(gs.wrongAnswers);

    if (res.isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    syncProgressToServer(gs);

    // Transition to next question after 1.8s
    setTimeout(() => {
      moveToNextQuestion();
    }, 1800);
  };

  const moveToNextQuestion = () => {
    if (gameTimeRemaining <= 0) return;

    const gs = gameStateRef.current;
    const nextQ = gs.nextQuestion();
    setCurrentQuestion(nextQ);
    setQuestionNumber((n) => n + 1);
    setQuestionTimeRemaining(QUESTION_DURATION_SECONDS);
    setRecentGrowth(0);
    setIsLocked(false);
    setAnswerResult(null);
  };

  // Sync to backend via Socket.IO
  const syncProgressToServer = (gs, isFinal = false) => {
    if (isMultiplayer && roomCode) {
      roomService.updateProgress(roomCode, {
        totalSegments: gs.totalSegments,
        correctAnswers: gs.correctAnswers,
        answeredQuestions: gs.correctAnswers + gs.wrongAnswers + gs.timeoutAnswers,
        totalTimeSpent: gs.totalTimeSpent,
        finished: isFinal
      });
    }
  };

  // Finish Game (time is up)
  const finishGame = () => {
    const gs = gameStateRef.current;
    gs.isGameOver = true;
    setIsLocked(true);
    soundManager.playGameOver();

    syncProgressToServer(gs, true);

    const finalSummary = {
      playerName,
      avatar,
      roomCode,
      isMultiplayer,
      totalSegments: gs.totalSegments,
      correctAnswers: gs.correctAnswers,
      wrongAnswers: gs.wrongAnswers,
      timeoutAnswers: gs.timeoutAnswers,
      totalQuestionsAnswered: gs.correctAnswers + gs.wrongAnswers + gs.timeoutAnswers,
      totalTimeSpent: gs.totalTimeSpent,
      rank: myRank,
      players
    };

    onGameOver(finalSummary);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 relative select-none">
      {/* 1. TOP BAR (Section 5) */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 pb-3 border-b border-emerald-800/80 z-20">
        {/* Title */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl animate-pulse">🌱</span>
          <span className="font-black text-sm sm:text-lg tracking-wider text-emerald-200 uppercase hidden xs:inline">
            TRE ĐOÀN KẾT
          </span>
        </div>

        {/* Center: 3-Minute Match Countdown (Section 3) */}
        <Timer secondsRemaining={gameTimeRemaining} />

        {/* Right: Segments, Rank, Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ScoreDisplay
            totalSegments={totalSegments}
            currentRank={myRank}
            totalPlayers={players.length > 0 ? players.length : 1}
          />
          <SoundToggle />
        </div>
      </header>

      {/* 2. MAIN GAMEPLAY AREA (Sections 6, 7, 15) */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 sm:gap-6 py-4 z-10">
        {/* Bamboo Column */}
        <div className="w-full lg:w-64 order-2 lg:order-1 h-56 lg:h-auto flex justify-center shrink-0">
          <BambooTree
            segments={totalSegments}
            recentGrowth={recentGrowth}
            maxHeight="100%"
          />
        </div>

        {/* Question Area (Center) */}
        <div className="flex-1 w-full flex items-center justify-center order-1 lg:order-2">
          <QuestionCard
            questionNumber={questionNumber}
            question={currentQuestion}
            timeRemaining={questionTimeRemaining}
            maxTime={QUESTION_DURATION_SECONDS}
            isLocked={isLocked}
            answerResult={answerResult}
            onSelectOption={handleSelectOption}
          />
        </div>

        {/* Multiplayer Live Leaderboard (Desktop side / drawer) */}
        {isMultiplayer && players.length > 1 && (
          <div className="hidden xl:flex w-72 flex-col bg-emerald-950/70 backdrop-blur-md rounded-2xl border border-emerald-800/60 p-4 order-3 shrink-0 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-800 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Bảng điểm trực tiếp</span>
              </span>
              <span className="text-amber-400 font-mono">#{roomCode}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <PlayerList
                players={players}
                currentUserId={socketId}
                isLiveGame={true}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full max-w-6xl mx-auto flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs text-emerald-400/70 z-20">
        <div className="flex items-center gap-2">
          <span>Tốc độ: 0-2s (+10 đốt) • 2-4s (+9 đốt) • Cứ 2s giảm 1 đốt</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn rời khỏi trận đấu?')) {
              onLeaveGame();
            }
          }}
          className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Rời trận
        </button>
      </footer>
    </div>
  );
}
