import React from 'react';
import { useDrop } from 'react-dnd';
import { ArcherContainer, ArcherElement } from 'react-archer';

const HashingZone = ({ buckets, handleDrop, splitBucket }) => {
  // Obtenemos las claves de los buckets y las ordenamos (para visualizarlas en orden)
  const indexLabels = Object.keys(buckets).sort();

  return (
    <ArcherContainer strokeColor="black" strokeWidth={2}>
      <div className="flex flex-col items-center w-full">
        {/* Contenedor principal: usamos items-center para alinear verticalmente */}
        <div className="flex flex-row gap-4 items-center pt-10">
          {/* Columna de índices */}
          <div className="flex flex-col items-center pr-20">
            <div className="flex flex-col border border-blue-300 rounded shadow-inner p-2">
              {indexLabels.map((idx, i) => (
                <ArcherElement
                  key={`index-${idx}`}
                  id={`index-${idx}`}
                  relations={[
                    {
                      targetId: `bucket-${idx}`,
                      targetAnchor: 'left',
                      sourceAnchor: 'right',
                      style: { strokeDasharray: '2,2', stroke: 'black' },
                    },
                  ]}
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
          </div>

          {/* Se muestra cada bucket */}
          <div className="flex flex-col items-center gap-4">
            {indexLabels.map((bucketId) => (
              <div className="flex flex-col items-center" key={`bucket-row-${bucketId}`}>
                <ArcherElement id={`bucket-${bucketId}`}>
                  <div className="flex flex-row items-center bg-gray-100 rounded-md shadow p-2 w-fit">
                    <h3 className="text-xs font-semibold mr-2 w-10 text-center">B{bucketId}</h3>
                    <div className="flex flex-row gap-0.5">
                      {[
                        ...buckets[bucketId],
                        ...Array(4 - buckets[bucketId].length).fill(null),
                      ].map((slotValue, index) => (
                        <Slot
                          key={index}
                          bucketId={bucketId}
                          slotIndex={index}
                          slotValue={slotValue}
                          handleDrop={handleDrop}
                        />
                      ))}
                    </div>
                  </div>
                </ArcherElement>
                {/* Si el bucket está lleno (4 elementos), se muestra el botón para dividirlo */}
                {buckets[bucketId].length === 4 && (
                  <button
                    onClick={() => splitBucket(bucketId)}
                    className="mt-2 px-2 py-1 text-xs bg-green-500 text-white rounded"
                  >
                    Split Bucket
                  </button>
                )}
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
    canDrop: () => slotValue === null, // Permite drop solo si el slot está vacío
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
