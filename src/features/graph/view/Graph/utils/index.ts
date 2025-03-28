import type { GraphData } from "../types";

/**
 * Performs breadth-first search on a graph with string IDs
 * @param graphData The graph data structure
 * @param startNodeId The ID of the node to start from
 * @returns Array of node IDs in BFS order
 */
export function bfs(graphData: GraphData, startNodeId: string): string[] {
  // Create an adjacency list
  const adjacencyList = new Map<string, string[]>();

  // Initialize the adjacency list with empty arrays for all nodes
  graphData.nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  // Fill the adjacency list based on the links
  graphData.links.forEach((link) => {
    const sourceNeighbors = adjacencyList.get(link.source) || [];
    sourceNeighbors.push(link.target);
    adjacencyList.set(link.source, sourceNeighbors);
  });

  // Set to keep track of visited nodes
  const visited = new Set<string>();

  // Queue for BFS - using an array for simplicity
  const queue: string[] = [startNodeId];

  // Array to store the order of visited nodes
  const result: string[] = [];

  // Mark the start node as visited
  visited.add(startNodeId);

  // Process nodes in BFS order
  while (queue.length > 0) {
    // Using array shift, which returns undefined if the array is empty
    const currentNodeId = queue.shift();

    // TypeScript safeguard - should never happen since we check queue.length
    if (currentNodeId === undefined) {
      continue;
    }

    result.push(currentNodeId);

    // Get neighbors of the current node
    const neighbors = adjacencyList.get(currentNodeId) || [];

    // Add unvisited neighbors to the queue
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return result;
}

/**
 * Find nodes reachable from a start node up to a specified maximum distance
 * @param graphData The graph data
 * @param startNodeId Starting node ID
 * @param maxDistance Maximum distance from start node
 * @returns Map with distance as key and array of node IDs at that distance as value
 */
export function findNodesAtDistances(
  graphData: GraphData,
  startNodeId: string,
  maxDistance: number,
): Map<number, string[]> {
  // Create adjacency list
  const adjacencyList = new Map<string, string[]>();
  graphData.nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  graphData.links.forEach(({ source, target }) => {
    if (typeof source === "string" || typeof target === "string") return;

    const sourceNeighbors = adjacencyList.get(source.id) || [];
    sourceNeighbors.push(target.id);
    adjacencyList.set(source.id, sourceNeighbors);
  });

  // Type for queue items
  interface QueueItem {
    id: string;
    distance: number;
  }

  // Keep track of visited nodes and their distances
  const visited = new Set<string>();
  const distances = new Map<string, number>();

  // Map to store nodes grouped by distance
  const nodesByDistance = new Map<number, string[]>();

  // Queue with node IDs and their distances
  const queue: QueueItem[] = [
    {
      id: startNodeId,
      distance: 0,
    },
  ];

  // Initialize with start node
  visited.add(startNodeId);
  distances.set(startNodeId, 0);
  nodesByDistance.set(0, [startNodeId]);

  // BFS
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode === undefined) {
      continue;
    }

    const { id: currentId, distance } = currentNode;

    // Skip if we've reached max distance
    if (distance >= maxDistance) {
      continue;
    }

    // Process neighbors
    const neighbors = adjacencyList.get(currentId) || [];
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);

        const newDistance = distance + 1;
        distances.set(neighborId, newDistance);

        // Add to appropriate distance group
        if (!nodesByDistance.has(newDistance)) {
          nodesByDistance.set(newDistance, []);
        }

        const nodesAtDistance = nodesByDistance.get(newDistance);
        if (nodesAtDistance) {
          nodesAtDistance.push(neighborId);
        }

        // Add to queue for further processing
        queue.push({
          id: neighborId,
          distance: newDistance,
        });
      }
    }
  }

  return nodesByDistance;
}

/**
 * Find shortest path between two nodes
 * @param graphData The graph data
 * @param startNodeId Start node ID
 * @param endNodeId End node ID
 * @returns Array of node IDs representing the path, or null if no path exists
 */
export function findShortestPath(
  graphData: GraphData,
  startNodeId: string,
  endNodeId: string,
): string[] | null {
  // Create adjacency list
  const adjacencyList = new Map<string, string[]>();
  graphData.nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  graphData.links.forEach(({ source, target }) => {
    if (typeof source === "string" || typeof target === "string") return;

    const sourceNeighbors = adjacencyList.get(source.id) || [];
    sourceNeighbors.push(target.id);
    adjacencyList.set(source.id, sourceNeighbors);
  });

  // Track visited nodes
  const visited = new Set<string>();

  // Map to store the previous node in the path
  const previous = new Map<string, string | null>();

  // Queue for BFS
  const queue: string[] = [startNodeId];

  // Initialize
  visited.add(startNodeId);
  previous.set(startNodeId, null);

  // BFS until we find the end node or exhaust the queue
  let found = false;
  while (queue.length > 0 && !found) {
    const currentId = queue.shift();

    if (currentId === undefined) {
      continue;
    }

    if (currentId === endNodeId) {
      found = true;
      break;
    }

    const neighbors = adjacencyList.get(currentId) || [];

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        previous.set(neighborId, currentId);
        queue.push(neighborId);
      }
    }
  }

  // If end node wasn't reached, no path exists
  if (!found) {
    return null;
  }

  // Reconstruct the path
  const path: string[] = [];
  let current: string | null = endNodeId;

  while (current !== null) {
    path.unshift(current);
    const prev = previous.get(current);
    current = prev !== undefined ? prev : null;
  }

  return path;
}
