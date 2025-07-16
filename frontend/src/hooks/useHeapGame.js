import { useState, useEffect } from 'react';
import { generateRandomNumbers, isHeap } from '../utils/Helpers';
import useDailyGameBase from './useDailyGameBase';

export function useHeapGame({ mode = 'normal', heapTypeFromState, timer, updateResult }) {
  // Hook base para estados comunes
  const {
    message,
    setMessage,
    isGameOver,
    setIsGameOver,
    gameStatus,
    setGameStatus,
    streak,
    expiryTimestamp,
    updateResults,
  } = useDailyGameBase('heapgame', timer, updateResult);

  const [heapType, setHeapType] = useState(() => {
    if (heapTypeFromState === 'min' || heapTypeFromState === 'max') return heapTypeFromState;
    return Math.random() < 0.5 ? 'min' : 'max';
  });

  const [tree, setTree] = useState(null);
  const [hiddenNodeIds, setHiddenNodeIds] = useState(new Set());

  useEffect(() => {
    if (isGameOver) return; // evita reiniciar si juego terminado
    let nNodes = 15;
    if (mode === 'easy') nNodes = 10;
    else if (mode === 'hard') nNodes = 20;

    const nodes = generateRandomNumbers(nNodes, 1, 99);
    let sortedNodes = heapType === 'min' ? [...nodes].sort((a, b) => a - b) : [...nodes].sort((a, b) => b - a);
    const shuffled = [...sortedNodes].sort(() => Math.random() - 0.5);

    const createNodeWithIndex = (index) => {
      if (index >= shuffled.length) return null;
      return {
        id: `node-${index}`,
        value: shuffled[index],
        left: createNodeWithIndex(2 * index + 1),
        right: createNodeWithIndex(2 * index + 2),
      };
    };

    setTree(createNodeWithIndex(0));

    if (mode === 'hard') {
      const nHidden = Math.min(2, Math.max(1, Math.floor(nNodes * 0.2)));
      const indices = Array.from({ length: nNodes }, (_, i) => i);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);
      setHiddenNodeIds(new Set(shuffledIndices.slice(0, nHidden).map(i => `node-${i}`)));
    } else {
      setHiddenNodeIds(new Set());
    }
  }, [mode, heapType, isGameOver]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus("fail");
    setMessage('¡El tiempo se acabó!');
    updateResults(false);
  };

  const areParentAndChild = (node, sourceId, targetId) => {
    if (!node) return false;
    const leftMatch = node.left && (
      (node.id === sourceId && node.left.id === targetId) ||
      (node.id === targetId && node.left.id === sourceId)
    );
    const rightMatch = node.right && (
      (node.id === sourceId && node.right.id === targetId) ||
      (node.id === targetId && node.right.id === sourceId)
    );
    return leftMatch || rightMatch || areParentAndChild(node.left, sourceId, targetId) || areParentAndChild(node.right, sourceId, targetId);
  };

  const handleSwapValues = (sourceId, targetId) => {
    if (!areParentAndChild(tree, sourceId, targetId)) return;
    if (isGameOver) return;

    const swapInTree = (node) => {
      if (!node) return;
      if (node.id === sourceId) node._swapMarker = 'source';
      else if (node.id === targetId) node._swapMarker = 'target';
      swapInTree(node.left);
      swapInTree(node.right);
    };

    setTree(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      swapInTree(newTree);

      const findAndSwap = (node) => {
        if (!node) return [null, null];
        let source = null, target = null;
        if (node._swapMarker === 'source') source = node;
        if (node._swapMarker === 'target') target = node;
        const [leftS, leftT] = findAndSwap(node.left);
        const [rightS, rightT] = findAndSwap(node.right);
        source = source || leftS || rightS;
        target = target || leftT || rightT;
        return [source, target];
      };

      const [sourceNode, targetNode] = findAndSwap(newTree);
      if (sourceNode && targetNode) {
        [sourceNode.value, targetNode.value] = [targetNode.value, sourceNode.value];
      }

      const cleanMarkers = (node) => {
        if (!node) return;
        delete node._swapMarker;
        cleanMarkers(node.left);
        cleanMarkers(node.right);
      };
      cleanMarkers(newTree);

      return newTree;
    });
  };

  const handleVerify = () => {
    const valid = isHeap(tree, heapType);
    setIsGameOver(true);
    setGameStatus(valid ? "success" : "fail");
    setMessage(valid ? '¡El árbol cumple la propiedad heap!' : 'El árbol NO cumple la propiedad heap.');
    updateResults(valid);
  };

  return {
    heapType,
    setHeapType,
    tree,
    hiddenNodeIds,
    expiryTimestamp,
    isGameOver,
    message,
    gameStatus,
    streak,
    handleTimeUp,
    handleSwapValues,
    handleVerify,
  };
}
