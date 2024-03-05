import { Player } from "../types/types";

export const generateRandomBetPoints = (maxPoints: number) => {
  // Ensure the bet is at least 1 point but does not exceed the player's available points
  return Math.floor(Math.random() * maxPoints) + 1;
};

// Function to reset a player's guess
export function resetGuess(player: Player): Player {
  return { ...player, guess: null, betPoints: 0 };
}