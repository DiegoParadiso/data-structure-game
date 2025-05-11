import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer, ArcherElement } from 'react-archer';
import DraggableNode from '../components/DraggableNode';
import HashingZone from '../components/HashingZone';
import { generateRandomNumbers } from '../utils/Helpers';
import CustomDragLayer from '../components/CustomDragLayer';
import Timer from '../components/Timer';

function HashingGame() {
  const [available, setAvailable] = useState([]); // Números disponibles
  const [buckets, setBuckets] = useState({ 0: [], 1: [] }); // Buckets
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    const generated = generateRandomNumbers(8, 0, 15).map(num => ({ decimal: num }));
    setAvailable(generated);
  }, []);

  const handleDrop = (bucketId, value, slotIndex) => {
    if (isGameOver) return;

    setBuckets(prev => {
      const updatedBucket = [...prev[bucketId]];
      updatedBucket[slotIndex] = value;
      return { ...prev, [bucketId]: updatedBucket };
    });

    setEnabledIndex(prev => prev + 1);
  };

  const splitBucket = (bucketId) => {
    setBuckets(prev => {
      const items = prev[bucketId];
      const newKey0 = bucketId + '0';
      const newKey1 = bucketId + '1';
      const bucket0 = items.filter(val => val % 2 === 0);
      const bucket1 = items.filter(val => val % 2 !== 0);
      const newBuckets = { ...prev };
      delete newBuckets[bucketId];
      newBuckets[newKey0] = bucket0;
      newBuckets[newKey1] = bucket1;
      return newBuckets;
    });
  };

  const extendBucket = (bucketId) => {
    setBuckets(prev => {
      const newBucket = prev[bucketId];
      const newSize = newBucket.length * 2;
      const extendedBucket = [...newBucket, ...Array(newSize - newBucket.length).fill(null)];
      return { ...prev, [bucketId]: extendedBucket };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="flex flex-col items-center p-4 space-y-4">
        {/* Contenedor principal */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
          
          {/* Números disponibles */}
          <div className="flex flex-col w-full md:w-[20%]">
            <div className="p-2 border rounded bg-gray-50 h-[300px]">
              <h2 className="font-bold mb-2">Nodos:</h2>
              <div className="flex flex-wrap justify-center">
                {available.map((val, index) => (
                  <DraggableNode key={val.decimal} value={val.decimal} isEnabled={index === enabledIndex && !isGameOver} />
                ))}
              </div>
            </div>
          </div>

          {/* HashingZone */}
          <div className="w-full md:w-[80%] p-2 border rounded bg-gray-50 min-h-[500px]">
            <h2 className="font-bold mb-2">Construcción de Hashing:</h2>
            <ArcherContainer strokeColor="black" strokeWidth={2}>
              <HashingZone key="hashing-zone" buckets={buckets} handleDrop={handleDrop} splitBucket={splitBucket} extendBucket={extendBucket} />
            </ArcherContainer>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default HashingGame;