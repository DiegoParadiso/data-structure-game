
  // Función para verificar si el árbol es un BST válido mediante recorrido in-order
  const isBST = (node, prev = { value: -Infinity }) => {
    if (!node) return true;
    if (!isBST(node.left, prev)) return false;
    if (node.value <= prev.value) return false;
    prev.value = node.value;
    return isBST(node.right, prev);
  };

  
// Función para generar números aleatorios únicos
function generateRandomNumbers(size, min, max) {
    const numbers = new Set();
    while (numbers.size < size) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(randomNum);
    }
    return [...numbers];
  }

  export { generateRandomNumbers, isBST };
