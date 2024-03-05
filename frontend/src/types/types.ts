
export interface WebSocketMessage {
  type: 'playersRegistered' | 'roundEndedWithResults' | 'betAndGuess' | 'chatMessage' | 'error' | 'multiplierUpdated';
  data: any;
  message?: string
  bets?: any
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
  registerPlayer: (name: string) => void;
  currentRoundResults: Player[];
  setCurrentRoundResults: (results: Player[]) => void;
  overallRanking: RankingEntry[];
  setOverallRanking: (ranking: RankingEntry[]) => void;
}

export interface WebSocketContextType {
  sendMessage: (message: WebSocketMessage) => void;
  players: Player[] | null
  realPlayer: Player | null
  chatMessages: ChatMessage[]
  multiplier: number
}
