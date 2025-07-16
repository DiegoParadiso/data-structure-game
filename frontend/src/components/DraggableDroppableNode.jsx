import { useDrag, useDrop } from 'react-dnd';
import React, { useRef, useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

function DraggableDroppableNode({ id, value, onSwapValues, isGameOver }) {
  const dragRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'NODE',
    item: { id, value },
    canDrag: !isGameOver,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, value, isGameOver]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'NODE',
    drop: (item) => {
      if (!isGameOver && item.id !== id) {
        onSwapValues(item.id, id);
      }
    },
    canDrop: (item) => !isGameOver && item.id !== id,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [id, isGameOver]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver && canDrop ? '#def' : '#fff';

  return (
    <div ref={preview} className="cursor-pointer">
      <div
        ref={(node) => drag(drop(node))}
        style={{ opacity, backgroundColor }}
        className="rounded-full border border-gray-400 w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-base md:text-lg font-semibold shadow"
      >
        {value}
      </div>
    </div>
  );
}

export default DraggableDroppableNode;
