import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './index.css';
import GamePage from "./pages/GamePage";

function App() {
  return (
    <WebSocketProvider url="ws://localhost:3000">
      <GameProvider>
        <div className="my-8 h-fit">
          <GamePage />
        </div>
      </GameProvider>
    </WebSocketProvider>
  );
}

export default App;
