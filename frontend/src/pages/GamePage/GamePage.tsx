// GamePage.jsx
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { BetManagement } from '../../components/BetManagement';
import { CurrentRoundTable } from '../../components/CurrentRoundTable';
import { MultiplierChart } from '../../components/MultiPlierChart';
import { PlayerRegistration } from '../../components/PlayerRegistration';
import RankingTable from '../../components/RankingTable/RankingTable';
import { ChatBox } from '../../components/ChatBox';
import { generateRandomBetPoints, generateRandomGuess } from '../../utils/randoms';
import InfoCard from '../../components/infoCard';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider';
import { TimeDisplay } from '../../components/TimeDisplay';
import { MultiplierDisplay } from '../../components/MultiplierDisplay';
import { toast } from 'react-toastify';

const TimeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

const PlayerIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>


const PointsIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
</svg>




const GamePage = () => {
  const { players, realPlayer, sendMessage, chatMessages } = useWebSocket();
  const { overallRanking } = useGameContext();
  const [betPoints, setBetPoints] = useState(50);
  const [guess, setGuess] = useState(1.50);
  const [speed, setSpeed] = useState(1);
  const [allBetsState, setAllBetsState] = useState([]);

  useEffect(() => {
    setAllBetsState(players);
  }, [players]);


  const handlePlaceBet = (betData) => {

    const isValidBet = (bet) => {
      const player = players.find(p => p.name === bet.name);
      if (!player) {
        toast.error(`Player ${bet.name} does not exist.`);
        return false;
      }

      if (bet.betPoints > player.points) {
        toast.error(`Player ${bet.name} does not have enough points, maximum available bet for this player is ${player.points}`);
        return false;
      }


      return true;
    };

    const autoPlayers = players.filter(player => player.isAuto);

    const autoPlayerBets = autoPlayers.map(autoPlayer => ({
      name: autoPlayer.name,
      guess: generateRandomGuess(betData.guess),
      betPoints: generateRandomBetPoints(autoPlayer.points),
      speed: betData.speed,
    })).filter(isValidBet); // Filter out invalid auto player bets

    // Validate the real player's bet
    const realPlayerBet = realPlayer && realPlayer.name ? {
      name: realPlayer.name,
      guess: betData.guess,
      betPoints: betData.betPoints,
      speed: betData.speed,
    } : null;

    if (realPlayerBet && isValidBet(realPlayerBet)) {
      // Combine valid auto player bets with the real player's valid bet
      const allBets = [realPlayerBet, ...autoPlayerBets];

      setAllBetsState(allBets); // Update state with valid bets

      sendMessage({
        type: 'betAndGuess',
        bets: allBets,
      });
    } else {
      console.error('No real player data available for placing bet, or the bet is invalid.');
    }
  };

  const handleRegister = (name: string) => {
    console.log(name);
    sendMessage({
      type: 'registerPlayer',
      name: name,
    });
  };

  const handleSendMessage = (message) => {
    if (message.trim()) {
      sendMessage({
        type: 'chatMessage',
        data: { sender: "You", message: message }, // Assuming "You" is a placeholder for the actual sender's name
      });
    }
  };

  return (
    <div className="bg-dark-900 text-white p-4 m-16">
      {/* Layout components */}
      <div className={`flex flex-wrap lg:flex-nowrap -mx-2 ${realPlayer ? 'items-start' : 'items-center'}`}>
        {/* Left column */}
        <div className="flex flex-col w-full lg:w-1/3 px-2 mb-4 space-y-2">
          {!realPlayer ? (
            // If there's no real player, show the registration component
            <PlayerRegistration onRegister={handleRegister} />
          ) : (
            // Otherwise, show the BetManagement component and related components
            <>
              <BetManagement
                speed={speed}
                onPlaceBet={handlePlaceBet}
                betPoints={betPoints}
                setBetPoints={setBetPoints}
                guess={guess}
                setGuess={setGuess}
              />
              <CurrentRoundTable bets={allBetsState} />
              <SpeedSlider value={speed} onSpeedChange={setSpeed} />
            </>
          )}
        </div>
        {/* Right column */}
        <div className="flex flex-col justify-between w-full lg:w-2/3 px-2">
          <div className='flex flex-row space-x-2'>
            <InfoCard label="Name" value={realPlayer ? realPlayer.name : ''} icon={PlayerIcon} />
            <InfoCard label="Points" value={`${realPlayer ? realPlayer.points : ''}`} icon={PointsIcon} />
            <InfoCard label="Time" value={realPlayer ? <TimeDisplay /> : ''} icon={TimeIcon} />
          </div>
          <div className='flex flex-row p-4 justify-center'>
            <MultiplierChart />
          </div>
        </div>
      </div>
      {/* Bottom row */}
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2">
          <RankingTable rankings={overallRanking} />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <ChatBox messages={chatMessages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>

  );

};

export default GamePage;

