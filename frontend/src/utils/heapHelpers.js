// Comprueba si el árbol es un min-heap
export function isMinHeap(node) {
  if (!node) return { isValid: true };

  const leftCheck = node.left ? node.value <= node.left.value : true;
  const rightCheck = node.right ? node.value <= node.right.value : true;

  if (!leftCheck || !rightCheck) return { isValid: false };

  const leftValid = node.left ? isMinHeap(node.left).isValid : true;
  const rightValid = node.right ? isMinHeap(node.right).isValid : true;

  return { isValid: leftValid && rightValid };
}

// Intercambia nodos según la ruta pathA y pathB
export function swapNodes(root, pathA, pathB) {
  // Obtener referencia a nodo y padre usando path (array de 'left'/'right')
  function getNodeAndParent(node, path) {
    let parent = null;
    let current = node;
    for (let i = 0; i < path.length; i++) {
      parent = current;
      current = current[path[i]];
      if (!current) break;
    }
    return { parent, node: current };
  }

  // Copia profunda para evitar mutar el estado original
  const newRoot = JSON.parse(JSON.stringify(root));

  // Función para acceder con path y obtener nodos
  function getRefNode(node, path) {
    let current = node;
    for (const p of path) {
      if (!current) break;
      current = current[p];
    }
    return current;
  }

  // Acceder a nodos
  const nodeA = getRefNode(newRoot, pathA);
  const nodeB = getRefNode(newRoot, pathB);

  if (!nodeA || !nodeB) return newRoot;

  // Ahora hay que intercambiar sus valores, ya que intercambiar referencias rompe la estructura
  const tempValue = nodeA.value;
  nodeA.value = nodeB.value;
  nodeB.value = tempValue;

  return newRoot;
}

export const isMaxHeap = (node) => {
  if (!node) return { isValid: true, errorNode: null };

  const queue = [node];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.left) {
      if (current.left.value > current.value) {
        return { isValid: false, errorNode: current.left };
      }
      queue.push(current.left);
    }

    if (current.right) {
      if (current.right.value > current.value) {
        return { isValid: false, errorNode: current.right };
      }
      queue.push(current.right);
    }
  }

  return { isValid: true, errorNode: null };
};
