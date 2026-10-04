// Leaderboard Service
const LOCAL_LEADERBOARD_KEY = 'bamboo_global_leaderboard';

class LeaderboardService {
  // Empty initial list so new matches start cleanly
  getDefaultLeaderboard() {
    return [];
  }

  // Fetch leaderboard from backend or local fallback
  async getGlobalLeaderboard(limit = 10) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || '';
    try {
      const res = await fetch(`${serverUrl}/api/leaderboard?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // Backend not reached or offline, fallback to local storage
    }

    const saved = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    let list = saved ? JSON.parse(saved) : this.getDefaultLeaderboard();
    // Sort descending by highestSegments, then correctAnswers
    list.sort((a, b) => b.highestSegments - a.highestSegments || b.correctAnswers - a.correctAnswers);
    return list.slice(0, limit);
  }

  // Reset entire leaderboard (Server + Local)
  async resetLeaderboard() {
    const serverUrl = import.meta.env.VITE_SERVER_URL || '';
    try {
      await fetch(`${serverUrl}/api/leaderboard/reset`, {
        method: 'POST'
      });
    } catch (e) {
      console.warn('Could not reset server leaderboard:', e);
    }

    localStorage.removeItem(LOCAL_LEADERBOARD_KEY);
    return [];
  }

  // Save new game record
  async saveRecord(record) {
    if (!record || !record.username) return [];

    const serverUrl = import.meta.env.VITE_SERVER_URL || '';
    // Attempt to post to server
    try {
      await fetch(`${serverUrl}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (e) {
      // Ignore network error and continue saving to localStorage
    }

    // Always update local storage
    const saved = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    let list = saved ? JSON.parse(saved) : this.getDefaultLeaderboard();

    const existingIndex = list.findIndex((item) => item.username.toLowerCase() === record.username.toLowerCase());
    if (existingIndex >= 0) {
      if (record.highestSegments > list[existingIndex].highestSegments) {
        list[existingIndex].highestSegments = record.highestSegments;
        list[existingIndex].correctAnswers = record.correctAnswers;
      }
      list[existingIndex].gamesPlayed = (list[existingIndex].gamesPlayed || 1) + 1;
      list[existingIndex].date = new Date().toISOString().split('T')[0];
    } else {
      list.push({
        id: 'u_' + Date.now(),
        username: record.username,
        highestSegments: record.highestSegments || 0,
        correctAnswers: record.correctAnswers || 0,
        gamesPlayed: 1,
        date: new Date().toISOString().split('T')[0]
      });
    }

    list.sort((a, b) => b.highestSegments - a.highestSegments || b.correctAnswers - a.correctAnswers);
    localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(list));
    return list;
  }
}

export const leaderboardService = new LeaderboardService();
