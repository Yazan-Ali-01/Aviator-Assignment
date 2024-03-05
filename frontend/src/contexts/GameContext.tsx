import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameContextType, Player, RankingEntry } from '../types/types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overallRanking, setOverallRanking] = useState<RankingEntry[]>([]);

  const value = {
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
