import fs from 'fs';
import path from 'path';
import { Player } from '../types/types';

// Path to the 'db' folder inside 'src'
const dbPath = path.join(path.dirname(require!.main!.filename), '..', 'db', 'playerData.json');

export function savePlayerData(players: Record<string, any>) {
  // Ensure the 'db' directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Save player data along with WebSocket connections to the JSON file
  const dataToSave = Object.values(players).map(player => ({
    ...player
  }));

  fs.writeFileSync(dbPath, JSON.stringify(dataToSave, null, 2), 'utf8');
}

export function loadPlayerData(): Player[] {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data); // Directly return the array
  } catch (error) {
    return []; // Return an empty array if there's an error or if the file doesn't exist
  }
}

export function jsonDbExists() {
  return fs.existsSync(dbPath);
}

// Utility function to delete the JSON database
export function deleteJsonDb() {
  if (jsonDbExists()) {
    fs.unlinkSync(dbPath);
  }
}
