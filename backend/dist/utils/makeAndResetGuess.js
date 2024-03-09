"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetGuess = exports.makeGuess = void 0;
function makeGuess(player, guess, betPoints) {
    return { ...player, guess, betPoints };
}
exports.makeGuess = makeGuess;
// Function to reset a player's guess
function resetGuess(player) {
    return { ...player, guess: 0, betPoints: 0 };
}
exports.resetGuess = resetGuess;
