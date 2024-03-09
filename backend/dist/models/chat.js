"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastChatMessage = void 0;
const ws_1 = __importDefault(require("ws"));
function broadcastChatMessage(clients, chatMessage) {
    clients.forEach(client => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({ type: 'chatMessage', data: chatMessage }));
        }
    });
}
exports.broadcastChatMessage = broadcastChatMessage;
