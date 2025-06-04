import React from 'react';
import DraggableDroppableNode from './DraggableDroppableNode';
import { ArcherElement } from 'react-archer';
import { useDrop } from 'react-dnd';

function TreeNodeHeap({ node, onSwapValues, isGameOver }) {
  // Llamamos useDrop siempre, evitando errores cuando node sea null:
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

  if (!node) return null;  // ahora después de llamar al hook

  const relations = [];
  if (node.left) {
    relations.push({
      targetId: node.left.id,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }
  if (node.right) {
    relations.push({
      targetId: node.right.id,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }
  
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
          <DraggableDroppableNode id={node.id} value={node.value} onSwapValues={onSwapValues} isGameOver={isGameOver} />
        </div>
      </ArcherElement>
      <div className="flex gap-8">
        <TreeNodeHeap node={node.left} onSwapValues={onSwapValues} isGameOver={isGameOver} />
        <TreeNodeHeap node={node.right} onSwapValues={onSwapValues} isGameOver={isGameOver} />
      </div>
    </div>
  );
}
export default TreeNodeHeap;
