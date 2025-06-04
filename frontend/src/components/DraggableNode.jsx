import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

function DraggableNode({ value, isEnabled }) {
  const dragRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'NODE',
      item: { value },
      canDrag: isEnabled,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [isEnabled, value]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Solo conecta el drag ref si está habilitado
  useEffect(() => {
    if (isEnabled) {
      drag(dragRef);
    }
  }, [isEnabled, drag]);

  return (
    <div
      ref={dragRef}
      className={`p-2 m-1 border rounded-full text-center ${
        isEnabled ? 'cursor-move' : 'cursor-not-allowed'
      } ${isDragging ? 'opacity-100' : ''} ${!isEnabled ? 'opacity-30' : ''}`}
      style={{
        width: '3rem',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        backgroundColor: isDragging ? '#e0e0e0' : '#FFFFFF',
        pointerEvents: isEnabled ? 'auto' : 'none',
      }}
    >
      {value}
    </div>
  );
}

export default DraggableNode;