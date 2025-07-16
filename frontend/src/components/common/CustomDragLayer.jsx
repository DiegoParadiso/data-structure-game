import React, { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function CustomDragLayer() {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (currentOffset) {
      x.set(currentOffset.x);
      y.set(currentOffset.y);
    }
  }, [currentOffset]);

  if (!isDragging || !currentOffset) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        x: springX,
        y: springY,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div className="w-12 h-12 bg-white border rounded-full shadow flex items-center justify-center">
        {item?.value}
      </div>
    </motion.div>
  );
}

export default CustomDragLayer;
