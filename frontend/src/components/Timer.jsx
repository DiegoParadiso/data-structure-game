import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

const Timer = ({ expiryTimestamp, onExpire, stopTimer }) => {
  const { seconds, minutes, hours, pause } = useTimer({
    expiryTimestamp,
    onExpire,
  });

  // Si stopTimer es true, pausa el cronómetro
  useEffect(() => {
    if (stopTimer) {
      pause();
    }
  }, [stopTimer, pause]);

  return (
    <div className="text-center">
      <p className="text-xl font-bold">
        {hours > 0 && `${hours < 10 ? `0${hours}` : hours}:`}
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default Timer;