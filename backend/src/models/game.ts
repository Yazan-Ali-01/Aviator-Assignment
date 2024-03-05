import { EventEmitter } from 'events';
import { isValidNumber } from '../utils/isValidNumber';
import { deleteJsonDb, loadPlayerData, savePlayerData } from '../utils/checkInfo';
import { Player } from '../types/types';

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
    const min = 2;
    const max = 3;
    return Math.random() * (max - min) + min;
  }

  startNewRound(speed: number) {
    const finalMultiplier = this.getRandomFinalMultiplier();
    this.state.isRoundActive = true;
    this.state.multiplier = 0;

    const baseIncrement = 0.1;
    const increment = baseIncrement * speed;

    const updateMultiplier = () => {
      if (this.state.multiplier < finalMultiplier) {
        this.state.multiplier += increment;
        this.emit('multiplierUpdated', { multiplier: this.state.multiplier });
        setTimeout(updateMultiplier, 100);
      } else {
        this.endRound();
      }
    };

    updateMultiplier();
  }


  addPlayer(player: Player) {
    this.state.players.push(player);
    this.emit('playerAdded', { player });
  }

  registerPlayer(playerName: string, startingPoints: number = 1000, registerAutoPlayers: boolean = true) {
    deleteJsonDb()
    let players = loadPlayerData(); // Assuming this loads all player data
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
      isAuto: false, // Main player is not an auto player
      totalWinnings: 0,
    };

    players.push(newPlayer);
    newlyRegisteredPlayers.push(newPlayer); // Add the main player to the list of newly registered players

    // Check if we should also register auto players
    if (registerAutoPlayers) {
      const autoPlayerNames = ['AutoPlayer1', 'AutoPlayer2', 'AutoPlayer3', 'AutoPlayer4']; // Define your auto player names here
      autoPlayerNames.forEach(name => {
        const autoPlayer = {
          name: name,
          points: startingPoints,
          guess: 0,
          betPoints: 0,
          isAuto: true,
          totalWinnings: 0,
        };
        // Ensure no duplicate auto players are created
        if (!players.find(player => player.name === autoPlayer.name)) {
          players.push(autoPlayer);
          newlyRegisteredPlayers.push(autoPlayer); // Add each auto player to the list
        }
      });
    }

    savePlayerData(players); // Save all players, including auto players

    // Emit a single event with all newly registered players
    this.emit('playersRegistered', { players });
  }


  playerExists(playerName: string): boolean {
    const players = loadPlayerData();
    return !!players.find(player => player.name === playerName);
  }

  isValidBet(player: Player, betPoints: number) {
    // Check if betPoints is a number
    if (typeof betPoints !== 'number') {
      return { isValid: false, message: "Bet points must be a number." };
    }

    // Ensure betPoints is not NaN, negative, or a fractional value (if applicable)
    if (isNaN(betPoints) || betPoints <= 0 || !Number.isInteger(betPoints)) {
      return { isValid: false, message: "Bet points must be a positive integer." };
    }

    // Check if the player has enough points
    if (player.points < betPoints) {
      return { isValid: false, message: "Not enough points for the bet." };
    }


    return { isValid: true, message: "" };
  }


  processBetsAndStartRound(bets: Array<{ name: string; guess: number; betPoints: number; speed: number }>) {
    const players = loadPlayerData();
    let errors = [];
    let allBetsValid = true;

    // Iterate over bets to process each
    console.log(bets);

    for (let bet of bets) {
      const { name, guess, betPoints } = bet;
      const player = players.find(p => p.name === name);
      if (!player) {
        errors.push(`Player ${name} does not exist.`);
        console.log('player doesnt exist');
        allBetsValid = false;
        continue; // Move to the next bet if this one has issues
      }

      const validation = this.isValidBet(player, betPoints);
      if (!validation.isValid) {
        errors.push(validation.message);
        console.log(validation.message);
        console.log('no valid bit');
        allBetsValid = false;
        continue;
      }

      // Update player data for valid bets
      player.points -= betPoints;
      player.betPoints = betPoints;
      player.guess = guess;
    }

    if (!allBetsValid) {
      // Handle errors, possibly by emitting an error event with collected messages
      console.log('tessd');

      this.emit('betErrors', { errors });
      return;
    }

    // Save all player data after processing bets
    savePlayerData(players);

    // Start a new round if all bets are valid
    // Assuming the speed of the first bet is representative for simplicity
    const speed = bets[0].speed;
    this.startNewRound(speed);
  }


  private calculateResults(): void {
    const players = loadPlayerData();
    const finalMultiplier = this.state.multiplier;

    players.forEach(player => {
      if (player.guess !== null && player.betPoints > 0 && finalMultiplier >= player.guess) {
        // Player wins
        const winnings = player.betPoints * player.guess; // Calculate winnings based on the final multiplier
        player.points += winnings; // Update player's points with winnings
        player.totalWinnings += winnings; // Increment total winnings by the amount won this round
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
    this.state.isRoundActive = false;
    this.calculateResults();
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