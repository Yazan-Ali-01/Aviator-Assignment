
import React, { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { MutliplierChart } from '../../components/MutliplierChart';
import NumberInput from '../../components/NumberInput';
import Table from '../../components/Table';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { generateRandomBetPoints, generateRandomGuess } from '../../utils/randoms';
import { ChatBox } from '../../components/ChatBox';
import { WebSocketMessage } from '../../types/types';


const GamePage: React.FC = () => {
  const { sendMessage, players, realPlayer, chatMessages, multiplier } = useWebSocket();

  const handleSendMessage = (message: string) => {
    const chatMessage: WebSocketMessage = {
      type: 'chatMessage',
      data: { sender: realPlayer?.name || "You", message },
    };

    sendMessage(chatMessage);
  };
  const { registerPlayer } = useGameContext();

  const [allBetsState, setAllBetsState] = useState([]);

  useEffect(() => {
    const tablePlayers = players.map(player => ({
      name: player.name,
      guess: player.guess,
      betPoints: player.betPoints,
      won: player.won
    }));


    setAllBetsState(tablePlayers);
  }, [players]);
  const [betPoints, setBetPoints] = useState<number>(50);
  const [multiplierGuess, setMultiplierGuess] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1);

  console.log(multiplier);


  const handleValueChange = (value: number, type: string) => {
    if (type === 'Points') {
      setBetPoints(value);
    } else if (type === 'Multiplier') {
      setMultiplierGuess(value);
    }
  };

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const isDisabled = event.target.value.length < 3;
    setIsButtonDisabled(isDisabled);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleRegister = () => {
    if (nameInputRef.current) {
      const name = nameInputRef.current.value;
      console.log(name)
      if (name.length >= 3) {
        registerPlayer(name);
      }
    }
  };

  const handlePlaceBet = () => {
    const playerBet = {
      name: realPlayer.name,
      guess: multiplierGuess,
      betPoints: betPoints,
      speed: speed,
    };


    const autoPlayers = players.filter(player => player.isAuto);
    const autoPlayersBets = autoPlayers.map(player => ({
      name: player.name,
      guess: generateRandomGuess(multiplierGuess),
      betPoints: generateRandomBetPoints(player.points),
      speed: speed,
    }));


    const allBets = [playerBet, ...autoPlayersBets];


    const allBetsWithoutSpeed = allBets.map(({ speed, ...rest }) => rest);

    setAllBetsState(allBetsWithoutSpeed);
    console.log(allBetsWithoutSpeed);


    sendMessage({
      type: 'betAndGuess',
      bets: allBets,
    });
  };


  return (
    <div className='flex flex-col'>
      <div className="flex w-full items-center justify-center bg-none ">
        <div className="min-w-[80%] flex ">
          <div className="w-4/12 flex-col justify-between mb-auto items-center space-y-4">
            {realPlayer && realPlayer !== null ? (
              <>
                <div className='flex flex-row space-x-4'>
                  <NumberInput text='Multiplier' type="Multiplier" onValueChange={handleValueChange} startFrom={1.00} increaseBy={0.25} />
                  <NumberInput text='Points' type="Points" onValueChange={handleValueChange} startFrom={50} increaseBy={25} />
                </div>

                <button
                  onClick={handlePlaceBet}
                  type="button"
                  className={`w-full focus:outline-none min-w-[300px] text-white bg-gradient-to-r from-rose-400 to-orange-400 hover:opacity-90 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}
                >
                  Start
                </button>
                <div className='flex flex-row space-x-4'>
                  <Table title="Current Round" headers={["Name", "Guess", "Points"]} data={allBetsState} />
                </div>
                <SpeedSlider onSpeedChange={handleSpeedChange} />
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className='min-w-[300px] space-y-4'>
                  <label htmlFor="name" className="block mb-2 text-xs font-medium  dark:text-white/45 text-center">Please Insert Your Name</label>
                  <input type="text" onChange={handleInputChange} ref={nameInputRef} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button
                  onClick={handleRegister}
                  type="button"
                  disabled={isButtonDisabled}
                  className={`focus:outline-none min-w-[300px] text-white bg-gradient-to-r from-rose-400 to-orange-400 hover:opacity-90 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Accept
                </button>

              </div>
            )}
          </div>
          <div className="w-8/12 justify-center items-center">
            <MutliplierChart />
            <span className='text-white mx-auto'> Multiplier: {multiplier.toFixed(2)}x</span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-none mt-4">
        <div className="min-w-[80%] flex space-x-5">
          <div className="w-7/12 ">
            <Table title="Ranking" headers={["No.", "Name", "Score"]} data={players} />
          </div>
          <div className="w-5/12">
            <ChatBox messages={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
