import WebSocket from 'ws';


export interface ChatMessage {
  sender: string;
  message: string;
}


export function broadcastChatMessage(clients: Set<WebSocket>, chatMessage: ChatMessage) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'chatMessage', data: chatMessage }));
    }
  });
}
