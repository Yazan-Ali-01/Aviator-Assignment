
export interface WebSocketMessage {
  type: 'playersRegistered' | 'betErrors' | 'registerPlayer' | 'rankBoardUpdated' | 'roundEndedWithResults' | 'betAndGuess' | 'chatMessage' | 'error' | 'roundStarted' | 'multiplierUpdated';
  [key: string]: any;
}

export interface Error {
  text: string
}



export interface UseWebSocketReturn {
  socket: WebSocket | null;
  messages: WebSocketMessage[];
  sendMessage: (message: WebSocketMessage) => void;
  status: string;
}

export interface ChatMessage {
  sender: string;
  message: string;

}

export interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export type Player = {
  name: string;
  points: number;
  guess: number | null;
  betPoints: number;
  isAuto: boolean;
  won?: boolean
  totalWinnings: number;
};

export interface RankingEntry {
  name: string;
  totalWinnings: number;
}

export interface GameContextType {
  overallRanking: RankingEntry[];
  setOverallRanking: (ranking: RankingEntry[]) => void;

}

export interface MultiplierUpdate {
  multiplier: number;
  elapsed: number; // Assuming elapsed is a number representing seconds or milliseconds
}

export interface WebSocketContextType {
  sendMessage: (message: WebSocketMessage) => void;
  players: Player[]
  realPlayer: Player | null
  chatMessages: ChatMessage[]
  multiplier: number
  isRoundActive: boolean
  multiplierUpdates: MultiplierUpdate[]
}
