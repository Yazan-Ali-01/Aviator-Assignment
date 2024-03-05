
import React, { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { WebSocketContextType, WebSocketMessage, Player, ChatMessage } from '../types/types';

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => { console.warn("WebSocket not connected"); },
  players: [],
  realPlayer: null,
  chatMessages: [{
    sender: '',
    message: ''
  }]
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, url }) => {
  const [status, setStatus] = useState('disconnected');
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const socketRef = useRef<WebSocket | null>(null);
  const [multiplier, setMultiplier] = useState<number>(1)
  const realPlayer = players.find(player => !player.isAuto);

  const handleError = (message: WebSocketMessage) => {
    // Assuming message.data or message.message is the error message you want to display
    const errorMessage = message.message || 'An unknown error occurred';
    setErrors(prevErrors => [...prevErrors, errorMessage]);
  };


  useEffect(() => {
    const connectWebSocket = () => {
      setStatus('connecting');
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setStatus('disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);

      };

      socketRef.current = ws;
    };

    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected.');
    }
  };

  const simulateBotMessage = (): WebSocketMessage => {
    const botMessages = [
      "Just joined, excited to play with everyone!",
      "Wow, that last round was intense! 😄",
      "I'm guessing a multiplier of 3.5 this round. What about you guys?",
      "Oops, better luck next time for me. Congrats to the winners!",
      "Does anyone have any tips for beginners like me?",
      "I'm on a winning streak! Let's see if it lasts. 🤞",
      "That was a close call, almost had it!",
      "Going all in this round, wish me luck!",
      "Anyone else here for the first time?",
      "I think I'm getting the hang of this game. It's quite fun!",
      "Phew, made a small comeback there. Never give up, right?",
      "Trying a different strategy this time. Let's see how it goes.",
      "Good game, everyone. Looking forward to the next round!",
      "Can't believe I missed that! I'll be more careful next time.",
      "Cheers to the top scorer! That was an impressive play."
    ];

    const botNames = [
      "AutoPlayer1",
      "AutoPlayer2",
      "AutoPlayer3",
      "AutoPlayer4",
    ];
    const randomMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
    const randomSender = botNames[Math.floor(Math.random() * botNames.length)];
    return {
      type: 'chatMessage', data: {
        sender: randomSender,
        message: randomMessage
      }
    };
  };

  useEffect(() => {
    const botMessageInterval = setInterval(() => {
      const botMessage = simulateBotMessage();
      setChatMessages(prevMessages => [...prevMessages, botMessage]);
    }, 10000);

    return () => clearInterval(botMessageInterval);
  }, []);

  const handleMessage = (message: WebSocketMessage) => {
    console.log("Received message:", message);
    switch (message.type) {
      case 'playersRegistered':
        setPlayers(message.data.players);
        break;
      case 'roundEndedWithResults':
        console.log(message);
        setPlayers(message.data.players);
        break;
      case 'chatMessage':
        console.log(message.data);
        setChatMessages(prevMessages => [...prevMessages, message.data]);
        break;
      case 'multiplierUpdated': {
        console.log(message);
        const { multiplier } = message.data; // Extract multiplier from message data
        setMultiplier(multiplier); // Update multiplier state
        break;
      }
      case 'error': {
        const errorMessage = message.message || 'An unknown error occurred';
        console.log(errorMessage)
        break;
      }
      default:
        console.log('Unhandled message type:', message.type);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, players, realPlayer, chatMessages, multiplier }}>
      {children}
    </WebSocketContext.Provider>
  );
};
