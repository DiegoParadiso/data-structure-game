import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
function DraggableNode({ value, isEnabled, onDragStart, onDragEnd }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: onDragEnd,  // Al terminar el drag, ejecutar la función onDragEnd
  });

  return (
    <div
      ref={drag}
      className={`p-2 m-1 border rounded-full text-center cursor-move bg-white ${isDragging ? 'opacity-50' : ''} ${!isEnabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      style={{
        width: '3rem', // Asegurando que el ancho y el alto sean iguales
        height: '3rem', // Asegurando que el nodo sea perfectamente redondo
        display: 'flex', // Usar flexbox para centrar el contenido
        justifyContent: 'center', // Centrar el contenido horizontalmente
        alignItems: 'center', // Centrar el contenido verticalmente
        fontSize: '1rem', // Ajusta el tamaño de la fuente
        cursor: isDragging ? 'grabbing' : 'grab', // Cambiar el cursor mientras se arrastra
        backgroundColor: isDragging ? '#e0e0e0' : '#FFFFFF',
      }}
    >
      {value}
    </div>
  );
}

// Zona de drop
function DropZone({ onDrop, isEnabled, onHover }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'NODE',
    drop: (item) => onDrop(item.value),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    hover: onHover,
  });

  const active = canDrop && isOver;

  return (
    <div ref={drop} className={`w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center ${active ? 'bg-gray-200' : 'bg-gray-100'} ${!isEnabled && 'cursor-not-allowed'}`} />
  );
}

// Árbol
function TreeNode({ node, onAddChild, depth = 0, onNodeDragEnd, onNodeDragStart }) {
  const nodeSize = 48;
  const connectorLength = 30;
  const diagonalOffset = Math.sqrt(2 * (connectorLength ** 2));

  const hasChildren = node.left || node.right;

  return (
    <div className="relative flex flex-col items-center">
      {/* Nodo */}
      <div
        className="flex items-center justify-center"
        style={{
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          border: '2px solid #ccc',
          borderRadius: '50%',
          background: 'white',
          textAlign: 'center',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {node.value}
      </div>

      {/* Conectores */}
      {hasChildren && (
        <div
          className="relative"
          style={{
            width: `${diagonalOffset}px`,
            height: `${diagonalOffset / 2}px`,
            marginTop: `-4px`,
          }}
        >
          {node.left && (
            <div
              className="absolute bg-gray-400"
              style={{
                width: '2px',
                height: `${connectorLength}px`,
                top: 0,
                left: '25%',
                transform: 'rotate(45deg)',
                transformOrigin: 'top center',
              }}
            />
          )}
          {node.right && (
            <div
              className="absolute bg-gray-400"
              style={{
                width: '2px',
                height: `${connectorLength}px`,
                top: 0,
                right: '25%',
                transform: 'rotate(-45deg)',
                transformOrigin: 'top center',
              }}
            />
          )}
        </div>
      )}

      {/* Hijos */}
      <div className="flex justify-between w-full" style={{ minWidth: `${connectorLength * 2}px`, marginTop: hasChildren ? '-4px' : '8px' }}>
        <div className="flex flex-col items-center">
          {node.left ? (
            <TreeNode node={node.left} onAddChild={onAddChild} depth={depth + 1} onNodeDragEnd={onNodeDragEnd} onNodeDragStart={onNodeDragStart} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'left', val)} isEnabled={depth < 3} onHover={() => onNodeDragStart('left', node.value)} />
          )}
        </div>

        <div className="flex flex-col items-center">
          {node.right ? (
            <TreeNode node={node.right} onAddChild={onAddChild} depth={depth + 1} onNodeDragEnd={onNodeDragEnd} onNodeDragStart={onNodeDragStart} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'right', val)} isEnabled={depth < 3} onHover={() => onNodeDragStart('right', node.value)} />
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

  // Función para verificar si el árbol es un árbol de búsqueda binaria (BST)
  const isBST = (node, min = null, max = null) => {
    if (!node) return true;

    // Verificar que el valor del nodo esté dentro del rango permitido
    if ((min !== null && node.value <= min) || (max !== null && node.value >= max)) {
      return false;
    }

    // Verificar recursivamente en el subárbol izquierdo y derecho
    return (
      isBST(node.left, min, node.value) &&  // Los valores del subárbol izquierdo deben ser menores que el valor del nodo
      isBST(node.right, node.value, max)    // Los valores del subárbol derecho deben ser mayores que el valor del nodo
    );
  };

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

  const handleAddRoot = (val) => {
    setTree({ value: val, left: null, right: null });
    setEnabledIndex((prev) => prev + 1);
  };

  const handleNodeDragStart = (side, parentVal) => {
    console.log(`Arrastrando nodo hacia ${side} con valor ${parentVal}`);
  };

  const handleNodeDragEnd = (side, parentVal, value) => {
    console.log(`Nodo arrastrado hacia ${side} con valor ${parentVal}`);
    // Implementar lógica para intercambiar o actualizar el árbol
  };

  const handleVerify = () => {
    const sorted = [...available].sort((a, b) => a - b);
    const correctTree = buildBalancedBST(sorted);
    const isCorrect = isBST(tree);
    setMessage(isCorrect ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');
  };

  const buildBalancedBST = (arr) => {
    if (!arr.length) return null;
    const mid = Math.floor(arr.length / 2);
    return {
      value: arr[mid],
      left: buildBalancedBST(arr.slice(0, mid)),
      right: buildBalancedBST(arr.slice(mid + 1)),
    };
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center p-4 space-y-4">
        <div className="w-full max-w-4xl flex space-x-4">
          {/* Sección de nodos */}
          <div className="w-full sm:w-1/3 md:w-1/4 p-2 border rounded bg-gray-50 h-[300px]">
            <h2 className="font-bold mb-2">Nodos:</h2>
            <div className="flex flex-wrap justify-center">
              {available.map((val, index) => (
                <DraggableNode
                  key={val}
                  value={val}
                  isEnabled={index === enabledIndex}  // Habilitar solo el nodo correspondiente
                  onDragEnd={() => setEnabledIndex((prev) => prev + 1)}  // Actualizar índice al arrastrar
                />
              ))}
            </div>
          </div>

          {/* Sección de árbol */}
          <div className="w-full sm:w-2/3 md:w-3/4 p-2 border rounded bg-gray-50 h-[300px]">
            <h2 className="font-bold mb-2">Árbol Binario:</h2>
            {tree ? (
              <TreeNode
                node={tree}
                onAddChild={handleAddChild}
                onNodeDragEnd={handleNodeDragEnd}
                onNodeDragStart={handleNodeDragStart}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <DropZone onDrop={handleAddRoot} isEnabled={enabledIndex === 0} />
              </div>
            )}
          </div>
        </div>

        {/* Verificación del árbol */}
        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Verificar árbol
        </button>
        {message && (
          <div className="mt-4">
            <p className="text-xl font-semibold">{message}</p>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default BSTGame;