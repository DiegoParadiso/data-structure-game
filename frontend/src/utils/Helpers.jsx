export const isBST = (node, prev = { value: -Infinity }, errorNode = null) => {
  if (!node) return { isValid: true, errorNode };

  // Verificar el subárbol izquierdo
  const leftCheck = isBST(node.left, prev, errorNode);
  if (!leftCheck.isValid) return leftCheck;  // Si es inválido, devolver el error

  // Verificar si el valor actual es mayor que el anterior
  if (node.value <= prev.value) {
    // Si no es válido, actualizar errorNode con el nodo actual
    errorNode = node;
    return { isValid: false, errorNode };
  }

  prev.value = node.value; // Actualizamos el valor previo

  // Verificar el subárbol derecho
  return isBST(node.right, prev, errorNode);
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

  export { generateRandomNumbers };

  
  // Recibe un nodo con {value, left, right} y tipo 'min' o 'max'
// Retorna true si cumple propiedad heap
export function isHeap(node, heapType = 'min') {
  if (!node) return true;

  const left = node.left;
  const right = node.right;

  if (left) {
    if (heapType === 'min' && node.value > left.value) return false;
    if (heapType === 'max' && node.value < left.value) return false;
  }
  if (right) {
    if (heapType === 'min' && node.value > right.value) return false;
    if (heapType === 'max' && node.value < right.value) return false;
  }
  return isHeap(left, heapType) && isHeap(right, heapType);
}
