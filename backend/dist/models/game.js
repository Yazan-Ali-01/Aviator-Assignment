"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const events_1 = require("events");
const checkInfo_1 = require("../utils/checkInfo");
const isValidBet_1 = require("../utils/isValidBet");
class GameManager extends events_1.EventEmitter {
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
    getRandomFinalMultiplier() {
        const min = 6;
        const max = 9;
        return Math.random() * (max - min) + min;
    }
    startNewRound(speed) {
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
            }
            else {
                this.endRound();
            }
        };
        updateMultiplier();
    }
    registerPlayer(playerName, startingPoints = 1000, registerAutoPlayers = true) {
        (0, checkInfo_1.deleteJsonDb)();
        let players = (0, checkInfo_1.loadPlayerData)();
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
        (0, checkInfo_1.savePlayerData)(players);
        this.emit('playersRegistered', { players });
    }
    playerExists(playerName) {
        const players = (0, checkInfo_1.loadPlayerData)();
        return !!players.find(player => player.name === playerName);
    }
    processBetsAndStartRound(bets) {
        const players = (0, checkInfo_1.loadPlayerData)();
        const { validBets, errors } = this.validateBets(bets, players);
        if (errors.length > 0) {
            this.handleErrors(errors);
            return;
        }
        this.updatePlayerData(players, validBets);
        this.startRoundWithValidBets(validBets);
    }
    validateBets(bets, players) {
        let errors = [];
        let validBets = [];
        for (let bet of bets) {
            const { name, betPoints } = bet;
            const playerIndex = players.findIndex(p => p.name === name);
            if (playerIndex === -1) {
                errors.push(`Player ${name} does not exist.`);
                continue;
            }
            const validation = (0, isValidBet_1.isValidBet)(players[playerIndex], betPoints);
            if (!validation.isValid) {
                errors.push(validation.message);
                continue;
            }
            validBets.push(bet);
        }
        return { validBets, errors };
    }
    handleErrors(errors) {
        console.log('Errors in some bets');
        this.emit('betErrors', { errors });
    }
    updatePlayerData(players, validBets) {
        validBets.forEach(bet => {
            const { name, guess, betPoints } = bet;
            const player = players.find(p => p.name === name);
            if (player) { // Should always be true, but it's good to check
                player.points -= betPoints;
                player.betPoints = betPoints;
                player.guess = guess;
            }
        });
        (0, checkInfo_1.savePlayerData)(players);
    }
    startRoundWithValidBets(validBets) {
        if (validBets.length === 0) {
            console.log('No valid bets to start the round.');
            return;
        }
        const speed = validBets[0].speed;
        this.startNewRound(speed);
    }
    calculateResults() {
        const players = (0, checkInfo_1.loadPlayerData)();
        const finalMultiplier = this.state.multiplier;
        players.forEach(player => {
            if (player.guess !== null && player.betPoints > 0 && finalMultiplier >= player.guess) {
                const winnings = player.betPoints * player.guess;
                player.points += winnings;
                player.totalWinnings += winnings;
                player.won = true;
            }
            else {
                player.won = false;
            }
        });
        (0, checkInfo_1.savePlayerData)(players);
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
    generateRankBoard(players) {
        return players.map(player => ({
            playerName: player.name,
            totalWinnings: player.totalWinnings,
        })).sort((a, b) => b.totalWinnings - a.totalWinnings);
    }
    getCurrentGameState() {
        return this.state;
    }
}
exports.GameManager = GameManager;
