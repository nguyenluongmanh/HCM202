import { io } from 'socket.io-client';

class RoomService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      const serverUrl = import.meta.env.VITE_SERVER_URL || undefined;
      // Connect to server (either remote URL or current host)
      this.socket = io(serverUrl, {
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server:', this.socket.id);
        this.emitLocal('connected', this.socket.id);
      });

      this.socket.on('roomUpdated', (room) => {
        this.emitLocal('roomUpdated', room);
      });

      this.socket.on('gameStarted', (data) => {
        this.emitLocal('gameStarted', data);
      });

      this.socket.on('playerScoreUpdated', (data) => {
        this.emitLocal('playerScoreUpdated', data);
      });

      this.socket.on('playerLeft', (data) => {
        this.emitLocal('playerLeft', data);
      });

      this.socket.on('roomError', (err) => {
        this.emitLocal('roomError', err);
      });
    }
    return this.socket;
  }

  getSocketId() {
    return this.socket?.id;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const arr = this.listeners.get(event).filter((cb) => cb !== callback);
      this.listeners.set(event, arr);
    }
  }

  emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
  }

  // Create room
  createRoom(player) {
    this.connect();
    return new Promise((resolve, reject) => {
      this.socket.emit('createRoom', { player }, (response) => {
        if (response.success) {
          resolve(response.room);
        } else {
          reject(new Error(response.message || 'Không thể tạo phòng'));
        }
      });
    });
  }

  // Join room
  joinRoom(roomCode, player) {
    this.connect();
    return new Promise((resolve, reject) => {
      this.socket.emit('joinRoom', { roomCode: roomCode.toUpperCase().trim(), player }, (response) => {
        if (response.success) {
          resolve(response.room);
        } else {
          reject(new Error(response.message || 'Mã phòng không tồn tại hoặc đã đầy'));
        }
      });
    });
  }

  // Start game (Host only)
  startGame(roomCode) {
    if (this.socket) {
      this.socket.emit('startGame', { roomCode });
    }
  }

  // Send live score progress during game
  updateProgress(roomCode, progressData) {
    if (this.socket && roomCode) {
      this.socket.emit('updateProgress', { roomCode, ...progressData });
    }
  }

  // Leave room
  leaveRoom(roomCode) {
    if (this.socket && roomCode) {
      this.socket.emit('leaveRoom', { roomCode });
    }
  }
}

export const roomService = new RoomService();
