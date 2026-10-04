import { QUESTIONS_DATA } from '../data/questions';

class QuestionService {
  constructor() {
    this.totalQuestions = QUESTIONS_DATA.length;
  }

  // Fisher-Yates shuffle
  shuffleQuestions(list = [...QUESTIONS_DATA]) {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Calculate bamboo segments earned based on answering time:
   * 0 - 2s: 10 segments
   * 2 - 4s: 9 segments
   * 4 - 6s: 8 segments
   * ...
   * 18 - 20s: 1 segment
   * Formula: max(0, 10 - floor(timeSpent / 2))
   * If wrong or timeout (>20s): 0 segments
   */
  calculateSegments(isCorrect, timeSpentSeconds) {
    if (!isCorrect) return 0;
    if (timeSpentSeconds >= 20 || timeSpentSeconds < 0) return 0;
    const segments = Math.max(0, 10 - Math.floor(timeSpentSeconds / 2));
    return segments;
  }

  // Get question by ID
  getQuestionById(id) {
    return QUESTIONS_DATA.find((q) => q.id === id);
  }

  // Get all questions
  getAllQuestions() {
    return QUESTIONS_DATA;
  }
}

export const questionService = new QuestionService();
