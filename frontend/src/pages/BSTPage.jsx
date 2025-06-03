import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import Timer from '../components/Timer';
import DraggableNode from '../components/DraggableNode';
import DropZone from '../components/DropZone';
import TreeNode from '../components/TreeNode';
import CustomDragLayer from '../components/CustomDragLayer';
import { generateRandomNumbers, isBST } from '../utils/Helpers';

function BSTGame() {
  const { state } = useLocation();
  const { mode = 'normal', timer } = state || {};

  const navigate = useNavigate(); 

  const [available, setAvailable] = useState([]);
  const [tree, setTree] = useState(null);
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null); 
  const [errorNode, setErrorNode] = useState(null);

  useEffect(() => {
    let count = 8;
    if (mode === 'easy') count = 5;
    else if (mode === 'hard') count = 10;

    const generated = generateRandomNumbers(count, 1, 99);
    setAvailable(generated);
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

  useEffect(() => {
    if (!isGameOver && tree && enabledIndex === available.length && available.length > 0) {
      handleVerify();
    }
  }, [enabledIndex, available.length, tree, isGameOver]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus("fail");
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
    const { isValid, errorNode } = isBST(tree);
    setIsGameOver(true);
    setGameStatus(isValid ? "success" : "fail");
    setMessage(isValid ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');

    if (!isValid && errorNode) {
      setErrorNode(errorNode);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const isVerifyDisabled = true;

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

          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
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

              {message && (
                <div className="mt-4 flex items-center justify-center">
                  <span className={`font-semibold ${gameStatus === "fail" ? "text-red-700" : "text-green-700"}`}>
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