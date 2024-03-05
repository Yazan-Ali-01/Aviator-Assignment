export const generateRandomGuess = (baseGuess: number) => {
  // Calculate the multiplier increment
  const increment = Math.floor(Math.random() * 50) * 0.25; // Generates 0, 0.25, 0.5, 0.75
  const guess = Math.floor(baseGuess) + increment; // Ensures guess is based on full number plus the increment
  return guess;
}

export const generateRandomBetPoints = (maxPoints: number) => {
  // Ensure the bet is at least 1 point but does not exceed the player's available points
  return Math.floor(Math.random() * maxPoints) + 1;
};