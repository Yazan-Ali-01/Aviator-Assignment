import InfoCard from '../infoCard';
import { MultiplierChart } from '../MultiPlierChart';
import useCurrentTime from '../../hooks/useCurrentTime';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter.';
import { useWebSocket } from '../../contexts/WebSocketContext';

const MutliplierChart: React.FC = () => {
  const { realPlayer } = useWebSocket();



  const currentTime = useCurrentTime();


  const pointsText = realPlayer && realPlayer.points != null ? realPlayer.points.toString() : '';
  const nameText = realPlayer ? capitalizeFirstLetter(realPlayer.name) : '';
  const timeText = realPlayer ? currentTime : '';

  return (
    <div className="flex flex-col min-h-14 gap-4 mx-4">
      <div className='flex flex-row gap-4'>
        <InfoCard text={pointsText} />
        <InfoCard text={nameText} />
        <InfoCard text={timeText} />
      </div>
      <MultiplierChart />
    </div>
  );
};

export default MutliplierChart;
