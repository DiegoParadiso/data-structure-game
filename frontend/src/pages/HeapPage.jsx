import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import Timer from '../components/Timer';
import TreeNodeHeap from '../components/TreeNodeHeap';
import CustomDragLayer from '../components/CustomDragLayer';
import { generateRandomNumbers, isHeap } from '../utils/Helpers';

function HeapGame() {
  const { state } = useLocation();
  const { timer, heapType = 'min' } = state || {};
  const navigate = useNavigate();

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
  const nNodes = 15; // Cambiar aquí cuantos nodos querés

  const nodes = generateRandomNumbers(nNodes, 1, 99);
  const shuffled = [...nodes].sort(() => Math.random() - 0.5);

  // Crear árbol binario completo con nNodes nodos
  let idCounterLocal = 0;
  const createNodeWithIndex = (index) => {
    if (index >= shuffled.length) return null;
    return {
      id: `node-${index}`,
      value: shuffled[index],
      left: createNodeWithIndex(2 * index + 1),
      right: createNodeWithIndex(2 * index + 2),
    };
  };
  const heapTree = createNodeWithIndex(0);
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

  const areParentAndChild = (node, sourceId, targetId) => {
    if (!node) return false;
    const leftMatch = node.left && (
      (node.id === sourceId && node.left.id === targetId) ||
      (node.id === targetId && node.left.id === sourceId)
    );
    const rightMatch = node.right && (
      (node.id === sourceId && node.right.id === targetId) ||
      (node.id === targetId && node.right.id === sourceId)
    );
    return leftMatch || rightMatch ||
      areParentAndChild(node.left, sourceId, targetId) ||
      areParentAndChild(node.right, sourceId, targetId);
  };

  const handleSwapValues = (sourceId, targetId) => {
    if (!areParentAndChild(tree, sourceId, targetId)) return;
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

  const treeToArray = (root) => {
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current) {
        result.push({ id: current.id, value: current.value });
        queue.push(current.left);
        queue.push(current.right);
      } else {
        result.push(null);
      }
    }
    return result;
  };

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

<div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start md:space-y-0 md:space-x-4">
  
  {/* Contenedor izquierdo: nodos disponibles */}
  <div className="flex flex-col w-full md:w-[25%]">
    <div className="p-2 border rounded bg-gray-50 h-[300px] overflow-x-auto">
      <h2 className="font-bold mb-2 pt-1 pb-2">Heap:</h2>
      <div className="max-w-full overflow-x-auto">
        <table className="table-auto border-gray-400 text-[11px] whitespace-nowrap mx-auto">
          <tbody>
  {(() => {
    const nodesArray = treeToArray(tree).filter((n) => n); // Filtrar nodos nulos
    const chunkSize = 6;
    const rows = [];

    for (let i = 0; i < nodesArray.length; i += chunkSize) {
      const chunk = nodesArray.slice(i, i + chunkSize);

      // Fila de índices
      rows.push(
        <tr key={`index-row-${i}`}>
          {chunk.map((_, j) => (
            <td key={`index-${i + j}`} className="border px-2 py-1 text-center text-gray-400">
              {i + j}
            </td>
          ))}
        </tr>
      );

      // Fila de valores
      rows.push(
        <tr key={`value-row-${i}`}>
          {chunk.map((node, j) => (
            <td key={`value-${i + j}`} className="border px-2 py-1 text-center">
              {node.value}
            </td>
          ))}
        </tr>
      );
    }

    return rows;
  })()}
</tbody>
        </table>
      </div>
    </div>

    {/* Mensaje debajo de la tabla */}
    {message && (
      <div className="mt-4 flex items-center justify-center">
        <span className={`font-semibold ${gameStatus === "fail" ? "text-red-700" : "text-green-700"}`}>
          {message}
        </span>
      </div>
    )}

    {/* Botón verificar debajo del contenedor izquierdo */}
    {!isGameOver && (
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleVerify}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Verificar
        </button>
      </div>
    )}
  </div>

  {/* Contenedor derecho: heap (árbol) centrado */}
  <div className="w-full md:w-[75%] p-2 border rounded bg-gray-50 min-h-[500px] flex justify-center items-start">
    <div>
      <h2 className="font-bold mb-2 pt-1 pb-20 text-center">Heap ({heapType}-heap) — Reordena los nodos para cumplir la propiedad</h2>
      <ArcherContainer strokeColor="gray" strokeWidth={2}>
        {tree && (
          <TreeNodeHeap node={tree} onSwapValues={handleSwapValues} isGameOver={isGameOver} />
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

export default HeapGame;
