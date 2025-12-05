export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export type AlgorithmType = 'dfs' | 'bfs' | 'dijkstra' | 'astar' | null;

export type NodeState = 'default' | 'visiting' | 'visited' | 'start' | 'end' | 'path';
export type EdgeState = 'default' | 'traversing' | 'traversed' | 'path';

export interface AlgorithmStep {
  type: 'node' | 'edge';
  id: string;
  state: NodeState | EdgeState;
  message?: string;
  distance?: number;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedElement: { type: 'node' | 'edge'; id: string } | null;
  nodeCounter: number; // Track node count for unique naming

  // Algorithm playback state
  algorithm: AlgorithmType;
  isPlaying: boolean;
  playbackSpeed: number; // milliseconds per step
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;

  // Algorithm parameters
  startNode: string | null;
  endNode: string | null;

  // UI state
  isConnectMode: boolean;
  connectModeSource: string | null;
  feedbackMessage: string;
}
