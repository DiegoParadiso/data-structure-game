import React from 'react';
import Timer from './Timer'; // IMPORTANTE: importa Timer aquí

export default function HeaderGame({ onGoBack, expiryTimestamp, onTimeUp, stopTimer, streak }) {
  return (
    <div className="font-semibold w-full max-w-6xl flex items-center justify-between relative">
      <div
        onClick={onGoBack}
        className="cursor-pointer hover:underline z-10"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onGoBack()}
      >
        ← Volver
      </div>

      {expiryTimestamp && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
          <Timer expiryTimestamp={expiryTimestamp} onExpire={onTimeUp} stopTimer={stopTimer} />
        </div>
      )}

      {typeof streak !== 'undefined' && (
        <div className="font-semibold z-10 whitespace-nowrap">Racha: {streak}</div>
      )}
    </div>
  );
}
