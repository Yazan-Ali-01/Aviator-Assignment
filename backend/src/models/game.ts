import { EventEmitter } from 'events';
import { isValidNumber } from '../utils/isValidNumber';
import { deleteJsonDb, loadPlayerData, savePlayerData } from '../utils/checkInfo';
import { BetType, Player } from '../types/types';
import { isValidBet } from '../utils/isValidBet';

export interface GameState {
  multiplier: number;
  players: Player[];
  isRoundActive: boolean;
  roundEndTime: number | null;
}

interface RankBoardEntry {
  playerName: string;
  totalWinnings: number;
}

export class GameManager extends EventEmitter {
  private state: GameState;
  private totalWinningsMap: Map<string, number>;

  constructor() {
    super();
    this.state = {
      multiplier: 0,
      players: [],
      isRoundActive: false,
      roundEndTime: null
    };
    this.totalWinningsMap = new Map();
  }

  private getRandomFinalMultiplier() {
    const min = 6;
    const max = 9;
    return Math.random() * (max - min) + min;
  }

  startNewRound(speed: number) {
    const finalMultiplier = this.getRandomFinalMultiplier();
    this.state.isRoundActive = true;
    this.state.multiplier = 0;
    const roundStartTime = Date.now();
    this.emit('roundStarted', { isRoundActive: this.state.isRoundActive, startTime: roundStartTime });

    const baseIncrement = 0.1;
    const increment = baseIncrement * speed;

    const updateMultiplier = () => {
      if (this.state.multiplier < finalMultiplier) {
        this.state.multiplier += increment;
        const elapsed = (Date.now() - roundStartTime) / 1000; // Calculate elapsed time in seconds
        this.emit('multiplierUpdated', { multiplier: this.state.multiplier, elapsed });
        setTimeout(updateMultiplier, 100);
      } else {
        this.endRound();
      }
    };

    updateMultiplier();
  }

  registerPlayer(playerName: string, startingPoints: number = 1000, registerAutoPlayers: boolean = true) {
    deleteJsonDb()
    let players = loadPlayerData();
    let newlyRegisteredPlayers = [];

    if (players.find(player => player.name === playerName)) {
      this.emit('error', { playerName, message: "Player already exists in the database." });
      return;
    }

    const newPlayer = {
      name: playerName,
      points: startingPoints,
      guess: 0,
      betPoints: 0,
      isAuto: false,
      totalWinnings: 0,
    };

    players.push(newPlayer);
    newlyRegisteredPlayers.push(newPlayer);


    if (registerAutoPlayers) {
      const autoPlayerNames = ['AutoPlayer1', 'AutoPlayer2', 'AutoPlayer3', 'AutoPlayer4'];
      autoPlayerNames.forEach(name => {
        const autoPlayer = {
          name: name,
          points: startingPoints,
          guess: 0,
          betPoints: 0,
          isAuto: true,
          totalWinnings: 0,
        };

        if (!players.find(player => player.name === autoPlayer.name)) {
          players.push(autoPlayer);
          newlyRegisteredPlayers.push(autoPlayer);
        }
      });
    }

    savePlayerData(players);


    this.emit('playersRegistered', { players });
  }


  playerExists(playerName: string): boolean {
    const players = loadPlayerData();
    return !!players.find(player => player.name === playerName);
  }



  processBetsAndStartRound(bets: BetType[]) {
    const players = loadPlayerData();
    const { validBets, errors } = this.validateBets(bets, players);

    if (errors.length > 0) {
      this.handleErrors(errors);
      return;
    }

    this.updatePlayerData(players, validBets);
    this.startRoundWithValidBets(validBets);
  }

  private validateBets(bets: BetType[], players: Player[]): { validBets: BetType[], errors: string[] } {
    let errors: string[] = [];
    let validBets: any = [];

    for (let bet of bets) {
      const { name, betPoints } = bet;
      const playerIndex = players.findIndex(p => p.name === name);
      if (playerIndex === -1) {
        errors.push(`Player ${name} does not exist.`);
        continue;
      }

      const validation = isValidBet(players[playerIndex], betPoints);
      if (!validation.isValid) {
        errors.push(validation.message);
        continue;
      }

      validBets.push(bet);
    }


    return { validBets, errors };
  }

  private handleErrors(errors: string[]) {
    console.log('Errors in some bets');
    this.emit('betErrors', { errors });
  }

  private updatePlayerData(players: Player[], validBets: BetType[]) {
    validBets.forEach(bet => {
      const { name, guess, betPoints } = bet;
      const player = players.find(p => p.name === name);
      if (player) { // Should always be true, but it's good to check
        player.points -= betPoints;
        player.betPoints = betPoints;
        player.guess = guess;
      }
    });
    savePlayerData(players);
  }

  private startRoundWithValidBets(validBets: BetType[]) {
    if (validBets.length === 0) {
      console.log('No valid bets to start the round.');
      return;
    }

    const speed = validBets[0].speed;
    this.startNewRound(speed);
  }



  private calculateResults(): void {
    const players = loadPlayerData();
    const finalMultiplier = this.state.multiplier;

    players.forEach(player => {
      if (player.guess !== null && player.betPoints > 0 && finalMultiplier >= player.guess) {

        const winnings = player.betPoints * player.guess;
        player.points += winnings;
        player.totalWinnings += winnings;
        player.won = true;
      } else {
        player.won = false;
      }

    });

    savePlayerData(players);
    console.log('23234', players);

    this.emit('resultsCalculated', { players });

    const rankBoard = this.generateRankBoard(players);
    this.emit('rankBoardGenerated', { rankBoard });



  }



  endRound() {
    this.calculateResults();
    this.state.isRoundActive = false;
    this.emit('roundCompleted', { isRoundActive: this.state.isRoundActive });
  }

  private generateRankBoard(players: Player[]): RankBoardEntry[] {
    return players.map(player => ({
      playerName: player.name,
      totalWinnings: player.totalWinnings,
    })).sort((a, b) => b.totalWinnings - a.totalWinnings);
  }


  public getCurrentGameState() {
    return this.state;
  }
}