import { create } from 'zustand';
import { GraphState, GraphNode, GraphEdge, AlgorithmType, AlgorithmStep } from './types';

interface GraphActions {
  // Node operations
  addNode: (node: GraphNode) => void;
  addNodeWithAutoName: () => void; // Add node with automatic positioning and naming
  removeNode: (nodeId: string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
  getNodeLabel: (nodeId: string) => string | undefined; // Get node label by ID

  // Edge operations
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (edgeId: string) => void;

  // Selection
  selectElement: (type: 'node' | 'edge', id: string) => void;
  clearSelection: () => void;

  // Delete selected
  deleteSelected: () => void;

  // Connect mode
  toggleConnectMode: () => void;
  setConnectModeSource: (nodeId: string | null) => void;

  // Algorithm controls
  setAlgorithm: (algorithm: AlgorithmType) => void;
  setStartNode: (nodeId: string | null) => void;
  setEndNode: (nodeId: string | null) => void;
  setAlgorithmSteps: (steps: AlgorithmStep[]) => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  reset: () => void;
  clearGraph: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;

  // Feedback
  setFeedbackMessage: (message: string) => void;
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedElement: null,
  nodeCounter: 0,
  algorithm: null,
  isPlaying: false,
  playbackSpeed: 500,
  algorithmSteps: [],
  currentStepIndex: -1,
  startNode: null,
  endNode: null,
  isConnectMode: false,
  connectModeSource: null,
  feedbackMessage: 'Bienvenue! Cliquez sur "Ajouter un nœud" pour commencer.',
};

export const useGraphStore = create<GraphState & GraphActions>((set, get) => ({
  ...initialState,

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      nodeCounter: state.nodeCounter + 1,
      feedbackMessage: `Nœud ${node.label} ajouté`,
    }));
  },

  addNodeWithAutoName: () => {
    const state = get();
    const nodeId = `node-${Date.now()}`;
    const nodeLabel = `${String.fromCharCode(65 + (state.nodeCounter % 26))}${Math.floor(state.nodeCounter / 26) || ''}`;

    // Random position in a reasonable range
    const x = 200 + Math.random() * 400;
    const y = 200 + Math.random() * 300;

    get().addNode({
      id: nodeId,
      label: nodeLabel,
      x,
      y,
    });
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedElement: state.selectedElement?.id === nodeId ? null : state.selectedElement,
      feedbackMessage: `Nœud supprimé`,
    }));
  },

  updateNodePosition: (nodeId, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, x, y } : n
      ),
    }));
  },

  getNodeLabel: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    return node?.label;
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
      feedbackMessage: `Arête ajoutée avec poids ${edge.weight}`,
    }));
  },

  removeEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
      selectedElement: state.selectedElement?.id === edgeId ? null : state.selectedElement,
      feedbackMessage: `Arête supprimée`,
    }));
  },

  selectElement: (type, id) => {
    set({ selectedElement: { type, id } });
  },

  clearSelection: () => {
    set({ selectedElement: null });
  },

  deleteSelected: () => {
    const { selectedElement } = get();
    if (selectedElement) {
      if (selectedElement.type === 'node') {
        get().removeNode(selectedElement.id);
      } else {
        get().removeEdge(selectedElement.id);
      }
    }
  },

  toggleConnectMode: () => {
    set((state) => ({
      isConnectMode: !state.isConnectMode,
      connectModeSource: null,
      feedbackMessage: !state.isConnectMode
        ? 'Mode connexion: Cliquez sur le nœud source'
        : 'Mode connexion désactivé',
    }));
  },

  setConnectModeSource: (nodeId) => {
    set({
      connectModeSource: nodeId,
      feedbackMessage: nodeId
        ? `Source: ${nodeId}. Cliquez sur le nœud cible.`
        : 'Mode connexion: Cliquez sur le nœud source',
    });
  },

  setAlgorithm: (algorithm) => {
    set({
      algorithm,
      algorithmSteps: [],
      currentStepIndex: -1,
      isPlaying: false,
      feedbackMessage: algorithm ? `Algorithme: ${algorithm.toUpperCase()}` : 'Aucun algorithme sélectionné',
    });
  },

  setStartNode: (nodeId) => {
    set({
      startNode: nodeId,
      feedbackMessage: nodeId ? `Nœud de départ: ${nodeId}` : 'Nœud de départ effacé',
    });
  },

  setEndNode: (nodeId) => {
    set({
      endNode: nodeId,
      feedbackMessage: nodeId ? `Nœud d'arrivée: ${nodeId}` : 'Nœud d\'arrivée effacé',
    });
  },

  setAlgorithmSteps: (steps) => {
    set({
      algorithmSteps: steps,
      currentStepIndex: -1,
      feedbackMessage: `Algorithme calculé: ${steps.length} étapes`,
    });
  },

  play: () => {
    set({
      isPlaying: true,
      feedbackMessage: 'Lecture de l\'algorithme...',
    });
  },

  pause: () => {
    set({
      isPlaying: false,
      feedbackMessage: 'En pause',
    });
  },

  reset: () => {
    set({
      isPlaying: false,
      currentStepIndex: -1,
      feedbackMessage: 'Visualisation réinitialisée',
    });
  },

  clearGraph: () => {
    set({
      ...initialState,
      feedbackMessage: 'Graphe effacé',
    });
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
  },

  setCurrentStepIndex: (index) => {
    set({ currentStepIndex: index });
  },

  nextStep: () => {
    set((state) => {
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex >= state.algorithmSteps.length) {
        return {
          currentStepIndex: state.algorithmSteps.length - 1,
          isPlaying: false,
          feedbackMessage: 'Algorithme terminé',
        };
      }
      const step = state.algorithmSteps[nextIndex];
      return {
        currentStepIndex: nextIndex,
        feedbackMessage: step.message || `Étape ${nextIndex + 1}/${state.algorithmSteps.length}`,
      };
    });
  },

  setFeedbackMessage: (message) => {
    set({ feedbackMessage: message });
  },
}));
