import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';
import DraggableNode from '../components/DraggableNode';
import HashingZone from '../components/HashingZone';
import { generateRandomNumbers } from '../utils/Helpers';
import CustomDragLayer from '../components/CustomDragLayer';
import Timer from '../components/Timer';

function HashingGame() {
  const { state } = useLocation();
  const { mode = 'normal', timer } = state || {};
  const navigate = useNavigate();

  const [available, setAvailable] = useState([]);
  const [buckets, setBuckets] = useState({ '0': [], '1': [] });
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);

  // Para guardar el maxNumber según rango (0 a maxNumber)
  const [maxNumber, setMaxNumber] = useState(99);

  // Calcula la cantidad total de bits necesarios para representar maxNumber
  const getTotalBits = (max) => {
    return Math.ceil(Math.log2(max + 1));
  };

  // Valida si el nodo está correctamente colocado en bucketId según maxNumber
  const isNodeCorrectlyPlaced = (bucketId, node) => {
    if (!node || node.decimal === undefined || node.decimal === null) return true;
    const totalBits = getTotalBits(maxNumber);
    const binaryValue = node.decimal.toString(2).padStart(totalBits, '0');
    const bucketLength = bucketId.length;
    const nodeBitsRelevant = binaryValue.slice(-bucketLength);
    // console.log(`Chequeando nodo ${node.decimal}: bin=${binaryValue}, bucketId=${bucketId}, bitsRelevantes=${nodeBitsRelevant}`);
    return nodeBitsRelevant === bucketId;
  };

  const validateBuckets = (buckets) => {
    for (const bucketId in buckets) {
      const bucket = buckets[bucketId];
      if (!bucket) continue;

      // Ignoramos buckets completamente vacíos
      if (bucket.every(node => node === null || node === undefined)) continue;

      const bucketLength = bucketId.length;

      for (const node of bucket) {
        if (node === null || node === undefined) continue;

        let number;
        if (typeof node === 'number') {
          number = node;
        } else if (node && node.decimal !== undefined) {
          number = node.decimal;
        } else {
          // Nodo sin valor numérico válido
          return false;
        }

        const totalBits = getTotalBits(maxNumber);
        const binaryValue = number.toString(2).padStart(totalBits, '0');
        const nodeBitsRelevant = binaryValue.slice(-bucketLength);

        if (nodeBitsRelevant !== bucketId) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    let count = 8;
    let maxNum = 15;
    if (mode === 'easy') {
      count = 5;
      maxNum = 15;
    } else if (mode === 'hard') {
      count = 12;
      maxNum = 15;
    }
    setMaxNumber(maxNum);

    const generated = generateRandomNumbers(count, 0, maxNum).map(num => ({ decimal: num }));
    setAvailable(generated);

    // Inicializar buckets con 4 slots vacíos cada uno
    const initialBuckets = {
      '0': Array(4).fill(null),
      '1': Array(4).fill(null),
    };
    setBuckets(initialBuckets);

    setMessage('');
    setEnabledIndex(0);
    setIsGameOver(false);
    setGameStatus(null);
  }, [mode]);

  useEffect(() => {
    const timeMapping = { '35s': 35, '20s': 20, '15s': 15 };
    const secondsToAdd = timeMapping[timer] || 0;

    if (secondsToAdd > 0) {
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + secondsToAdd);
      setExpiryTimestamp(expiry);
    }
  }, [timer]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus("fail");
    setMessage('¡Se acabó el tiempo!');
  };

  const handleDrop = (bucketId, value, slotIndex) => {
  if (isGameOver) return;

  // Validar si el nodo está correctamente ubicado ya que lo acabamos de poner
  if (!isNodeCorrectlyPlaced(bucketId, value)) {
    setIsGameOver(true);
    setGameStatus("fail");
    setMessage(`Nodo ${value.decimal || value} mal ubicado en bucket ${bucketId}`);
    return; // salimos para no actualizar buckets con error
  }

  setBuckets(prev => {
    const updatedBucket = [...(prev[bucketId] || [])];
    updatedBucket[slotIndex] = value;
    const newBuckets = { ...prev, [bucketId]: updatedBucket };

    const totalPlaced = Object.values(newBuckets).flat().filter(Boolean).length;

    if (totalPlaced === available.length) {
      const allCorrect = validateBuckets(newBuckets);
      if (allCorrect) {
        setIsGameOver(true);
        setGameStatus("success");
        setMessage('¡Has colocado todos los nodos correctamente!');
      } else {
        setIsGameOver(true);
        setGameStatus("fail");
        setMessage('Algunos nodos están mal colocados o faltan por colocar.');
      }
    } else {
      setMessage('');
    }

    return newBuckets;
  });

  setEnabledIndex(prev => prev + 1);
};

  const splitBucket = (bucketId) => {
    setBuckets(prev => {
      const items = prev[bucketId] || [];
      // Dividir según par/impar decimal
      const bucket0Items = items.filter(val => val !== null && val.decimal % 2 === 0);
      const bucket1Items = items.filter(val => val !== null && val.decimal % 2 !== 0);

      // Crear buckets nuevos con 4 slots (rellenados con null si falta)
      const fillToSize = (arr, size = 4) => {
        const filled = [...arr];
        while (filled.length < size) filled.push(null);
        return filled;
      };

      const newKey0 = bucketId + '0';
      const newKey1 = bucketId + '1';

      const newBuckets = { ...prev };
      delete newBuckets[bucketId];
      newBuckets[newKey0] = fillToSize(bucket0Items);
      newBuckets[newKey1] = fillToSize(bucket1Items);

      return newBuckets;
    });
  };

  const extendBucket = (bucketId) => {
    setBuckets(prev => {
      const current = prev[bucketId] || [];
      const newSize = current.length * 2 || 2;
      const extended = [...current];
      while (extended.length < newSize) extended.push(null);

      return { ...prev, [bucketId]: extended };
    });
  };

  const handleGoBack = () => {
    navigate('/');
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className={`transition-colors duration-700 min-h-screen ${
        gameStatus === "success" ? "bg-flash-green" : gameStatus === "fail" ? "bg-flash-red" : "bg-white"
      }`}>
        <div className="flex flex-col items-center p-4 space-y-4">

          <div className="w-full max-w-6xl relative flex justify-start items-center">
            {/* Botón Volver */}
            <div
              onClick={handleGoBack}
              className="cursor-pointer hover:underline z-10"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handleGoBack(); }}
            >
              ← Volver
            </div>

            {/* Timer centrado */}
            {timer !== 'noTimer' && expiryTimestamp && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Timer
                  expiryTimestamp={expiryTimestamp}
                  onExpire={handleTimeUp}
                  stopTimer={isGameOver}
                />
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">

            {/* Panel de nodos */}
            <div className="flex flex-col w-full md:w-[20%]">
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
                  <span className={gameStatus === "fail" ? "text-red-700" : "text-green-700"}>
                    {message}
                  </span>
                </div>
              )}
            </div>

            {/* Zona de hashing */}
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