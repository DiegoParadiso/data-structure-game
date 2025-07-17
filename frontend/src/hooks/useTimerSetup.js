import { useEffect, useState } from 'react';

export function useTimerSetup(timer) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);

  useEffect(() => {
    let secondsToAdd = 0;

    if (typeof timer === 'string') {
      // Match strings
      const match = timer.match(/^(\d+)s$/);
      if (match) {
        secondsToAdd = parseInt(match[1], 10);
      }
    } else if (typeof timer === 'number') {
      secondsToAdd = timer;
    }

    if (secondsToAdd > 0) {
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + secondsToAdd);
      setExpiryTimestamp(expiry);
    } else {
      setExpiryTimestamp(null);
    }
  }, [timer]);

  return expiryTimestamp;
}
