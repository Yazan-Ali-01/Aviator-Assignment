import React from 'react';

interface InfoCardProps {
  text: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ text }) => {
  return (
    <div className="flex-grow bg-gradient-to-l from-gray-700 via-gray-900 to-black/60 text-slate-200 rounded-md flex justify-center items-center h-14">
      {text}
    </div>
  );
};

export default InfoCard;
