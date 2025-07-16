import React from 'react';
import { useDrop } from 'react-dnd';

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
      className={`w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center ${active ? 'bg-gray-200' : 'bg-gray-100'} ${!isEnabled && 'cursor-not-allowed'}`}
    ></div>
  );
}

export default DropZone;