import React from 'react';
import { ArcherContainer } from 'react-archer';
import TreeNodeHeap from './TreeNodeHeap';

export default function HeapTreeContainer({ tree, onSwapValues, isGameOver, hiddenNodeIds, mode, heapType }) {
  return (
    <div className="w-full md:w-[75%] p-2 border rounded bg-gray-50 min-h-[500px] flex justify-center items-start">
      <div>
        <h2 className="font-bold mb-2 pt-1 pb-20 text-center">
          Zona Heap ({heapType}-heap) — Reordena los nodos para cumplir la propiedad
        </h2>
        <ArcherContainer strokeColor="gray" strokeWidth={2}>
          {tree && (
            <TreeNodeHeap
              node={tree}
              onSwapValues={onSwapValues}
              isGameOver={isGameOver}
              hiddenNodeIds={hiddenNodeIds}
              mode={mode}
            />
          )}
        </ArcherContainer>
      </div>
    </div>
  );
}
