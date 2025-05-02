import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

function DraggableNode({ value, isEnabled }) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'NODE',
    item: { value },
    canDrag: isEnabled, // Solo permitir arrastrar si el nodo está habilitado
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      className={`p-2 m-1 border rounded-full text-center cursor-move bg-white ${isDragging ? 'opacity-100' : ''} ${!isEnabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      style={{
        width: '3rem',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        backgroundColor: isDragging ? '#e0e0e0' : '#FFFFFF',
      }}
    >
      {value}
    </div>
  );
}

export default DraggableNode;