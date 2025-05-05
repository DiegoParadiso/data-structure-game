import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import Timer from '../components/Timer';
import DraggableNode from '../components/DraggableNode';
import DropZone from '../components/DropZone';
import TreeNode from '../components/TreeNode';
import CustomDragLayer from '../components/CustomDragLayer';
import { generateRandomNumbers, isBST } from '../utils/bstHelpers';

function BSTGame() {
  const { state } = useLocation();
  const { mode = 'normal', timer } = state || {};

  const [available, setAvailable] = useState([]);
  const [tree, setTree] = useState(null);
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null); 
  const [errorNode, setErrorNode] = useState(null);

  // Configurar nodos iniciales en base al modo
  useEffect(() => {
    let count = 8;

    if (mode === 'easy') count = 5;
    else if (mode === 'hard') count = 10;

    const generated = generateRandomNumbers(count, 1, 99);
    setAvailable(generated);
  }, [mode]);

  // Configura el temporizador si se selecciona uno
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
    setGameStatus("fail"); // Marca como "fail" si se acaba el tiempo
    setMessage('¡El tiempo se acabó!');
  };

  const handleAddChild = (parentVal, side, childVal) => {
    if (isGameOver) return;

    const addNode = (node) => {
      if (!node) return null;

      if (node.value === parentVal) {
        if (side === 'left' && !node.left) node.left = { value: childVal, left: null, right: null };
        if (side === 'right' && !node.right) node.right = { value: childVal, left: null, right: null };
      } else {
        node.left && addNode(node.left);
        node.right && addNode(node.right);
      }
      return node;
    };

    setTree((prev) => addNode({ ...prev }));
    setEnabledIndex((prev) => prev + 1);
  };

  const handleAddRoot = (val) => {
    if (isGameOver) return;
    setTree({ value: val, left: null, right: null });
    setEnabledIndex(1);
  };

const handleVerify = () => {
    const { isValid, errorNode } = isBST(tree); // Usamos la versión modificada de isBST
    
    setIsGameOver(true);
    setGameStatus(isValid ? "success" : "fail");
    setMessage(isValid ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');

    if (!isValid && errorNode) {
      setErrorNode(errorNode); // Guardamos el nodo incorrecto
    }
  };

  const isVerifyDisabled = !tree || enabledIndex < available.length || isGameOver;

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className={`transition-colors duration-700 min-h-screen ${
        gameStatus === "success" ? "bg-flash-green" : gameStatus === "fail" ? "bg-flash-red" : "bg-white"
      }`}>
        <div className="flex flex-col items-center p-4 space-y-4">
          {timer !== 'noTimer' && expiryTimestamp && (
            <Timer
              expiryTimestamp={expiryTimestamp}
              onExpire={handleTimeUp}
              stopTimer={isGameOver}
            />
          )}

          {/* Contenedor principal */}
          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            
            {/* Panel lateral: nodos + botón */}
            <div className="flex flex-col w-full md:w-[20%]">
              <div className="p-2 border rounded bg-gray-50 h-[300px]">
                <h2 className="font-bold mb-2">Nodos:</h2>
                <div className="flex flex-wrap justify-center">
                  {available.map((val, index) => (
                    <DraggableNode
                      key={val}
                      value={val}
                      isEnabled={index === enabledIndex && !isGameOver}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={handleVerify}
                  disabled={isVerifyDisabled}
                  className={`w-full px-4 py-2 rounded text-white ${
                    isVerifyDisabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Verificar
                </button>
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

            {/* Árbol */}
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
