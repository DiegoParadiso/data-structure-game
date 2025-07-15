import { useEffect, useState } from 'react';

const timeMapping = { '90s': 90, '60s': 60, '35s': 35 };

export function useTimerSetup(timer) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);

  useEffect(() => {
    const secondsToAdd = timeMapping[timer] || 0;
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
