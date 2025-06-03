import React from 'react';
import { useDrop } from 'react-dnd';
import { ArcherContainer, ArcherElement } from 'react-archer';

const HashingZone = ({ buckets, onDrop, splitBucket, extendBucket, globalDepth}) => {
  const indexLabels = Object.keys(buckets).sort();
  const BUCKET_SIZE = 3;

  return (
    <ArcherContainer strokeColor="black" strokeWidth={2}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row gap-4 items-center pt-10">
          {/* Columna de índices */}
          <div className="flex flex-col items-center pr-24">
            {indexLabels.map((idx, i) => (
              <ArcherElement
                key={`index-${idx}`}
                id={`index-${idx}`}
                relations={[{
                  targetId: `bucket-${idx}`,
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { stroke: 'black', endMarker: false },
                }]}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center bg-blue-200 text-xs font-bold ${
                    i !== 0 ? 'border-t border-blue-400' : ''
                  }`}
                >
                  {idx}
                </div>
              </ArcherElement>
            ))}
          </div>

          {/* Buckets */}
          <div className="flex flex-col items-center gap-4">
            {indexLabels.map((bucketId) => {
              const currentBucket = buckets[bucketId] || [];
              const safeFillCount = Math.max(0, BUCKET_SIZE - currentBucket.length);

              const filledBucket = [...currentBucket, ...Array(safeFillCount).fill(null)];
              const firstEmptyIndex = filledBucket.findIndex(val => val === null);
              const isFull = currentBucket.length === BUCKET_SIZE && !currentBucket.includes(null);

              return (
                <div className="flex flex-col" key={`bucket-row-${bucketId}`}>
                  <div className="text-xs text-gray-600 flex justify-end">
                    <div className="bg-blue-200 text-white px-2 py-0.5">
                      {bucketId.length}
                    </div>
                  </div>
                  <ArcherElement id={`bucket-${bucketId}`}>
                    <div className="flex flex-row items-center bg-gray-100 shadow p-2 relative">
                      <div className="flex flex-row gap-0.5">
                        {filledBucket.map((slotValue, index) => (
                          <Slot
                            key={index}
                            bucketId={bucketId}
                            slotIndex={index}
                            slotValue={slotValue}
                            handleDrop={onDrop}
                            isDropEnabled={index === firstEmptyIndex}
                          />
                        ))}
                      </div>
                      {isFull && globalDepth < BUCKET_SIZE && (
                          <button
                            onClick={() => extendBucket(bucketId)}
                            title="Extender Bucket"
                          >
                            →
                          </button>
                        )}
                    </div>
                  </ArcherElement>
                  <div
                    style={{ height: '20px' }}
                    className="flex justify-center items-center"
                  >
                    {isFull && (
                      <button
                        onClick={() => splitBucket(bucketId)}
                        className="w-full text-sm text-white bg-gray-400 hover:bg-gray-600 rounded px-2"
                        style={{ fontSize: '12px', height: '19px' }}
                        title="Dividir Bucket"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ArcherContainer>
  );
};

const Slot = ({ bucketId, slotIndex, slotValue, handleDrop, isDropEnabled }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'NODE',
    canDrop: () => slotValue === null && isDropEnabled,
    drop: (item) => handleDrop(bucketId, item.value, slotIndex),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-12 h-12 flex items-center justify-center transition-colors duration-200 ${
        isOver && canDrop ? 'bg-gray-300' : 'bg-gray-200'
      }`}
    >
      {slotValue !== null && (
        <div className="w-9 h-9 flex items-center justify-center text-xs font-medium">
          {slotValue}
        </div>
      )}
    </div>
  );
};

export default HashingZone;
