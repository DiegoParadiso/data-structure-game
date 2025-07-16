import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CustomDragLayer from '../components/common/CustomDragLayer';
import HeaderGame from '../components/common/Header'; 
import HeapAvailableNodes from '../components/HeapGame/HeapAvailableNodes';
import HeapTreeContainer from '../components/HeapGame/HeapTreeContainer';

import { useHeapGame } from '../hooks/useHeapGame';

export default function HeapPage() {
  const { state } = useLocation();
  const { timer, heapType: heapTypeFromState, mode = 'normal' } = state || {};
  const navigate = useNavigate();

  const updateResult = (success) => {
    // actualizar streak o backend si necesitás
  };

  const {
    heapType,
    tree,
    hiddenNodeIds,
    expiryTimestamp,
    isGameOver,
    message,
    gameStatus,
    streak,  // <-- pasamos streak al header
    handleTimeUp,
    handleSwapValues,
    handleVerify,
  } = useHeapGame({ mode, heapTypeFromState, timer, updateResult });

  const handleGoBack = () => navigate('/');

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div
        className={`transition-colors duration-700 min-h-screen ${
          gameStatus === "success"
            ? "bg-flash-green"
            : gameStatus === "fail"
            ? "bg-flash-red"
            : "bg-white"
        }`}
      >
        <div className="flex flex-col items-center p-4 space-y-4">
          <HeaderGame
            onGoBack={handleGoBack}
            expiryTimestamp={expiryTimestamp}
            onTimeUp={handleTimeUp}
            stopTimer={isGameOver}
            streak={streak}  // <--- Pasamos streak aquí
          />

          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start md:space-y-0 md:space-x-4">
            <HeapAvailableNodes
              tree={tree}
              message={message}
              gameStatus={gameStatus}
              isGameOver={isGameOver}
              onVerify={handleVerify}
            />

            <HeapTreeContainer
              tree={tree}
              onSwapValues={handleSwapValues}
              isGameOver={isGameOver}
              hiddenNodeIds={hiddenNodeIds}
              mode={mode}
              heapType={heapType}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
