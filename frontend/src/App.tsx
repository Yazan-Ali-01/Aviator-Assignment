import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GamePage from "./pages/GamePage";

function App() {
  const WS_URL = import.meta.env.VITE_WS_BACKEND_ENDPPOINT
  return (
    <GameProvider>
      <WebSocketProvider url={`ws://${WS_URL}`}>
        <div className="my-8 h-fit">
          <GamePage />
          <ToastContainer
            position="top-center"
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
