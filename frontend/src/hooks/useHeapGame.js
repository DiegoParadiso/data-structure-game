import { useState, useEffect } from 'react';
import { generateRandomNumbers, isHeap } from '../utils/Helpers';
import useDailyStreak from './useDailyStreak';

export function useHeapGame({ mode = 'normal', heapTypeFromState, timer, updateResult }) {
  const [heapType, setHeapType] = useState(() => {
    if (heapTypeFromState === 'min' || heapTypeFromState === 'max') return heapTypeFromState;
    return Math.random() < 0.5 ? 'min' : 'max';
  });

  const [tree, setTree] = useState(null);
  const [hiddenNodeIds, setHiddenNodeIds] = useState(new Set());
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState(null);

  const { canPlay, streak, updateResult: updateStreakResult } = useDailyStreak('heapgame');

  useEffect(() => {
    if (!canPlay) {
      setIsGameOver(true);
      setMessage('Ya jugaste hoy. ¡Volvé mañana!');
    }
  }, [canPlay]);

  // Inicializar árbol y nodos ocultos
  useEffect(() => {
    let nNodes = 15;
    if (mode === 'easy') nNodes = 10;
    else if (mode === 'hard') nNodes = 20;

    const nodes = generateRandomNumbers(nNodes, 1, 99);

    let sortedNodes;
    if (heapType === 'min') sortedNodes = [...nodes].sort((a, b) => a - b);
    else sortedNodes = [...nodes].sort((a, b) => b - a);

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

    const heapTree = createNodeWithIndex(0);
    setTree(heapTree);

    if (mode === 'hard') {
      const nHidden = Math.min(2, Math.max(1, Math.floor(nNodes * 0.2)));
      const indices = Array.from({ length: nNodes }, (_, i) => i);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);
      const hiddenIdsSet = new Set(shuffledIndices.slice(0, nHidden).map(i => `node-${i}`));
      setHiddenNodeIds(hiddenIdsSet);
    } else {
      setHiddenNodeIds(new Set());
    }
  }, [mode, heapType]);

  useEffect(() => {
    if (!timer) return;
    const secondsToAdd = parseInt(timer, 10);
    if (secondsToAdd > 0) {
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + secondsToAdd);
      setExpiryTimestamp(expiry);
    }
  }, [timer]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus("fail");
    setMessage('¡El tiempo se acabó!');
    updateStreakResult(false);
    updateResult(false);
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
    updateStreakResult(valid);
    updateResult(valid);
  };

  return {
    heapType,
    tree,
    hiddenNodeIds,
    expiryTimestamp,
    isGameOver,
    message,
    gameStatus,
    streak,
    setHeapType,
    handleTimeUp,
    handleSwapValues,
    handleVerify,
  };
}
