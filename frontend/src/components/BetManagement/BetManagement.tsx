// BetManagement.jsx
import React from 'react';
import NumberInput from '../NumberInput'; // Assuming you have this component

const BetManagement = ({ onPlaceBet, betPoints, setBetPoints, guess, setGuess, speed }) => {
  const handlePlaceBetClick = () => {
    onPlaceBet({ betPoints, guess, speed });
  };

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex space-x-4'>
        <NumberInput label="Points" value={betPoints} onChange={setBetPoints} step={25} />
        <NumberInput label="Multiplier Guess" value={guess} onChange={setGuess} step={0.25} />
      </div>
      <button className="w-full bg-red-500 text-white py-2 rounded-md" onClick={handlePlaceBetClick}>
        Start
      </button>
    </div>
  );
};

export default BetManagement;
