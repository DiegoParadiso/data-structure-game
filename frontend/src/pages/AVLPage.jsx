import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer, ArcherElement } from 'react-archer';
import DraggableNode from '../components/DraggableNode';
import HashingZone from '../components/HashingZone';
import { generateRandomNumbers } from '../utils/bstHelpers';
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
    // Generar números aleatorios entre 0 y 15 (puedes ajustar el rango según tus necesidades)
    const generated = generateRandomNumbers(8, 0, 15).map(num => ({
      decimal: num, // Guardamos el número decimal
    }));
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
  // Definimos la función splitBucket, que se encarga de dividir un bucket lleno.
  const splitBucket = (bucketId) => {
    setBuckets(prev => {
      const items = prev[bucketId];
      // Ejemplo: se crean dos nuevos buckets con clave bucketId+'0' y bucketId+'1'
      const newKey0 = bucketId + '0';
      const newKey1 = bucketId + '1';
      // Distribuimos los elementos: si son pares van a newKey0, impares a newKey1 (puedes ajustar el criterio)
      const bucket0 = items.filter(val => val % 2 === 0);
      const bucket1 = items.filter(val => val % 2 !== 0);
      const newBuckets = { ...prev };
      delete newBuckets[bucketId];
      newBuckets[newKey0] = bucket0;
      newBuckets[newKey1] = bucket1;
      return newBuckets;
    });
  };
  return (
    <DndProvider backend={HTML5Backend}>
          <CustomDragLayer />
      <div className="flex flex-col items-center p-4 space-y-4">
        {/* TIMER */}

        {/* Contenedor principal */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
          
          {/* Números disponibles */}
          <div className="flex flex-col w-full md:w-[20%]">
            <div className="p-2 border rounded bg-gray-50 h-[300px]">
              <h2 className="font-bold mb-2">Nodos:</h2>
              <div className="flex flex-wrap justify-center">
                {available.map((val, index) => (
                  <DraggableNode
                    key={val.decimal} // Usamos el valor decimal para la clave
                    value={val.decimal} // Mostramos el valor decimal
                    isEnabled={index === enabledIndex && !isGameOver}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button>Verificar</button>
            </div>

            {/* Mensaje final */}
            {message && (
              <div className="mt-4 flex items-center justify-center">
                <span className={`font-semibold ${gameStatus === "fail" ? "text-red-700" : "text-green-700"}`}>
                  {message}
                </span>
              </div>
            )}
          </div>

          {/* HashingZone */}
          <div className="w-full md:w-[80%] p-2 border rounded bg-gray-50 min-h-[500px]">
            <h2 className="font-bold mb-2">Construcción de Hashing:</h2>
            <ArcherContainer strokeColor="black" strokeWidth={2}>
<HashingZone key="hashing-zone" buckets={buckets} handleDrop={handleDrop} splitBucket={splitBucket} />
            </ArcherContainer>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default HashingGame;