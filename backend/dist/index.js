"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = __importStar(require("ws"));
const game_1 = require("./models/game");
const chat_1 = require("./models/chat");
const checkInfo_1 = require("./utils/checkInfo");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wss = new ws_1.Server({ server });
const gameManager = new game_1.GameManager();
const playerConnections = new Map();
// Handle incoming connections and messages
wss.on('connection', (ws) => {
    console.log('Client connected');
    if (!(0, checkInfo_1.jsonDbExists)()) {
        (0, checkInfo_1.savePlayerData)([]); // This will create an empty JSON database
    }
    // Register message handler
    ws.on('message', (message) => handleMessage(ws, message.toString()));
    ws.on('error', (error) => {
        console.log(`Server WebSocket error: ${error}`);
    });
    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        (0, checkInfo_1.deleteJsonDb)();
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
gameManager.on('roundStarted', (data) => {
    broadcastToAllClients('roundStarted', data);
});
gameManager.on('roundCompleted', (data) => {
    broadcastToAllClients('roundCompleted', data);
});
gameManager.on('allBetsPlaced', (data) => {
    broadcastToAllClients('allBetsPlaced', data);
});
// Event Listeners for GameManager events
gameManager.on('error', ({ playerName, message }) => {
    broadcastToAllClients('error', { type: 'error', message });
});
gameManager.on('betErrors', ({ errors }) => {
    broadcastToAllClients('betErrors', { type: 'betErrors', errors });
});
function broadcastToAllClients(type, data) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({ type, data }));
        }
    });
}
// Handle incoming messages from clients
function handleMessage(ws, message) {
    const data = JSON.parse(message.toString());
    switch (data.type) {
        case 'registerPlayer':
            console.log(data);
            gameManager.registerPlayer(data.name, 1000, true);
            playerConnections.set(data.name, ws);
            break;
        case 'betAndGuess':
            const bets = Array.isArray(data.bets) ? data.bets : [data.bets];
            gameManager.processBetsAndStartRound(bets);
            break;
        case 'chatMessage':
            console.log(data.data);
            (0, chat_1.broadcastChatMessage)(wss.clients, data.data);
            break;
    }
}
server.listen(3000, () => {
    console.log('Server started on port 3000');
});
