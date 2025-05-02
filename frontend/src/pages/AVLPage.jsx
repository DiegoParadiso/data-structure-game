import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer } from 'react-archer';

import DraggableNode from '../components/DraggableNode';
import DropZone from '../components/DropZone';
import TreeNode from '../components/TreeNode';
import CustomDragLayer from '../components/CustomDragLayer';
import { generateRandomNumbers, isBST } from '../utils/bstHelpers';

function BSTGame() {
  const [available, setAvailable] = useState(() => generateRandomNumbers(7, 10, 100));
  const [tree, setTree] = useState(null);
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);

  useEffect(() => {
    const markers = document.querySelectorAll('.react-archer-container marker');
    markers.forEach((marker) => {
      marker.style.display = 'none';
    });
  }, []);

  const handleAddChild = (parentVal, side, childVal) => {
    const addNode = (current) => {
      if (!current) return null;
      if (current.value === parentVal) {
        if (side === 'left' && !current.left) current.left = { value: childVal, left: null, right: null };
        if (side === 'right' && !current.right) current.right = { value: childVal, left: null, right: null };
      } else {
        if (current.left) addNode(current.left);
        if (current.right) addNode(current.right);
      }
      return current;
    };
    setTree((prev) => addNode({ ...prev }));
    setEnabledIndex((prev) => prev + 1);
  };

  const handleAddRoot = (val) => {
    setTree({ value: val, left: null, right: null });
    setEnabledIndex((prev) => prev + 1);
  };

  const handleVerify = () => {
    const isCorrect = isBST(tree);
    setMessage(isCorrect ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="flex flex-col items-center p-4 space-y-4">
        <div className="w-full max-w-4xl flex space-x-4">
          <div className="w-full sm:w-1/3 md:w-1/4 p-2 border rounded bg-gray-50 h-[300px]">
            <h2 className="font-bold mb-2">Nodos:</h2>
            <div className="flex flex-wrap justify-center">
              {available.map((val, index) => (
                <DraggableNode key={val} value={val} isEnabled={index === enabledIndex} />
              ))}
            </div>
          </div>
          <div className="w-full sm:w-2/3 md:w-3/4 p-2 border rounded bg-gray-50">
            <h2 className="font-bold mb-2">Construcción de árbol:</h2>
            <div className="flex justify-center">
              <ArcherContainer strokeColor="gray" strokeWidth={2}>
                {tree ? (
                  <TreeNode node={tree} onAddChild={handleAddChild} />
                ) : (
                  <DropZone onDrop={handleAddRoot} isEnabled={enabledIndex < 1} />
                )}
              </ArcherContainer>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handleVerify}
            disabled={!tree || enabledIndex < 7}
            className={`px-6 py-2 rounded text-white ${
              !tree || enabledIndex < 7 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            Verificar
          </button>
        </div>
        {message && (
          <div className="mt-4 flex items-center justify-center">
            <span className={`font-semibold ${message.includes('correcto') ? 'text-green-700' : 'text-red-700'}`}>
              {message}
            </span>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default BSTGame;