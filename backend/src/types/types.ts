export type Player = {
  name: string; // Standardized to 'name'
  points: number;
  guess: number;
  betPoints: number;
  isAuto: boolean;
  won?: boolean
  totalWinnings: number;
};

export interface GameState {
  multiplier: number;
  players: Player[];
  isRoundActive: boolean;
  roundEndTime: number | null;
}


export interface RankBoardEntry {
  name: string; // Standardized to 'name'
  totalWinnings: number;
}

export interface MultiplierUpdatedData {
  multiplier: number;
}

export interface ResultsCalculatedData {
  results: Player[];
}

export interface RankBoardGeneratedData {
  rankBoard: RankBoardEntry[];
}

export interface PlayerRegistrationData {
  name: string; // Standardized to 'name'
}

export interface BetAndGuessData {
  name: string; // Ensure this is consistent with your usage
  guess: number;
  betPoints: number;
  speed: number; // Include this if you're using it within the function, make it optional if it's not always present
}

export interface MessageData {
  type: string;
  [key: string]: any; // Use a more specific type if possible for your use case
}

export interface BasicBroadcastData {
  [key: string]: any; // This allows any property with any type
}
