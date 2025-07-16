import React from 'react';
import { ArcherElement } from 'react-archer';
import DropZone from './DropZone';

function TreeNode({ node, onAddChild, errorNode, depth = 0 }) {
  // Comprobamos si este es el nodo incorrecto
  const isErrorNode = errorNode && errorNode.value === node.value;
  

  // Definimos las relaciones (conexiones) para cada hijo
  const relations = [];
  if (node.left) {
    relations.push({
      targetId: `node-${node.left.value}`,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }
  if (node.right) {
    relations.push({
      targetId: `node-${node.right.value}`,
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { endMarker: false },
    });
  }

  return (
    <div className="relative flex flex-col items-center">
      <ArcherElement id={`node-${node.value}`} relations={relations}>
        <div
          className={`flex items-center justify-center ${isErrorNode ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}
          style={{
            width: '48px',
            height: '48px',
            border: '2px solid',
            borderRadius: '50%',
            background: 'white',
            textAlign: 'center',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            marginBottom: '16px',
          }}
        >
          {node.value}
        </div>
      </ArcherElement>
      <div className="flex justify-between w-full" style={{ minWidth: '80px', marginTop: '8px' }}>
        <div className="flex flex-col items-center">
          {node.left ? (
            <TreeNode node={node.left} onAddChild={onAddChild} errorNode={errorNode} depth={depth + 1} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'left', val)} isEnabled={depth < 3} />
          )}
        </div>
        <div className="flex flex-col items-center">
          {node.right ? (
            <TreeNode node={node.right} onAddChild={onAddChild} errorNode={errorNode} depth={depth + 1} />
          ) : (
            <DropZone onDrop={(val) => onAddChild(node.value, 'right', val)} isEnabled={depth < 3} />
          )}
        </div>
      </div>
    </div>
  );
}

export default TreeNode;