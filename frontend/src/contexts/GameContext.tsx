import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameContextType, Player, RankingEntry } from '../types/types';
import { useWebSocket } from './WebSocketContext';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoundResults, setCurrentRoundResults] = useState<Player[]>([]);
  const [overallRanking, setOverallRanking] = useState<RankingEntry[]>([]);


  const { sendMessage, players } = useWebSocket();


  const registerPlayer = (name: string) => {
    const isAuto = name.startsWith('Auto')
    sendMessage({
      type: 'registerPlayer',
      name: name,
    });
  };

  const value = {
    registerPlayer,
    currentRoundResults,
    setCurrentRoundResults,
    overallRanking,
    setOverallRanking,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
