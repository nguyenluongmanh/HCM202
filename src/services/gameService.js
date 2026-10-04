import { questionService } from './questionService';

export const GAME_DURATION_SECONDS = 180; // 3 phút
export const QUESTION_DURATION_SECONDS = 20; // 20 giây / câu

export class GameState {
  constructor(options = {}) {
    this.playerName = options.playerName || 'Người Chơi';
    this.avatar = options.avatar || '🎋';
    this.roomCode = options.roomCode || null;
    this.isMultiplayer = Boolean(options.roomCode);

    // Question bank
    this.questionQueue = questionService.shuffleQuestions();
    this.currentQuestionIndex = 0;
    
    // Stats
    this.totalSegments = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.timeoutAnswers = 0;
    this.totalTimeSpent = 0;

    // Timers
    this.gameTimeRemaining = GAME_DURATION_SECONDS;
    this.questionTimeRemaining = QUESTION_DURATION_SECONDS;
    
    // Status
    this.isGameOver = false;
    this.isAnswerLocked = false;
    this.lastAnswerResult = null; // { isCorrect, segmentsEarned, selectedOption, correctOption }
  }

  getCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionQueue.length) {
      // Re-shuffle if finished 50 questions
      this.questionQueue = questionService.shuffleQuestions();
      this.currentQuestionIndex = 0;
    }
    return this.questionQueue[this.currentQuestionIndex];
  }

  submitAnswer(selectedOption, timeRemaining) {
    if (this.isAnswerLocked || this.isGameOver) return null;

    this.isAnswerLocked = true;
    const currentQ = this.getCurrentQuestion();
    const isTimeout = selectedOption === null;
    const isCorrect = !isTimeout && selectedOption === currentQ.correctAnswer;
    const timeSpent = QUESTION_DURATION_SECONDS - timeRemaining;

    let segmentsEarned = 0;
    if (isCorrect) {
      segmentsEarned = questionService.calculateSegments(true, timeSpent);
      this.totalSegments += segmentsEarned;
      this.correctAnswers++;
    } else if (isTimeout) {
      this.timeoutAnswers++;
    } else {
      this.wrongAnswers++;
    }

    this.totalTimeSpent += timeSpent;

    this.lastAnswerResult = {
      isCorrect,
      isTimeout,
      segmentsEarned,
      selectedOption,
      correctOption: currentQ.correctAnswer,
      explanation: null
    };

    return this.lastAnswerResult;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.isAnswerLocked = false;
    this.questionTimeRemaining = QUESTION_DURATION_SECONDS;
    this.lastAnswerResult = null;
    return this.getCurrentQuestion();
  }
}
