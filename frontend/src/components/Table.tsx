import React from 'react';
import { Player } from '../types/types';

interface TableProps {
  title: string;
  headers: string[];
  data: Player[] | null;
}

const Table: React.FC<TableProps> = ({ title, headers, data }) => {
  if (!data) return null;



  const filledData = [...data];
  while (filledData.length < 5) {
    const placeholder = { name: '-', guess: '-', betPoints: '-', totalWinnings: '-', won: undefined };
    filledData.push(placeholder as unknown as Player);
  }

  const hasRanking = headers.includes("No.");
  const headerPropertyMapping = {
    "Name": "name",
    "Player Name": "playerName",
    "Guess": "guess",
    "Points": "betPoints",
    "Score": "totalWinnings",
  };

  const renderCellValue = (player, header) => {
    if (header === "Points") {
      // Check if the player has won and calculate points accordingly
      return player.won ? `${player.betPoints * player.guess}` : player.betPoints;
    }
    // Handle other cell values normally
    return player[headerPropertyMapping[header]] ?? '-';
  };


  const getCellStyle = (row: Player, includeColor: boolean) => {
    if (!includeColor) return undefined;
    if (row.won === true) return { color: 'green' };
    if (row.won === false) return { color: 'red' };
    return undefined;
  };

  return (
    <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
      <div className="py-2">
        <h2 className="text-lg leading-6 font-medium text-white">{title}</h2>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filledData.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {headers.map((header, index) => {
                if (header === "No.") {
                  // Handle "No." column specifically
                  return (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {rowIndex + 1}
                    </td>
                  );
                } else {
                  // Handle other columns based on headerPropertyMapping
                  return (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white" style={getCellStyle(row, !hasRanking)}>
                      {renderCellValue(row, header)}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
