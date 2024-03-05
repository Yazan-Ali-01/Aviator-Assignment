export class Player {
  id: string;
  name: string;
  points: number;
  guess: number | null;
  betPoints: number;
  isAuto: boolean;
  totalWinnings: number

  constructor(id: string, name: string, initialPoints: number = 1000, isAuto: boolean = false, totalWinnings: number = 0) {
    this.id = id;
    this.name = name;
    this.points = initialPoints;
    this.guess = 0;
    this.betPoints = 0;
    this.isAuto = isAuto;
    this.totalWinnings = totalWinnings;
  }

  makeGuess(guess: number, betPoints: number) {
    this.guess = guess;
    this.betPoints = betPoints;
  }

  resetGuess() {
    this.guess = 0;
    this.betPoints = 0;
  }
}