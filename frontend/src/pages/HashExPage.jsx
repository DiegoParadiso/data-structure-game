import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import DraggableNode from '../components/common/DraggableNode';
import HashingZone from '../components/HashGame/HashingZone';
import CustomDragLayer from '../components/common/CustomDragLayer';
import HeaderGame from '../components/common/Header'; 
import useHashingGame from '../hooks/useHashingGame';

function HashingGame() {
  const { state } = useLocation();
  const { mode = 'normal', timer } = state || {};
  const navigate = useNavigate();

  const {
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
  } = useHashingGame({ mode, timer });

  const handleGoBack = () => navigate('/');

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div
        className={`transition-colors duration-700 min-h-screen ${
          gameStatus === 'success' ? 'bg-flash-green' : gameStatus === 'fail' ? 'bg-flash-red' : 'bg-white'
        }`}
      >
        <div className="flex flex-col items-center p-4 space-y-4">
          <HeaderGame
            onGoBack={handleGoBack}
            expiryTimestamp={timer !== 'noTimer' ? expiryTimestamp : null}
            onTimeUp={handleTimeUp}
            stopTimer={isGameOver}
            streak={streak}
          />

          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col w-full md:w-[25%]">
              <div className="p-2 border rounded bg-gray-50 h-[300px]">
                <h2 className="font-bold mb-2">Nodos:</h2>
                <div className="flex flex-wrap justify-center">
                  {available.map((val, index) => (
                    <DraggableNode
                      key={val.decimal}
                      value={val.decimal}
                      isEnabled={index === enabledIndex && !isGameOver}
                    />
                  ))}
                </div>
              </div>
              {message && (
                <div className="mt-4 text-center font-semibold text-lg">
                  <span className={gameStatus === 'fail' ? 'text-red-700' : 'text-green-700'}>{message}</span>
                </div>
              )}
            </div>

            <div className="w-full md:w-[80%] p-2 border rounded bg-gray-50 min-h-[500px]">
              <h2 className="font-bold mb-2">Zona de Hashing:</h2>
              <ArcherContainer strokeColor="gray" strokeWidth={2}>
                <HashingZone
                  buckets={buckets}
                  onDrop={handleDrop}
                  splitBucket={splitBucket}
                  extendBucket={extendBucket}
                  isGameOver={isGameOver}
                />
              </ArcherContainer>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default HashingGame;
