import React from 'react';
import { useTimer } from 'react-timer-hook';

const Timer = ({ expiryTimestamp, onTimeUp }) => {
  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: onTimeUp,
  });

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