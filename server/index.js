import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Persistent leaderboard storage
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard_data.json');

function loadLeaderboard() {
  if (fs.existsSync(LEADERBOARD_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading leaderboard file:', e);
    }
  }
  return [];
}

function saveLeaderboard(data) {
  try {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving leaderboard file:', e);
  }
}

// REST Endpoints
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const list = loadLeaderboard();
  list.sort((a, b) => b.highestSegments - a.highestSegments || b.correctAnswers - a.correctAnswers);
  res.json(list.slice(0, limit));
});

// Reset endpoint
app.post('/api/leaderboard/reset', (req, res) => {
  saveLeaderboard([]);
  res.json({ success: true, message: 'Đã reset bảng xếp hạng', leaderboard: [] });
});

app.delete('/api/leaderboard', (req, res) => {
  saveLeaderboard([]);
  res.json({ success: true, message: 'Đã reset bảng xếp hạng', leaderboard: [] });
});

app.post('/api/leaderboard', (req, res) => {
  const record = req.body;
  if (!record || !record.username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  const list = loadLeaderboard();
  const existingIdx = list.findIndex((u) => u.username.toLowerCase() === record.username.toLowerCase());

  if (existingIdx >= 0) {
    if (record.highestSegments > list[existingIdx].highestSegments) {
      list[existingIdx].highestSegments = record.highestSegments;
      list[existingIdx].correctAnswers = record.correctAnswers || list[existingIdx].correctAnswers;
    }
    list[existingIdx].gamesPlayed = (list[existingIdx].gamesPlayed || 1) + 1;
    list[existingIdx].date = new Date().toISOString().split('T')[0];
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
  saveLeaderboard(list);
  res.json({ success: true, leaderboard: list.slice(0, 100) });
});

// Serve frontend dist if exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// In-memory room store
// rooms[roomCode] = { code, hostId, players: [ { id, name, avatar, totalSegments, correctAnswers, answeredQuestions, isHost, finished } ], status, startTime }
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing O/0, 1/I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function calculateRankings(players) {
  // Sort players by: totalSegments DESC -> correctAnswers DESC -> timeSpent ASC
  const sorted = [...players].sort((a, b) => {
    if (b.totalSegments !== a.totalSegments) {
      return b.totalSegments - a.totalSegments;
    }
    if (b.correctAnswers !== a.correctAnswers) {
      return b.correctAnswers - a.correctAnswers;
    }
    return (a.totalTimeSpent || 0) - (b.totalTimeSpent || 0);
  });

  return sorted.map((p, index) => ({
    ...p,
    rank: index + 1
  }));
}

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Create room
  socket.on('createRoom', ({ player }, callback) => {
    let code = generateRoomCode();
    while (rooms.has(code)) {
      code = generateRoomCode();
    }

    const newPlayer = {
      id: socket.id,
      name: player.name || 'Người chơi 1',
      avatar: player.avatar || '🎋',
      totalSegments: 0,
      correctAnswers: 0,
      answeredQuestions: 0,
      totalTimeSpent: 0,
      isHost: true,
      rank: 1,
      finished: false
    };

    const room = {
      code,
      hostId: socket.id,
      status: 'waiting',
      players: [newPlayer],
      createdAt: Date.now()
    };

    rooms.set(code, room);
    socket.join(`room:${code}`);
    socket.currentRoomCode = code;

    console.log(`[Room] Created ${code} by ${newPlayer.name}`);
    callback({ success: true, room });
  });

  // Join room
  socket.on('joinRoom', ({ roomCode, player }, callback) => {
    const code = roomCode.toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return callback({ success: false, message: 'Phòng không tồn tại!' });
    }

    if (room.status === 'playing') {
      return callback({ success: false, message: 'Trận đấu đang diễn ra!' });
    }

    if (room.players.length >= 100) {
      return callback({ success: false, message: 'Phòng đã đạt giới hạn tối đa người chơi!' });
    }

    const newPlayer = {
      id: socket.id,
      name: player.name || `Người chơi ${room.players.length + 1}`,
      avatar: player.avatar || '🌿',
      totalSegments: 0,
      correctAnswers: 0,
      answeredQuestions: 0,
      totalTimeSpent: 0,
      isHost: false,
      rank: room.players.length + 1,
      finished: false
    };

    room.players.push(newPlayer);
    socket.join(`room:${code}`);
    socket.currentRoomCode = code;

    console.log(`[Room] ${newPlayer.name} joined ${code}`);

    io.to(`room:${code}`).emit('roomUpdated', room);
    callback({ success: true, room });
  });

  // Start game (Host only)
  socket.on('startGame', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.hostId !== socket.id) return;

    room.status = 'playing';
    room.startTime = Date.now();
    room.duration = 180; // 180 seconds

    console.log(`[Room] ${roomCode} started game!`);
    io.to(`room:${roomCode}`).emit('gameStarted', {
      roomCode,
      startTime: room.startTime,
      duration: room.duration
    });
  });

  // Update in-game score / progress
  socket.on('updateProgress', ({ roomCode, totalSegments, correctAnswers, answeredQuestions, totalTimeSpent, finished }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const p = room.players.find((pl) => pl.id === socket.id);
    if (p) {
      p.totalSegments = totalSegments;
      p.correctAnswers = correctAnswers;
      p.answeredQuestions = answeredQuestions;
      p.totalTimeSpent = totalTimeSpent;
      if (finished !== undefined) p.finished = finished;

      // Re-calculate ranks
      room.players = calculateRankings(room.players);

      // Broadcast live updates to room
      io.to(`room:${roomCode}`).emit('playerScoreUpdated', {
        players: room.players,
        updatedPlayerId: socket.id
      });
    }
  });

  // Handle leave & disconnect
  const handleLeave = () => {
    const code = socket.currentRoomCode;
    if (!code) return;

    const room = rooms.get(code);
    if (!room) return;

    room.players = room.players.filter((p) => p.id !== socket.id);

    if (room.players.length === 0) {
      rooms.delete(code);
      console.log(`[Room] ${code} deleted (empty)`);
    } else {
      // If host left, elect next host
      if (room.hostId === socket.id) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
      }
      room.players = calculateRankings(room.players);
      io.to(`room:${code}`).emit('roomUpdated', room);
    }
    socket.leave(`room:${code}`);
    socket.currentRoomCode = null;
  };

  socket.on('leaveRoom', handleLeave);
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    handleLeave();
  });
});

server.listen(PORT, () => {
  console.log(`🎋 TRE ĐOÀN KẾT Server running on http://localhost:${PORT}`);
});
