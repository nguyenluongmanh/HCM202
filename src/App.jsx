import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Lobby from './pages/Lobby';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import Leaderboard from './pages/Leaderboard';
import HowToPlayModal from './components/HowToPlayModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('bamboo_player_name') || ''
  );
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem('bamboo_player_avatar') || '🎋'
  );

  // Multiplayer session data
  const [roomData, setRoomData] = useState(null);
  // Match result data
  const [resultData, setResultData] = useState(null);
  // How to play modal state
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Sync profile to localStorage
  const handleUpdateName = (name) => {
    setPlayerName(name);
    localStorage.setItem('bamboo_player_name', name);
  };

  const handleUpdateAvatar = (av) => {
    setAvatar(av);
    localStorage.setItem('bamboo_player_avatar', av);
  };

  // Solo Start
  const handleStartSolo = (name, av) => {
    handleUpdateName(name);
    handleUpdateAvatar(av);
    setRoomData(null);
    setCurrentPage('game');
  };

  // Create Room flow
  const handleGoCreateRoom = (name, av) => {
    handleUpdateName(name);
    handleUpdateAvatar(av);
    setCurrentPage('create-room');
  };

  const handleRoomCreated = (room) => {
    setRoomData(room);
    setCurrentPage('lobby');
  };

  // Join Room flow
  const handleGoJoinRoom = (name, av) => {
    handleUpdateName(name);
    handleUpdateAvatar(av);
    setCurrentPage('join-room');
  };

  const handleRoomJoined = (room) => {
    setRoomData(room);
    setCurrentPage('lobby');
  };

  // Start Multiplayer match from Lobby
  const handleStartGameFromLobby = () => {
    setCurrentPage('game');
  };

  // Game Finished (180s expired)
  const handleGameOver = (finalStats) => {
    setResultData(finalStats);
    setCurrentPage('result');
  };

  // Play again
  const handlePlayAgain = () => {
    if (roomData) {
      setCurrentPage('lobby');
    } else {
      setCurrentPage('game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-green-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Page Routing */}
      {currentPage === 'home' && (
        <HomePage
          playerName={playerName}
          setPlayerName={handleUpdateName}
          avatar={avatar}
          setAvatar={handleUpdateAvatar}
          onStartSolo={handleStartSolo}
          onGoCreateRoom={handleGoCreateRoom}
          onGoJoinRoom={handleGoJoinRoom}
          onGoLeaderboard={() => setCurrentPage('leaderboard')}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        />
      )}

      {currentPage === 'create-room' && (
        <CreateRoom
          playerName={playerName}
          avatar={avatar}
          onRoomCreated={handleRoomCreated}
          onBackHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'join-room' && (
        <JoinRoom
          playerName={playerName}
          avatar={avatar}
          onRoomJoined={handleRoomJoined}
          onBackHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'lobby' && (
        <Lobby
          room={roomData}
          onStartGame={handleStartGameFromLobby}
          onLeaveRoom={() => {
            setRoomData(null);
            setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'game' && (
        <GamePage
          playerName={playerName || 'Người chơi'}
          avatar={avatar}
          roomCode={roomData?.code || null}
          initialPlayers={roomData?.players || []}
          onGameOver={handleGameOver}
          onLeaveGame={() => {
            setRoomData(null);
            setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'result' && (
        <ResultPage
          resultData={resultData}
          onPlayAgain={handlePlayAgain}
          onGoLeaderboard={() => setCurrentPage('leaderboard')}
          onGoHome={() => {
            setRoomData(null);
            setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'leaderboard' && (
        <Leaderboard
          roomPlayers={resultData?.players || []}
          onBackHome={() => setCurrentPage('home')}
        />
      )}

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
