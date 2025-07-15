import { useState, useEffect } from 'react';
import { generateRandomNumbers } from '../utils/Helpers';
import useDailyStreak from './useDailyStreak';
import { validateBuckets, splitBucketHelper, extendBucketHelper } from './useBucketManager';
import { useTimerSetup } from './useTimerSetup';

const modeConfigs = {
  normal: { count: 8, maxNum: 15 },
  easy: { count: 5, maxNum: 15 },
  hard: { count: 16, maxNum: 20 },
};

export default function useHashingGame({ mode = 'normal', timer }) {
  const [available, setAvailable] = useState([]);
  const [buckets, setBuckets] = useState({ '0': [], '1': [] });
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [maxNumber, setMaxNumber] = useState(99);

  const { canPlay, streak, updateResult } = useDailyStreak('hashingex');

  // Timer hook maneja expiryTimestamp
  const expiryTimestamp = useTimerSetup(timer);

  // Bloquea si ya jugó hoy
  useEffect(() => {
    if (!canPlay) {
      setIsGameOver(true);
      setMessage('Ya jugaste hoy. ¡Volvé mañana!');
    }
  }, [canPlay]);

  // Configura dificultad y reinicia estado
  useEffect(() => {
    const { count, maxNum } = modeConfigs[mode] || modeConfigs.normal;
    setMaxNumber(maxNum);
    setAvailable(generateRandomNumbers(count, 0, maxNum).map((num) => ({ decimal: num })));
    setBuckets({ '0': Array(3).fill(null), '1': Array(3).fill(null) });
    setMessage('');
    setEnabledIndex(0);
    setIsGameOver(false);
    setGameStatus(null);
  }, [mode]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus('fail');
    setMessage('¡Se acabó el tiempo!');
    updateResult(false);
  };

  const handleDrop = (bucketId, value, slotIndex) => {
    if (isGameOver) return;
    setBuckets((prev) => {
      const updatedBucket = [...(prev[bucketId] || [])];
      updatedBucket[slotIndex] = value;
      const newBuckets = { ...prev, [bucketId]: updatedBucket };

      if (!validateBuckets(newBuckets, maxNumber)) {
        setIsGameOver(true);
        setGameStatus('fail');
        setMessage(`Nodo ${value.decimal || value} mal ubicado en bucket ${bucketId}`);
        updateResult(false);
        return prev;
      }

      const totalPlaced = Object.values(newBuckets)
        .flat()
        .filter((v) => v !== null && v !== undefined).length;

      if (totalPlaced === available.length) {
        setIsGameOver(true);
        setGameStatus('success');
        setMessage('¡Has colocado todos los nodos correctamente!');
        updateResult(true);
      }

      return newBuckets;
    });
    setEnabledIndex((prev) => prev + 1);
  };

  const splitBucket = (bucketId) => {
    setBuckets((prev) => splitBucketHelper(prev, bucketId, maxNumber, extendBucket));
  };

  const extendBucket = (bucketId) => {
    setBuckets((prev) => extendBucketHelper(prev, bucketId));
  };

  return {
    available,
    buckets,
    message,
    streak,
    enabledIndex,
    expiryTimestamp,
    isGameOver,
    gameStatus,
    handleTimeUp,
    handleDrop,
    splitBucket,
    extendBucket,
  };
}
