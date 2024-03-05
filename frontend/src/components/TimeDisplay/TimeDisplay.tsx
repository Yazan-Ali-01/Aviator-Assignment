import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  const tick = () => {
    setTime(new Date());
  };

  return (
    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  );
};

export default TimeDisplay;
