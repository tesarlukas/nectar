export interface TreeNode<T> {
  value: T;
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
  predicate: (value: T) => boolean,
): TreeNode<T> | null => {
  for (const node of nodes) {
    if (predicate(node.value)) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, predicate);
      if (found) return found;
    }
  }
  return null;
};

export const removeNode = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T) => boolean,
): TreeNode<T>[] =>
  nodes.reduce<TreeNode<T>[]>((acc, node) => {
    if (predicate(node.value)) {
      return acc;
    }
    if (node.children) {
      return [
        ...acc,
        {
          ...node,
          children: removeNode(node.children, predicate),
        },
      ];
    }
    return [...acc, node];
  }, []);

export const addNode = <T>(
  nodes: TreeNode<T>[],
  parentPredicate: (value: T) => boolean,
  newNode: TreeNode<T>,
): TreeNode<T>[] =>
  nodes.map((node) => {
    if (parentPredicate(node.value)) {
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

export const moveNode = <T>(
  nodes: TreeNode<T>[],
  nodePredicate: (value: T) => boolean,
  newParentPredicate: (value: T) => boolean,
): TreeNode<T>[] => {
  const nodeToMove = findNode(nodes, nodePredicate);
  if (!nodeToMove) return nodes;

  const nodesWithoutMoved = removeNode(nodes, nodePredicate);
  return addNode(nodesWithoutMoved, newParentPredicate, nodeToMove);
};

export const filterNodes = <T>(
  nodes: TreeNode<T>[],
  predicate: (value: T) => boolean,
): TreeNode<T>[] => {
  const result: TreeNode<T>[] = [];

  traverseDFS(nodes, (node) => {
    if (predicate(node.value)) {
      result.push(node);
    }
  });

  return result;
};

export const mapTree = <T, R>(
  nodes: TreeNode<T>[],
  mapFn: (value: T) => R,
): TreeNode<R>[] =>
  nodes.map((node) => ({
    value: mapFn(node.value),
    children: node.children ? mapTree(node.children, mapFn) : undefined,
  }));
