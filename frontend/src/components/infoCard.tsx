import React, { ReactNode } from 'react';

interface InfoCardProps {
  label: string;
  value: string | number | ReactNode
  icon?: ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex flex-1 flex-row bg-gradient-to-l from-gray-700 via-gray-900 to-black/60 text-slate-200 rounded-md h-14 px-4 items-center justify-center min-w-0">
      {icon && <div className="mr-2 flex items-center justify-center">{icon}</div>}
      <div className="flex flex-col items-center justify-center flex-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
};


export default InfoCard;
