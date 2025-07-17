import { useState, useEffect } from 'react';
import useDailyStreak from './useDailyStreak';
import { useTimerSetup } from './useTimerSetup';

export default function useDailyGameBase(gameKey, timer, updateResultExternal) {
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  const { canPlay, streak, updateResult: updateResultInternal } = useDailyStreak(gameKey);
  const expiryTimestamp = useTimerSetup(timer);

  const updateResults = (res) => {
    if (updateResultExternal) updateResultExternal(res);
    updateResultInternal(res);
  };

  useEffect(() => {
    if (!canPlay) {
      setIsGameOver(true);
      setMessage('Ya has jugado ¡Volvé mañana!');
    }
  }, [canPlay]);

  return {
    message,
    setMessage,
    enabledIndex,
    setEnabledIndex,
    isGameOver,
    setIsGameOver,
    gameStatus,
    setGameStatus,
    streak,
    expiryTimestamp,
    updateResults,
  };
}
