import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

const MultiplierDisplay = () => {
  const { multiplier } = useWebSocket();



  return (
    <span>{multiplier.toFixed(2)}</span>
  );
};

export default MultiplierDisplay;
