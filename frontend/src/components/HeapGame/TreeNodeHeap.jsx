import React from 'react';
import DraggableDroppableNode from '../DraggableDroppableNode';
import { ArcherElement } from 'react-archer';
import { useDrop } from 'react-dnd';

function TreeNodeHeap({ node, onSwapValues, isGameOver, hiddenNodeIds = new Set(), mode = 'easy' }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'NODE',
    drop: (item) => {
      if (!isGameOver && node && item.id !== node.id) {
        onSwapValues(item.id, node.id);
      }
    },
    canDrop: (item) => !isGameOver && node && item.id !== node.id,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  if (!node) return null;

  // Filtramos solo hijos válidos
  const validLeft = node.left && node.left.id ? node.left : null;
  const validRight = node.right && node.right.id ? node.right : null;

  // Construimos las relaciones solo para hijos visibles
  const relations = [];
  if (validLeft) {
    relations.push({
      targetId: validLeft.id,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }
  if (validRight) {
    relations.push({
      targetId: validRight.id,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }

  // Si modo 'hard' y el nodo está oculto, mostramos '?'
  const displayValue = mode === 'hard' && hiddenNodeIds.has(node.id) ? '?' : node.value;

  return (
    <div className="relative flex flex-col items-center">
      <ArcherElement id={node.id} relations={relations}>
        <div
          ref={drop}
          className="flex items-center justify-center border-2 rounded-full cursor-pointer select-none"
          style={{
            width: '48px',
            height: '48px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <DraggableDroppableNode
            id={node.id}
            value={displayValue}
            onSwapValues={onSwapValues}
            isGameOver={isGameOver}
          />
        </div>
      </ArcherElement>
      <div className="flex gap-8">
        {validLeft && (
          <TreeNodeHeap
            node={validLeft}
            onSwapValues={onSwapValues}
            isGameOver={isGameOver}
            hiddenNodeIds={hiddenNodeIds}
            mode={mode}
          />
        )}
        {validRight && (
          <TreeNodeHeap
            node={validRight}
            onSwapValues={onSwapValues}
            isGameOver={isGameOver}
            hiddenNodeIds={hiddenNodeIds}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}

export default TreeNodeHeap;
