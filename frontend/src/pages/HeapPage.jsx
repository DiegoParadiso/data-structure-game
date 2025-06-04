import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import Timer from '../components/Timer';
import TreeNodeHeap from '../components/TreeNodeHeap'; // Nuevo componente para heap
import CustomDragLayer from '../components/CustomDragLayer';
import { generateRandomNumbers, isHeap } from '../utils/Helpers'; // Función isHeap que validamos abajo

function HeapGame() {
  const { state } = useLocation();
  const { timer, heapType = 'min' } = state || {}; // min o max heap

  const navigate = useNavigate();

  // Generamos nodos fijos para heap (7 nodos, 3 niveles)
  const [tree, setTree] = useState(null);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState(null);

let idCounter = 0;
const createNode = (value) => ({
  id: `node-${idCounter++}`,
  value,
  left: null,
  right: null,
});

useEffect(() => {
  const nodes = generateRandomNumbers(7, 1, 99);
  const shuffled = [...nodes].sort(() => Math.random() - 0.5);

  // Creamos nodos con id único
  const heapTree = createNode(shuffled[0]);
  heapTree.left = createNode(shuffled[1]);
  heapTree.right = createNode(shuffled[2]);
  heapTree.left.left = createNode(shuffled[3]);
  heapTree.left.right = createNode(shuffled[4]);
  heapTree.right.left = createNode(shuffled[5]);
  heapTree.right.right = createNode(shuffled[6]);

  setTree(heapTree);
}, []);

  useEffect(() => {
    if (!timer) return;
    const secondsToAdd = parseInt(timer, 10);
    if (secondsToAdd > 0) {
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + secondsToAdd);
      setExpiryTimestamp(expiry);
    }
  }, [timer]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus("fail");
    setMessage('¡El tiempo se acabó!');
  };
const handleSwapValues = (sourceId, targetId) => {
  if (isGameOver) return;

  const swapInTree = (node) => {
    if (!node) return;

    if (node.id === sourceId) node._swapMarker = 'source';
    else if (node.id === targetId) node._swapMarker = 'target';

    swapInTree(node.left);
    swapInTree(node.right);
  };

  setTree(prev => {
    const newTree = JSON.parse(JSON.stringify(prev));
    swapInTree(newTree);

    // Encuentra los nodos marcados
    const findAndSwap = (node) => {
      if (!node) return [null, null];

      let source = null, target = null;
      if (node._swapMarker === 'source') source = node;
      if (node._swapMarker === 'target') target = node;

      const [leftS, leftT] = findAndSwap(node.left);
      const [rightS, rightT] = findAndSwap(node.right);

      source = source || leftS || rightS;
      target = target || leftT || rightT;

      return [source, target];
    };

    const [sourceNode, targetNode] = findAndSwap(newTree);
    if (sourceNode && targetNode) {
      [sourceNode.value, targetNode.value] = [targetNode.value, sourceNode.value];
    }

    // Limpia marcas
    const cleanMarkers = (node) => {
      if (!node) return;
      delete node._swapMarker;
      cleanMarkers(node.left);
      cleanMarkers(node.right);
    };
    cleanMarkers(newTree);

    return newTree;
  });
};

  const handleVerify = () => {
    const valid = isHeap(tree, heapType);
    setIsGameOver(true);
    setGameStatus(valid ? "success" : "fail");
    setMessage(valid ? '¡El árbol cumple la propiedad heap!' : 'El árbol NO cumple la propiedad heap.');
  };

  const handleGoBack = () => navigate('/');

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className={`transition-colors duration-700 min-h-screen ${
        gameStatus === "success" ? "bg-flash-green" : gameStatus === "fail" ? "bg-flash-red" : "bg-white"
      }`}>
        <div className="flex flex-col items-center p-4 space-y-4">
          <div className="w-full max-w-6xl relative flex justify-start items-center">
            <div
              onClick={handleGoBack}
              className="cursor-pointer hover:underline z-10"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handleGoBack(); }}
            >
              ← Volver
            </div>
            {timer && expiryTimestamp && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Timer expiryTimestamp={expiryTimestamp} onExpire={handleTimeUp} stopTimer={isGameOver} />
              </div>
            )}
          </div>

          <div className="w-full max-w-6xl p-2 border rounded bg-gray-50 min-h-[500px]">
            <h2 className="font-bold mb-2">Heap ({heapType}-heap) — Reordena los nodos para cumplir la propiedad</h2>
            <ArcherContainer strokeColor="gray" strokeWidth={2}>
              {tree && (
                <TreeNodeHeap node={tree} onSwapValues={handleSwapValues} isGameOver={isGameOver} />
              )}
            </ArcherContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {!isGameOver && (
                <button
                  onClick={handleVerify}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Verificar
                </button>
              )}
              {message && (
                <span className={`font-semibold ${gameStatus === "fail" ? "text-red-700" : "text-green-700"}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default HeapGame;