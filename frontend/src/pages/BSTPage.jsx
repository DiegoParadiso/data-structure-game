import React, { useState, useEffect  } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArcherContainer, ArcherElement } from 'react-archer';

// Función para generar números aleatorios únicos
function generateRandomNumbers(size, min, max) {
  const numbers = new Set();
  while (numbers.size < size) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  return [...numbers];
}

// Nodo arrastrable
function DraggableNode({ value, isEnabled }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (

    <div
      ref={drag}
      className={`p-2 m-1 border rounded-full text-center cursor-move bg-white ${isDragging ? 'opacity-50' : ''} ${
        !isEnabled ? 'opacity-30 cursor-not-allowed' : ''
      }`}
      style={{
        width: '3rem',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: isDragging ? '#e0e0e0' : '#FFFFFF',
      }}
    >
      {value}
    </div>
  );
}

// Zona de drop
function DropZone({ onDrop, isEnabled }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'NODE',
    drop: (item) => onDrop(item.value),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const active = canDrop && isOver;

  return (
    
    <div
      ref={drop}
      className={`w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center ${
        active ? 'bg-gray-200' : 'bg-gray-100'
      } ${!isEnabled && 'cursor-not-allowed'}`}
    ></div>
  );
}

// Árbol usando ArcherElement para las conexiones sin flechas
function TreeNode({ node, onAddChild, depth = 0 }) {
  // Definimos las relaciones (conexiones) para cada hijo
  const relations = [];
  if (node.left) {
    relations.push({
      targetId: `node-${node.left.value}`,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }
  if (node.right) {
    relations.push({
      targetId: `node-${node.right.value}`,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }

  return (
    <div className="relative flex flex-col items-center">
      <ArcherElement id={`node-${node.value}`} relations={relations}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            border: '2px solid #ccc',
            borderRadius: '50%',
            background: 'white',
            textAlign: 'center',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            marginBottom: '16px',
          }}
        >
          {node.value}
        </div>
      </ArcherElement>
      <div className="flex justify-between w-full" style={{ minWidth: '80px', marginTop: '8px' }}>
        <div className="flex flex-col items-center">
          {node.left ? (
            <TreeNode node={node.left} onAddChild={onAddChild} depth={depth + 1} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'left', val)} isEnabled={depth < 3} />
          )}
        </div>
        <div className="flex flex-col items-center">
          {node.right ? (
            <TreeNode node={node.right} onAddChild={onAddChild} depth={depth + 1} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'right', val)} isEnabled={depth < 3} />
          )}
        </div>
      </div>
    </div>
  );
}

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

  // Agrega un hijo en la dirección indicada (izquierda o derecha)
  const handleAddChild = (parentVal, side, childVal) => {
    const addNode = (current) => {
      if (!current) return null;
      if (current.value === parentVal) {
        if (side === 'left' && !current.left) {
          current.left = { value: childVal, left: null, right: null };
        }
        if (side === 'right' && !current.right) {
          current.right = { value: childVal, left: null, right: null };
        }
      } else {
        if (current.left) addNode(current.left);
        if (current.right) addNode(current.right);
      }
      return current;
    };
    setTree((prev) => addNode({ ...prev }));
    setEnabledIndex((prev) => prev + 1);
  };

  // Agrega la raíz del árbol
  const handleAddRoot = (val) => {
    setTree({ value: val, left: null, right: null });
    setEnabledIndex((prev) => prev + 1);
  };

  // Función para verificar si el árbol es un BST válido mediante recorrido in-order
  const isBST = (node, prev = { value: -Infinity }) => {
    if (!node) return true;
    if (!isBST(node.left, prev)) return false;
    if (node.value <= prev.value) return false;
    prev.value = node.value;
    return isBST(node.right, prev);
  };

  const handleVerify = () => {
    const isCorrect = isBST(tree);
    setMessage(isCorrect ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center p-4 space-y-4">
        <div className="w-full max-w-4xl flex space-x-4">
          {/* Sección de Nodos */}
          <div className="w-full sm:w-1/3 md:w-1/4 p-2 border rounded bg-gray-50 h-[300px]">
            <h2 className="font-bold mb-2">Nodos:</h2>
            <div className="flex flex-wrap justify-center">
              {available.map((val, index) => (
                <DraggableNode key={val} value={val} isEnabled={index === enabledIndex} />
              ))}
            </div>
          </div>

          {/* Árbol en construcción */}
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

        {/* Botón de verificación */}
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

        {/* Mensaje de resultado */}
        {message && (
          <div className="mt-4 flex items-center justify-center">
            <span className={`font-semibold ${
              message.includes('correcto') ? 'text-green-700' : 'text-red-700'
            }`}>
              {message}
            </span>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default BSTGame;
