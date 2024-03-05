import express from 'express';
import { createServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { GameManager } from './models/game';
import { broadcastChatMessage } from './models/chat';
import { deleteJsonDb, jsonDbExists, savePlayerData } from './utils/checkInfo';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();
const playerConnections = new Map<string, WebSocket>();


// Handle incoming connections and messages
wss.on('connection', (ws) => {
  console.log('Client connected');
  if (!jsonDbExists()) {
    savePlayerData([]); // This will create an empty JSON database
  }

  // Register message handler
  ws.on('message', (message) => handleMessage(ws, message.toString()));


  ws.on('error', (error) => {
    console.log(`Server WebSocket error: ${error}`);
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    deleteJsonDb()
    // Remove player connection from map
    const entriesToRemove = Array.from(playerConnections.entries())
      .filter(([_, wsValue]) => wsValue === ws);
    entriesToRemove.forEach(([key]) => playerConnections.delete(key));
  });
});

gameManager.on('playersRegistered', (data) => {
  broadcastToAllClients('playersRegistered', data.players);
});


gameManager.on('multiplierUpdated', (data) => {
  broadcastToAllClients('multiplierUpdated', data);
});

gameManager.on('resultsCalculated', (data) => {
  broadcastToAllClients('roundEndedWithResults', data);
});

gameManager.on('rankBoardGenerated', (data) => {
  broadcastToAllClients('rankBoardUpdated', data);
});

gameManager.on('allBetsPlaced', (data) => {
  broadcastToAllClients('allBetsPlaced', data);
});

// Event Listeners for GameManager events
gameManager.on('error', ({ playerName, message }) => {
  broadcastToAllClients('error', JSON.stringify({ type: 'error', message }));
});

function broadcastToAllClients<T>(type: string, data: T) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

// Handle incoming messages from clients
function handleMessage(ws: WebSocket, message: string): void {
  const data = JSON.parse(message.toString());

  switch (data.type) {
    case 'registerPlayer':
      console.log(data);

      gameManager.registerPlayer(data.name, 1000, true);
      playerConnections.set(data.name, ws);
      break;
    case 'betAndGuess':
      const bets = Array.isArray(data.bets) ? data.bets : [data.bets];
      console.log(bets, "data");

      gameManager.processBetsAndStartRound(bets)
      break;
    case 'chatMessage':
      broadcastChatMessage(wss.clients, data);
      break;
  }
}


server.listen(3000, () => {
  console.log('Server started on port 3000');
});