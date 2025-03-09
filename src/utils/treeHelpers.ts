export interface TreeNode<T> {
  value: T;
  nodeId: string;
  children?: TreeNode<T>[];
}

export const traverseDFS = <T>(
  nodes: TreeNode<T>[],
  visit: (node: TreeNode<T>) => void,
): void => {
  nodes.forEach((node) => {
    visit(node);
    if (node.children) {
      traverseDFS(node.children, visit);
    }
  });
};

export const findNode = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T, nodeId: string) => boolean,
): TreeNode<T> | null => {
  for (const node of nodes) {
    if (predicate(node.value, node.nodeId)) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, predicate);
      if (found) return found;
    }
  }
  return null;
};

export const findNodeById = <T>(
  nodes: TreeNode<T>[],
  nodeId: string,
): TreeNode<T> | null => {
  return findNode(nodes, (_, id) => id === nodeId);
};

export const removeNode = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T, nodeId: string) => boolean,
): TreeNode<T>[] =>
  nodes.reduce<TreeNode<T>[]>((acc, node) => {
    if (predicate(node.value, node.nodeId)) {
      return acc;
    }
    if (node.children) {
      acc.push({
        value: node.value,
        nodeId: node.nodeId,
        children: removeNode(node.children, predicate),
      });
      return acc;
    }
    acc.push(node);
    return acc;
  }, []);

export const removeNodeById = <T>(
  nodes: TreeNode<T>[],
  nodeId: string,
): TreeNode<T>[] => {
  return removeNode(nodes, (_, id) => id === nodeId);
};

export const addNode = <T>(
  nodes: TreeNode<T>[],
  parentPredicate: (value: T, nodeId: string) => boolean,
  newNode: TreeNode<T>,
): TreeNode<T>[] => {
  return nodes.map((node) => {
    if (parentPredicate(node.value, node.nodeId)) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentPredicate, newNode),
      };
    }
    return node;
  });
};

export const addNodeById = <T>(
  nodes: TreeNode<T>[],
  parentId: string,
  newNode: TreeNode<T>,
): TreeNode<T>[] => {
  return addNode(nodes, (_, nodeId) => nodeId === parentId, newNode);
};

export const changeNodeValues = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T, nodeId: string) => boolean,
  newValue: T,
): TreeNode<T>[] => {
  return nodes.map((node) => {
    if (predicate(node.value, node.nodeId)) {
      return {
        ...node,
        value: newValue,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: changeNodeValues(node.children, predicate, newValue),
      };
    }
    return node;
  });
};

export const changeNodeValueById = <T>(
  nodes: TreeNode<T>[],
  nodeId: string,
  newValue: T,
): TreeNode<T>[] => {
  return changeNodeValues(nodes, (_, id) => id === nodeId, newValue);
};

export const moveNode = <T>(
  nodes: TreeNode<T>[],
  nodePredicate: (value: T, nodeId: string) => boolean,
  newParentPredicate: (value: T, nodeId: string) => boolean,
): TreeNode<T>[] => {
  const nodeToMove = findNode(nodes, nodePredicate);
  if (!nodeToMove) return nodes;
  const nodesWithoutMoved = removeNode(nodes, nodePredicate);
  return addNode(nodesWithoutMoved, newParentPredicate, nodeToMove);
};

export const moveNodeById = <T>(
  nodes: TreeNode<T>[],
  nodeId: string,
  newParentId: string,
): TreeNode<T>[] => {
  return moveNode(
    nodes,
    (_, id) => id === nodeId,
    (_, id) => id === newParentId,
  );
};

export const filterNodes = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T, nodeId: string) => boolean,
): TreeNode<T>[] => {
  const result: TreeNode<T>[] = [];
  traverseDFS(nodes, (node) => {
    if (predicate(node.value, node.nodeId)) {
      result.push(node);
    }
  });
  return result;
};

export const filterNodesById = <T>(
  nodes: TreeNode<T>[],
  nodeIds: string[],
): TreeNode<T>[] => {
  return filterNodes(nodes, (_, id) => nodeIds.includes(id));
};

export const mapTree = <T, R>(
  nodes: TreeNode<T>[],
  mapFn: (value: T, nodeId: string) => R,
): TreeNode<R>[] =>
  nodes.map((node) => ({
    value: mapFn(node.value, node.nodeId),
    nodeId: node.nodeId,
    children: node.children ? mapTree(node.children, mapFn) : undefined,
  }));
