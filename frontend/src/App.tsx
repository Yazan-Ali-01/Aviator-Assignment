import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GamePage from "./pages/GamePage";

function App() {
  return (
    <GameProvider>
      <WebSocketProvider url="ws://localhost:3000">
        <div className="my-8 h-fit">
          <GamePage />
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            limit={5}
          />
        </div>
      </WebSocketProvider>
    </GameProvider>
  );
}

export default App;
