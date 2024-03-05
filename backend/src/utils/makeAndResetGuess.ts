import { Player } from "../types/types";

export function makeGuess(player: Player, guess: number, betPoints: number): Player {
  return { ...player, guess, betPoints };
}

// Function to reset a player's guess
export function resetGuess(player: Player): Player {
  return { ...player, guess: 0, betPoints: 0 };
}