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
  if (max == null) {
    console.error("getTotalBits: max es undefined");
    return 0;
  }
  return Math.ceil(Math.log2(max + 1));
};

const validateBuckets = (buckets) => {
  // Verificamos que maxNumber esté definido
  if (maxNumber == null) {
    console.error("validateBuckets: maxNumber no está definido");
    return false;
  }

  for (const bucketId in buckets) {
    const bucket = buckets[bucketId];
    if (!bucket) continue;

    // Ignoramos buckets que estén completamente vacíos
    if (bucket.every(node => node == null)) continue;

    const bucketLength = bucketId.length;

    for (const node of bucket) {
      // Si el slot está vacío, lo saltamos
      if (node == null) continue;

      let number;
      if (typeof node === 'number') {
        number = node;
      } else if (typeof node === 'object' && node.decimal != null) {
        number = node.decimal;
      } else {
        console.log("validateBuckets: Nodo inválido en bucket", bucketId, node);
        return false;
      }

      const totalBits = getTotalBits(maxNumber);
      if (totalBits === 0) {
        console.error("validateBuckets: totalBits es 0");
        return false;
      }

      let binaryValue;
      try {
        binaryValue = number.toString(2).padStart(totalBits, '0');
      } catch (e) {
        console.log("Error al convertir el número a binario:", number, e);
        return false;
      }
      const nodeBitsRelevant = binaryValue.slice(-bucketLength);
      if (nodeBitsRelevant !== bucketId) {
        console.log(
          `Error: Nodo ${number} con binario ${binaryValue} no coincide con bucket ${bucketId} (relevantes: ${nodeBitsRelevant})`
        );
        return false;
      }
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
      count = 16;
      maxNum = 20;
    }
    setMaxNumber(maxNum);

    const generated = generateRandomNumbers(count, 0, maxNum).map(num => ({ decimal: num }));
    setAvailable(generated);

    const initialBuckets = {
      '0': Array(3).fill(null),
      '1': Array(3).fill(null),
    };
    setBuckets(initialBuckets);

    setMessage('');
    setEnabledIndex(0);
    setIsGameOver(false);
    setGameStatus(null);
  }, [mode]);

  useEffect(() => {
    const timeMapping = { '90s': 90, '60s': 60, '35s': 35 };
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

  setBuckets(prev => {
    const updatedBucket = [...(prev[bucketId] || [])];
    updatedBucket[slotIndex] = value;
    const newBuckets = { ...prev, [bucketId]: updatedBucket };

    // Validación en cada inserción
    const allCorrect = validateBuckets(newBuckets);
    if (!allCorrect) {
      setIsGameOver(true);
      setGameStatus("fail");
      setMessage(`Nodo ${value.decimal || value} mal ubicado en bucket ${bucketId}`);
      return prev;
    }

    // Validación final si se completaron todos los nodos
    const totalPlaced = Object.values(newBuckets).flat().filter(Boolean).length;
    if (totalPlaced === available.length) {
      const allCorrectFinal = validateBuckets(newBuckets);
      if (allCorrectFinal) {
        setGameStatus("success");
        setMessage('¡Has colocado todos los nodos correctamente!');
      } else {
        setIsGameOver(true);
        setGameStatus("fail");
        setMessage('Hay al menos un nodo mal colocado');
      }
    }

    return newBuckets;
  });

  setEnabledIndex(prev => prev + 1);
};

const splitBucket = (bucketId) => {
  // Limitar la profundidad global a 3 bits
  const newDepth = bucketId.length + 1;
if (newDepth > 3) {
  extendBucket(bucketId);
  return;
}

  setBuckets(prev => {
    const items = prev[bucketId] || [];
    const totalBits = getTotalBits(maxNumber);

    const bucket0Items = [];
    const bucket1Items = [];

    for (const val of items) {
      if (val === null || val === undefined) continue;

      let decimalValue;
      if (typeof val === 'number') {
        decimalValue = val;
      } else if (typeof val === 'object' && typeof val.decimal === 'number') {
        decimalValue = val.decimal;
      } else {
        console.warn("splitBucket: Valor inválido encontrado", val);
        continue;
      }

      const binary = decimalValue.toString(2).padStart(totalBits, '0');
      const nextBitIndex = totalBits - newDepth;
      const nextBit = binary[nextBitIndex] || '0';

      if (nextBit === '0') {
        bucket0Items.push(val);
      } else {
        bucket1Items.push(val);
      }
    }

    const curr = parseInt(bucketId, 2);
    const newKey0 = curr.toString(2).padStart(newDepth, '0');
    const newKey1 = (curr + (1 << (newDepth - 1))).toString(2).padStart(newDepth, '0');

const fillToSize = (arr, size = 3) => {
      const filled = [...arr];
      while (filled.length < size) filled.push(null);
      return filled.slice(0, size);
    };

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
useEffect(() => {
  if (isGameOver || available.length === 0) return;

  const totalPlaced = Object.values(buckets).flat().filter(Boolean).length;

  if (totalPlaced === available.length) {
    const allCorrect = validateBuckets(buckets);
    if (allCorrect) {
      setGameStatus("success");
      setMessage("¡Has colocado todos los nodos correctamente!");
    } else {
      setGameStatus("fail");
      setIsGameOver(true);
      setMessage("Hay al menos un nodo mal colocado");
    }
  }
}, [buckets, available.length, isGameOver]);

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