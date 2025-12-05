import { GraphNode, GraphEdge, AlgorithmStep } from './types';

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// BFS Algorithm - Returns step-by-step history
export function runBFS(
  graph: Graph,
  startNodeId: string,
  endNodeId?: string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const parent = new Map<string, string | null>();
  const adjacencyList = buildAdjacencyList(graph);

  // Helper: Convert node ID to label
  const getLabel = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.label || nodeId;
  };

  parent.set(startNodeId, null);
  visited.add(startNodeId);

  steps.push({
    type: 'node',
    id: startNodeId,
    state: 'start',
    message: `Début du BFS depuis ${getLabel(startNodeId)}`,
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    steps.push({
      type: 'node',
      id: nodeId,
      state: 'visiting',
      message: `Visite du nœud ${getLabel(nodeId)}`,
    });

    if (endNodeId && nodeId === endNodeId) {
      steps.push({
        type: 'node',
        id: nodeId,
        state: 'end',
        message: `Nœud cible ${getLabel(nodeId)} trouvé`,
      });

      // Reconstruct path
      const path: string[] = [];
      let current: string | null = endNodeId;
      while (current !== null) {
        path.unshift(current);
        current = parent.get(current) || null;
      }

      // Mark path
      for (let i = 0; i < path.length; i++) {
        if (i > 0) {
          const edge = graph.edges.find(
            (e) => e.source === path[i - 1] && e.target === path[i]
          );
          if (edge) {
            steps.push({
              type: 'edge',
              id: edge.id,
              state: 'path',
              message: `Arête ${getLabel(path[i - 1])} → ${getLabel(path[i])} fait partie du chemin`,
            });
          }
        }
        steps.push({
          type: 'node',
          id: path[i],
          state: 'path',
          message: `Nœud ${getLabel(path[i])} fait partie du chemin`,
        });
      }

      return steps;
    }

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const { targetId, edgeId } of neighbors) {
      if (!visited.has(targetId)) {
        visited.add(targetId);
        parent.set(targetId, nodeId);
        queue.push(targetId);

        steps.push({
          type: 'edge',
          id: edgeId,
          state: 'traversing',
          message: `Exploration de l'arête vers ${getLabel(targetId)}`,
        });
      }
    }

    steps.push({
      type: 'node',
      id: nodeId,
      state: 'visited',
      message: `Exploration de ${getLabel(nodeId)} terminée`,
    });
  }

  return steps;
}

// DFS Algorithm - Returns step-by-step history
export function runDFS(
  graph: Graph,
  startNodeId: string,
  endNodeId?: string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const adjacencyList = buildAdjacencyList(graph);

  // Helper: Convert node ID to label
  const getLabel = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.label || nodeId;
  };

  steps.push({
    type: 'node',
    id: startNodeId,
    state: 'start',
    message: `Début du DFS depuis ${getLabel(startNodeId)}`,
  });

  function dfs(nodeId: string): boolean {
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    steps.push({
      type: 'node',
      id: nodeId,
      state: 'visiting',
      message: `Visite du nœud ${getLabel(nodeId)}`,
    });

    if (endNodeId && nodeId === endNodeId) {
      steps.push({
        type: 'node',
        id: nodeId,
        state: 'end',
        message: `Nœud cible ${getLabel(nodeId)} trouvé`,
      });
      return true;
    }

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const { targetId, edgeId } of neighbors) {
      if (!visited.has(targetId)) {
        steps.push({
          type: 'edge',
          id: edgeId,
          state: 'traversing',
          message: `Exploration de l'arête vers ${getLabel(targetId)}`,
        });

        if (dfs(targetId)) {
          steps.push({
            type: 'edge',
            id: edgeId,
            state: 'path',
            message: `Arête fait partie du chemin`,
          });
          steps.push({
            type: 'node',
            id: nodeId,
            state: 'path',
            message: `Nœud ${getLabel(nodeId)} fait partie du chemin`,
          });
          return true;
        }

        steps.push({
          type: 'edge',
          id: edgeId,
          state: 'traversed',
          message: `Retour arrière depuis ${getLabel(targetId)}`,
        });
      }
    }

    steps.push({
      type: 'node',
      id: nodeId,
      state: 'visited',
      message: `Exploration de ${getLabel(nodeId)} terminée`,
    });

    return false;
  }

  dfs(startNodeId);

  return steps;
}

// Dijkstra's Algorithm - Returns step-by-step history
export function runDijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId?: string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();
  const adjacencyList = buildAdjacencyList(graph);

  // Helper: Convert node ID to label
  const getLabel = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.label || nodeId;
  };

  // Initialize distances
  graph.nodes.forEach((node) => {
    distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
    previous.set(node.id, null);
  });

  steps.push({
    type: 'node',
    id: startNodeId,
    state: 'start',
    message: `Début de Dijkstra depuis ${getLabel(startNodeId)}`,
    distance: 0,
  });

  // Priority queue (simplified - using array and sorting)
  const queue = [startNodeId];

  while (queue.length > 0) {
    // Get node with minimum distance
    queue.sort((a, b) => (distances.get(a) || Infinity) - (distances.get(b) || Infinity));
    const currentId = queue.shift()!;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentDistance = distances.get(currentId)!;

    steps.push({
      type: 'node',
      id: currentId,
      state: 'visiting',
      message: `Visite de ${getLabel(currentId)}, distance: ${currentDistance}`,
      distance: currentDistance,
    });

    if (endNodeId && currentId === endNodeId) {
      steps.push({
        type: 'node',
        id: currentId,
        state: 'end',
        message: `Cible ${getLabel(currentId)} atteinte, distance: ${currentDistance}`,
        distance: currentDistance,
      });

      // Reconstruct path
      reconstructPath(previous, endNodeId, steps, graph.edges, graph);
      break;
    }

    const neighbors = adjacencyList.get(currentId) || [];
    for (const { targetId, edgeId, weight } of neighbors) {
      if (visited.has(targetId)) continue;

      const newDistance = currentDistance + weight;
      const oldDistance = distances.get(targetId)!;

      if (newDistance < oldDistance) {
        distances.set(targetId, newDistance);
        previous.set(targetId, currentId);
        queue.push(targetId);

        steps.push({
          type: 'edge',
          id: edgeId,
          state: 'traversing',
          message: `Relaxation arête vers ${getLabel(targetId)}, nouvelle distance: ${newDistance}`,
          distance: newDistance,
        });
      }
    }

    steps.push({
      type: 'node',
      id: currentId,
      state: 'visited',
      message: `Terminé avec ${getLabel(currentId)}`,
      distance: currentDistance,
    });
  }

  return steps;
}

// A* Algorithm - Returns step-by-step history
export function runAStar(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();
  const adjacencyList = buildAdjacencyList(graph);

  // Helper: Convert node ID to label
  const getLabel = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.label || nodeId;
  };

  // Get node positions for heuristic
  const nodePositions = new Map<string, { x: number; y: number }>();
  graph.nodes.forEach((node) => {
    if (node.x !== undefined && node.y !== undefined) {
      nodePositions.set(node.id, { x: node.x, y: node.y });
    }
  });

  // Heuristic function (Euclidean distance)
  const heuristic = (nodeId: string): number => {
    const pos1 = nodePositions.get(nodeId);
    const pos2 = nodePositions.get(endNodeId);
    if (!pos1 || !pos2) return 0;
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  };

  // Initialize scores
  graph.nodes.forEach((node) => {
    gScore.set(node.id, node.id === startNodeId ? 0 : Infinity);
    fScore.set(node.id, node.id === startNodeId ? heuristic(startNodeId) : Infinity);
    previous.set(node.id, null);
  });

  steps.push({
    type: 'node',
    id: startNodeId,
    state: 'start',
    message: `Début de A* depuis ${getLabel(startNodeId)}`,
    distance: 0,
  });

  const openSet = [startNodeId];

  while (openSet.length > 0) {
    // Get node with lowest fScore
    openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
    const currentId = openSet.shift()!;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentGScore = gScore.get(currentId)!;
    const currentFScore = fScore.get(currentId)!;

    steps.push({
      type: 'node',
      id: currentId,
      state: 'visiting',
      message: `Visite de ${getLabel(currentId)}, f=${currentFScore.toFixed(1)}, g=${currentGScore}`,
      distance: currentGScore,
    });

    if (currentId === endNodeId) {
      steps.push({
        type: 'node',
        id: currentId,
        state: 'end',
        message: `Cible ${getLabel(currentId)} atteinte, distance: ${currentGScore}`,
        distance: currentGScore,
      });

      // Reconstruct path
      reconstructPath(previous, endNodeId, steps, graph.edges, graph);
      break;
    }

    const neighbors = adjacencyList.get(currentId) || [];
    for (const { targetId, edgeId, weight } of neighbors) {
      if (visited.has(targetId)) continue;

      const tentativeGScore = currentGScore + weight;
      const oldGScore = gScore.get(targetId)!;

      if (tentativeGScore < oldGScore) {
        previous.set(targetId, currentId);
        gScore.set(targetId, tentativeGScore);
        fScore.set(targetId, tentativeGScore + heuristic(targetId));
        openSet.push(targetId);

        steps.push({
          type: 'edge',
          id: edgeId,
          state: 'traversing',
          message: `Relaxation arête vers ${getLabel(targetId)}, g=${tentativeGScore}`,
          distance: tentativeGScore,
        });
      }
    }

    steps.push({
      type: 'node',
      id: currentId,
      state: 'visited',
      message: `Terminé avec ${getLabel(currentId)}`,
      distance: currentGScore,
    });
  }

  return steps;
}

// Helper: Build adjacency list
function buildAdjacencyList(graph: Graph) {
  const adjacencyList = new Map<
    string,
    Array<{ targetId: string; edgeId: string; weight: number }>
  >();

  graph.edges.forEach((edge) => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push({
      targetId: edge.target,
      edgeId: edge.id,
      weight: edge.weight,
    });
  });

  return adjacencyList;
}

// Helper: Reconstruct path from previous map
function reconstructPath(
  previous: Map<string, string | null>,
  endNodeId: string,
  steps: AlgorithmStep[],
  edges: GraphEdge[],
  graph: Graph
) {
  // Helper: Convert node ID to label
  const getLabel = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.label || nodeId;
  };

  const path: string[] = [];
  let current: string | null = endNodeId;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }

  // Mark path nodes and edges
  for (let i = 0; i < path.length; i++) {
    if (i > 0) {
      // Find edge between path[i-1] and path[i]
      const edge = edges.find(
        (e) => e.source === path[i - 1] && e.target === path[i]
      );
      if (edge) {
        steps.push({
          type: 'edge',
          id: edge.id,
          state: 'path',
          message: `Arête ${getLabel(path[i - 1])} → ${getLabel(path[i])} dans le plus court chemin`,
        });
      }
    }

    steps.push({
      type: 'node',
      id: path[i],
      state: 'path',
      message: `Nœud ${getLabel(path[i])} dans le plus court chemin`,
    });
  }
}
