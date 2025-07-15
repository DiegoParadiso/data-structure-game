import { useState, useEffect } from 'react';
import { generateRandomNumbers, isBST } from '../utils/Helpers';
import useDailyStreak from './useDailyStreak';
import { addNodeToTree, createRootNode } from '../utils/bstHelpers';
import { useTimerSetup } from './useTimerSetup';

export default function useBSTGame({ mode = 'normal', timer, updateResult }) {
  const [available, setAvailable] = useState([]);
  const [tree, setTree] = useState(null);
  const [message, setMessage] = useState('');
  const [enabledIndex, setEnabledIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [errorNode, setErrorNode] = useState(null);

  const { canPlay, streak } = useDailyStreak('bst');
  const expiryTimestamp = useTimerSetup(timer);

  useEffect(() => {
    if (!canPlay) {
      setIsGameOver(true);
      setMessage('Ya jugaste hoy. ¡Volvé mañana!');
    }
  }, [canPlay]);

  useEffect(() => {
    let count = 8;
    if (mode === 'easy') count = 5;
    else if (mode === 'hard') count = 10;

    setAvailable(generateRandomNumbers(count, 1, 99));
  }, [mode]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    setGameStatus('fail');
    setMessage('¡El tiempo se acabó!');
    updateResult(false);
  };

  const handleAddChild = (parentVal, side, childVal) => {
    if (isGameOver) return;

    const updatedTree = addNodeToTree(tree, parentVal, side, childVal);
    setTree(updatedTree);
    setEnabledIndex(prev => prev + 1);

    const { isValid, errorNode } = isBST(updatedTree);
    if (!isValid) {
      setIsGameOver(true);
      setGameStatus('fail');
      setMessage('Te equivocaste, ese no es un BST válido.');
      setErrorNode(errorNode);
      updateResult(false);
    } else if (enabledIndex + 1 === available.length) {
      setIsGameOver(true);
      setGameStatus('success');
      setMessage('¡Todos los nodos colocados correctamente!');
      updateResult(true);
    }
  };

  const handleAddRoot = (val) => {
    if (isGameOver) return;
    const newTree = createRootNode(val);
    setTree(newTree);
    setEnabledIndex(1);

    const { isValid, errorNode } = isBST(newTree);
    if (!isValid) {
      setIsGameOver(true);
      setGameStatus('fail');
      setMessage('Has colocado un nodo inválido');
      setErrorNode(errorNode);
      updateResult(false);
    }
  };

  const handleVerify = () => {
    const { isValid, errorNode } = isBST(tree);
    setIsGameOver(true);
    setGameStatus(isValid ? 'success' : 'fail');
    setMessage(isValid ? '¡El árbol es correcto!' : 'El árbol NO es un BST correcto.');
    if (!isValid) setErrorNode(errorNode);
    updateResult(isValid);
  };

  return {
    available,
    tree,
    message,
    enabledIndex,
    expiryTimestamp,
    isGameOver,
    gameStatus,
    errorNode,
    streak,
    handleTimeUp,
    handleAddChild,
    handleAddRoot,
    handleVerify,
  };
}
