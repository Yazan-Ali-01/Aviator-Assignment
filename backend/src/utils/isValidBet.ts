import { Player } from "../types/types";

export const isValidBet = (player: Player, betPoints: number) => {

  if (typeof betPoints !== 'number') {
    return { isValid: false, message: "Bet points must be a number." };
  }


  if (isNaN(betPoints) || betPoints <= 0 || !Number.isInteger(betPoints)) {
    return { isValid: false, message: "Bet points must be a positive integer." };
  }


  if (player.points < betPoints) {
    return { isValid: false, message: "Not enough points for the bet." };
  }


  return { isValid: true, message: "" };
}