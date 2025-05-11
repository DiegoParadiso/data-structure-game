import React from 'react';
import { useDrop } from 'react-dnd';
import { ArcherContainer, ArcherElement } from 'react-archer';

const HashingZone = ({ buckets, handleDrop, splitBucket, extendBucket }) => {
  const indexLabels = Object.keys(buckets).sort();

  return (
    <ArcherContainer strokeColor="black" strokeWidth={2}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row gap-4 items-center pt-10">
          {/* Columna de índices */}
          <div className="flex flex-col items-center pr-20">
            {indexLabels.map((idx, i) => (
              <ArcherElement
                key={`index-${idx}`}
                id={`index-${idx}`}
                relations={[
                  {
                    targetId: `bucket-${idx}`,
                    targetAnchor: 'left',
                    sourceAnchor: 'right',
                    style: { stroke: 'black', endMarker: false },
                  },
                ]}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center bg-blue-200 text-xs font-bold ${i !== 0 ? 'border-t border-blue-400' : ''}`}
                >
                  {idx}
                </div>
              </ArcherElement>
            ))}
          </div>

          {/* Buckets */}
          <div className="flex flex-col items-center gap-4">
            {indexLabels.map((bucketId) => (
              <div className="flex flex-col" key={`bucket-row-${bucketId}`}>

                {/* Solapa con la profundidad, ubicada a la derecha del contenedor del bucket */}
                <div className="text-xs text-gray-600 flex justify-end">
                  <div className="bg-blue-200 text-white px-2 py-0.5">
                    {bucketId.length}
                  </div>
                </div>

                {/* Contenedor completo del bucket */}
                <div className="flex flex-col w-fit space-y-1">
                  {/* Bucket + botón de extensión */}
                  <ArcherElement id={`bucket-${bucketId}`}>
                    <div className="flex flex-row items-center bg-gray-100 shadow p-2 relative">
                      {/* Slots */}
                      <div className="flex flex-row gap-0.5">
                        {[...buckets[bucketId], ...Array(4 - buckets[bucketId].length).fill(null)].map((slotValue, index) => (
                          <Slot
                            key={index}
                            bucketId={bucketId}
                            slotIndex={index}
                            slotValue={slotValue}
                            handleDrop={handleDrop}
                          />
                        ))}
                      </div>

                      {/* Botón Extender */}
                      {buckets[bucketId].length === 4 && !buckets[bucketId].includes(null) && (
                        <button
                          onClick={() => extendBucket(bucketId)}
                          className="ml-2 px-2 h-8 text-sm text-white bg-gray-400 hover:bg-gray-600 rounded"
                          title="Extender Bucket"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </ArcherElement>

                  {/* Espacio reservado para botón dividir */}
                  <div style={{ height: '20px' }} className="flex justify-center items-center">
                    {buckets[bucketId].length === 4 && (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </ArcherContainer>
  );
};

const Slot = ({ bucketId, slotIndex, slotValue, handleDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'NODE',
    canDrop: () => slotValue === null,
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
        <div className="w-9 h-9 flex items-center justify-center text-xs font-medium bg-white shadow-inner">
          {slotValue}
        </div>
      )}
    </div>
  );
};

export default HashingZone;