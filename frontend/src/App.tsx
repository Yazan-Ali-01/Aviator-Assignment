import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './index.css';
import GamePage from "./pages/GamePage";

function App() {
  return (
    <GameProvider>
      <WebSocketProvider url="ws://localhost:3000">
        <div className="my-8 h-fit">
          <GamePage />
        </div>
      </WebSocketProvider>
    </GameProvider>
  );
}

export default App;
