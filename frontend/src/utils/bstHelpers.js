export function addNodeToTree(tree, parentVal, side, childVal) {
  if (!tree) return null;

  const addNode = (node) => {
    if (!node) return null;
    if (node.value === parentVal) {
      if (side === 'left' && !node.left) node.left = { value: childVal, left: null, right: null };
      if (side === 'right' && !node.right) node.right = { value: childVal, left: null, right: null };
    } else {
      if (node.left) addNode(node.left);
      if (node.right) addNode(node.right);
    }
    return node;
  };

  return addNode({ ...tree });
}

export function createRootNode(val) {
  return { value: val, left: null, right: null };
}
