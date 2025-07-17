import { useEffect, useState } from 'react';

const getTodayDate = () => new Date().toISOString().split('T')[0];
const DEBUG_DISABLE_LIMIT = true;

export default function useDailyStreak(gameKey) {
  const [canPlay, setCanPlay] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const today = getTodayDate();

    const gameData = data[gameKey];

    if (gameData) {
      const lastPlay = gameData.lastPlay;
      const playedToday = lastPlay === today;

      setStreak(gameData.streak);
      setCanPlay(!playedToday);
    }
  }, [gameKey]);

  const updateResult = (wasSuccess) => {
    const data = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const today = getTodayDate();
    const gameData = data[gameKey] || { streak: 0, lastPlay: null };

    let newStreak = wasSuccess
      ? gameData.lastPlay === getYesterdayDate()
        ? gameData.streak + 1
        : 1
      : 0;

    data[gameKey] = {
      lastPlay: today,
      playedToday: true,
      streak: newStreak,
    };

    localStorage.setItem('dailyProgress', JSON.stringify(data));
    setStreak(newStreak);
    setCanPlay(false);
  };

  return {
  canPlay: DEBUG_DISABLE_LIMIT ? true : canPlay,
  streak,
  updateResult,
};
}

const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};
