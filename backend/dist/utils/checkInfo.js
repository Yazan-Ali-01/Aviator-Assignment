"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJsonDb = exports.jsonDbExists = exports.loadPlayerData = exports.savePlayerData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Path to the 'db' folder inside 'src'
const dbPath = path_1.default.join(path_1.default.dirname(require.main.filename), '..', 'db', 'playerData.json');
function savePlayerData(players) {
    // Ensure the 'db' directory exists
    const dbDir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dbDir)) {
        fs_1.default.mkdirSync(dbDir, { recursive: true });
    }
    // Save player data along with WebSocket connections to the JSON file
    const dataToSave = Object.values(players).map(player => ({
        ...player
    }));
    fs_1.default.writeFileSync(dbPath, JSON.stringify(dataToSave, null, 2), 'utf8');
}
exports.savePlayerData = savePlayerData;
function loadPlayerData() {
    try {
        const data = fs_1.default.readFileSync(dbPath, 'utf8');
        return JSON.parse(data); // Directly return the array
    }
    catch (error) {
        return []; // Return an empty array if there's an error or if the file doesn't exist
    }
}
exports.loadPlayerData = loadPlayerData;
function jsonDbExists() {
    return fs_1.default.existsSync(dbPath);
}
exports.jsonDbExists = jsonDbExists;
// Utility function to delete the JSON database
function deleteJsonDb() {
    if (jsonDbExists()) {
        fs_1.default.unlinkSync(dbPath);
    }
}
exports.deleteJsonDb = deleteJsonDb;
