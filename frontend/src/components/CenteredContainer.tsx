import React, { ReactNode, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface CenteredContainerProps {
  children: ReactNode;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({ children }) => {

  const { multiplier } = useWebSocket();
  useEffect(() => {
    console.log("Multiplier changed to:", multiplier);
  }, [multiplier]);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen w-10/12 bg-orange-500 mx-auto">
        {children}
      </div>
    </>

  );
};

export default CenteredContainer;
