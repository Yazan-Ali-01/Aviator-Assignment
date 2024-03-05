import WebSocket from 'ws';

// Utility type for chat messages
export interface ChatMessage {
  sender: string;
  message: string;
}

// Function to broadcast a chat message to all connected clients
export function broadcastChatMessage(clients: Set<WebSocket>, chatMessage: ChatMessage) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'chatMessage', data: chatMessage }));
    }
  });
}
