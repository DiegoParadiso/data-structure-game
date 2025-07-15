import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import DraggableNode from '../components/DraggableNode';
import DropZone from '../components/DropZone';
import TreeNode from '../components/TreeNode';
import CustomDragLayer from '../components/CustomDragLayer';
import useBSTGame from '../hooks/useBSTGame';
import HeaderGame from '../components/Header'; 

function BSTGame() {
  const { state } = useLocation();
  const { mode = 'normal', timer } = state || {};
  const navigate = useNavigate();

  const {
    available,
    tree,
    message,
    enabledIndex,
    expiryTimestamp,
    isGameOver,
    gameStatus,
    errorNode,
    streak,
    handleTimeUp,
    handleAddChild,
    handleAddRoot,
    handleVerify,
  } = useBSTGame({ mode, timer, updateResult: (res) => console.log('Resultado:', res) });

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
            <div className="flex flex-col w-full md:w-[20%]">
              <div className="p-2 border rounded bg-gray-50 h-[300px]">
                <h2 className="font-bold mb-2">Nodos:</h2>
                <div className="flex flex-wrap justify-center">
                  {available.map((val, index) => (
                    <DraggableNode key={val} value={val} isEnabled={index === enabledIndex && !isGameOver} />
                  ))}
                </div>
              </div>
              {message && (
                <div className="mt-4 flex items-center justify-center">
                  <span className={`font-semibold ${gameStatus === 'fail' ? 'text-red-700' : 'text-green-700'}`}>
                    {message}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full md:w-[80%] p-2 border rounded bg-gray-50 min-h-[500px]">
              <h2 className="font-bold mb-2">Construcción del árbol:</h2>
              <div className="flex justify-center">
                <ArcherContainer strokeColor="gray" strokeWidth={2}>
                  {tree ? (
                    <TreeNode node={tree} onAddChild={handleAddChild} />
                  ) : (
                    <DropZone onDrop={handleAddRoot} isEnabled={!isGameOver} />
                  )}
                </ArcherContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default BSTGame;
