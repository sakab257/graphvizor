'use client';

import { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
// @ts-ignore
import edgehandles from 'cytoscape-edgehandles';
import { useGraphStore } from '@/lib/store';
import { EdgeWeightDialog } from './edge-weight-dialog';

// Enregistrement de l'extension
if (typeof Cytoscape !== 'undefined') {
  try {
    Cytoscape.use(edgehandles);
  } catch (e) {
    console.warn("Extension déjà enregistrée ou erreur mineure", e);
  }
}

export function GraphCanvas() {
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const edgehandlesRef = useRef<any>(null);
  const isProcessingEdgeRef = useRef(false); // Flag pour empêcher les boucles
  const [pendingEdge, setPendingEdge] = useState<{
    sourceId: string;
    targetId: string;
    sourceLabel: string;
    targetLabel: string;
  } | null>(null);

  const {
    nodes,
    edges,
    isConnectMode,
    addEdge,
    selectElement,
    clearSelection,
    updateNodePosition,
    algorithmSteps,
    currentStepIndex,
    getNodeLabel,
  } = useGraphStore();

  const cytoscapeElements = [
    ...nodes.map((node) => ({
      data: { id: node.id, label: node.label },
      position: node.x !== undefined && node.y !== undefined ? { x: node.x, y: node.y } : undefined,
    })),
    ...edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.weight.toString(),
        weight: edge.weight,
      },
    })),
  ];

  const stylesheet: any[] = [
    // --- NOEUDS ---
    {
      selector: 'node',
      style: {
        'background-color': '#fff',
        'border-width': 3,
        'border-color': '#000',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '16px',
        'font-weight': 'bold',
        'color': '#000',
        'width': 50,
        'height': 50,
        'min-width': 50,
        'min-height': 50,
        'font-family': 'monospace',
        'text-wrap': 'none',
        'compound-sizing-wrt-labels': 'exclude',
      } as any,
    },
    {
      selector: 'node[label]',
      style: {
        'label': 'data(label)',
      } as any,
    },
    // États algorithmiques
    { selector: 'node[state="visiting"]', style: { 'background-color': '#fbbf24' } as any },
    { selector: 'node[state="visited"]', style: { 'background-color': '#60a5fa' } as any },
    { selector: 'node[state="start"]', style: { 'background-color': '#34d399' } as any },
    { selector: 'node[state="end"]', style: { 'background-color': '#f87171' } as any },
    { selector: 'node[state="path"]', style: { 'background-color': '#a78bfa' } as any },
    { 
      selector: 'node:selected', 
      style: { 'border-width': 5, 'width': 50, 'height': 50 } as any 
    },

    // --- ARÊTES ---
    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'width': 3,
        'line-color': '#000',
        'target-arrow-color': '#000',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 1.5,
        'label': 'data(label)',
        'font-size': '14px',
        'font-weight': 'bold',
        'color': '#000',
        'text-background-opacity': 1,
        'text-background-color': '#fff',
        'text-background-padding': '4px',
        'text-border-width': 2,
        'text-border-color': '#000',
      } as any,
    },
    // Styles Algorithmes
    { selector: 'edge[state="traversing"]', style: { 'line-color': '#fbbf24', 'target-arrow-color': '#fbbf24', 'width': 4 } as any },
    { selector: 'edge[state="traversed"]', style: { 'line-color': '#60a5fa', 'target-arrow-color': '#60a5fa' } as any },
    { selector: 'edge[state="path"]', style: { 'line-color': '#a78bfa', 'target-arrow-color': '#a78bfa', 'width': 5 } as any },
    
    {
      selector: '.eh-preview, .eh-ghost-edge',
      style: {
        'background-color': '#000',
        'line-color': '#000',
        'target-arrow-color': '#000',
        'source-arrow-color': '#000',
        'width': 3,
        'line-style': 'dashed',
        'opacity': 0.8,
      } as any,
    },

    // --- EDGEHANDLES STYLES (À LA FIN POUR PRIORITÉ MAXIMALE) ---
    {
      selector: '.eh-handle',
      style: {
        'background-color': '#000',
        'width': 16,
        'height': 16,
        'shape': 'ellipse',
        'border-width': 2,
        'border-color': '#fff',
      } as any,
    },
    // HOVER: nœud survolé pendant le drag
    {
      selector: 'node.eh-hover',
      style: {
        'background-color': '#fbbf24',
        'border-width': 3,
        'border-color': '#000',
        'border-style': 'solid',
        'border-opacity': 1,
        'width': 50,
        'height': 50,
        'min-width': 50,
        'min-height': 50,
        'shape': 'ellipse',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '16px',
        'font-weight': 'bold',
        'color': '#000',
        'font-family': 'monospace',
        'text-wrap': 'none',
        'compound-sizing-wrt-labels': 'exclude',
        'label': 'data(label)',
      } as any,
    },
    // SOURCE: nœud de départ de l'arête
    {
      selector: 'node.eh-source',
      style: {
        'background-color': '#dbeafe',
        'border-color': '#3b82f6',
        'border-width': 4,
        'border-style': 'solid',
        'border-opacity': 1,
        'width': 50,
        'height': 50,
        'min-width': 50,
        'min-height': 50,
        'shape': 'ellipse',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '16px',
        'font-weight': 'bold',
        'color': '#000',
        'font-family': 'monospace',
        'text-wrap': 'none',
        'compound-sizing-wrt-labels': 'exclude',
        'label': 'data(label)',
      } as any,
    },
    // TARGET: nœud cible pendant le drag
    {
      selector: 'node.eh-target',
      style: {
        'background-color': '#d1fae5',
        'border-color': '#10b981',
        'border-width': 4,
        'border-style': 'solid',
        'border-opacity': 1,
        'width': 50,
        'height': 50,
        'min-width': 50,
        'min-height': 50,
        'shape': 'ellipse',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '16px',
        'font-weight': 'bold',
        'color': '#000',
        'font-family': 'monospace',
        'text-wrap': 'none',
        'compound-sizing-wrt-labels': 'exclude',
        'label': 'data(label)',
      } as any,
    },
  ];

  const handleCyInit = (cy: Cytoscape.Core) => {
    cyRef.current = cy;

    // Gestion de la sélection
    cy.on('tap', 'node', (evt) => {
      // On ne sélectionne que si on n'est PAS en mode connexion
      if (!useGraphStore.getState().isConnectMode) {
        selectElement('node', evt.target.id());
      }
    });

    cy.on('tap', 'edge', (evt) => {
      if (!useGraphStore.getState().isConnectMode) {
        selectElement('edge', evt.target.id());
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        clearSelection();
      }
    });

    cy.on('dragfree', 'node', (evt) => {
      const node = evt.target;
      const pos = node.position();
      updateNodePosition(node.id(), pos.x, pos.y);
    });
  };

  // Initialisation d'edgehandles une seule fois
  useEffect(() => {
    if (!cyRef.current || edgehandlesRef.current) return;

    const cy = cyRef.current;

    // Configuration edgehandles
    const eh = (cy as any).edgehandles({
      canConnect: function (sourceNode: any, targetNode: any) {
        // On peut connecter si ce n'est pas le même nœud
        return !sourceNode.same(targetNode);
      },
      edgeParams: function () {
        return {};
      },
      hoverDelay: 150,
      snap: true,
      snapThreshold: 50,
      snapFrequency: 15,
      noEdgeEventsInDraw: false,
      disableBrowserGestures: true,
      // Taille du handle
      handleSize: 10,
      handleColor: '#000',
      handleLineType: 'ghost',
      handleLineWidth: 1,
    });

    edgehandlesRef.current = eh;

    // --- CORRECTION ---
    // Le bloc `cy.on('ehshow ehstart ehmove', ...)` qui forçait le style
    // a été supprimé ici car il causait le bug d'écrasement des nœuds.
    // Le stylesheet gère déjà les dimensions correctes pour .eh-target et .eh-hover.
    // ------------------

    // Event: Arête créée (une seule fois)
    cy.on('ehcomplete', (_event: any, sourceNode: any, targetNode: any, addedEdge: any) => {
      // PROTECTION: Empêche les déclenchements multiples
      if (isProcessingEdgeRef.current) {
        console.log('⏭️ Événement ignoré (déjà en cours de traitement)');
        if (addedEdge) addedEdge.remove();
        return;
      }

      isProcessingEdgeRef.current = true;
      console.log('🎯 Arête créée:', sourceNode.id(), '→', targetNode.id());

      // Retire l'arête temporaire
      if (addedEdge) {
        addedEdge.remove();
      }

      // Nettoie TOUS les éléments temporaires créés par edgehandles
      cy.elements('.eh-preview, .eh-ghost-edge, .eh-preview-active').remove();
      cy.nodes().removeClass('eh-source eh-target eh-hover eh-preview');
      cy.edges().removeClass('eh-preview eh-ghost-edge');

      // Désactive temporairement le mode dessin pendant le dialog
      if (edgehandlesRef.current) {
        if (typeof edgehandlesRef.current.disableDrawMode === 'function') {
          edgehandlesRef.current.disableDrawMode();
        }
      }

      // Vérifie que les nœuds existent encore
      const sourceExists = cy.getElementById(sourceNode.id()).length > 0;
      const targetExists = cy.getElementById(targetNode.id()).length > 0;

      if (!sourceExists || !targetExists) {
        console.error('❌ Nœud source ou cible introuvable');
        isProcessingEdgeRef.current = false;
        return;
      }

      const sourceLabel = getNodeLabel(sourceNode.id()) || sourceNode.id();
      const targetLabel = getNodeLabel(targetNode.id()) || targetNode.id();

      setPendingEdge({
        sourceId: sourceNode.id(),
        targetId: targetNode.id(),
        sourceLabel,
        targetLabel,
      });

      // Réinitialise le flag après un court délai
      setTimeout(() => {
        isProcessingEdgeRef.current = false;
      }, 500);
    });
  }, []);

  // --- LOGIQUE CRITIQUE: Mode Connexion vs Mode Déplacement ---
  useEffect(() => {
    console.log('🔄 Mode connexion changé:', isConnectMode);

    if (cyRef.current && edgehandlesRef.current) {
      const cy = cyRef.current;
      const eh = edgehandlesRef.current;

      // Nettoyage des classes CSS
      cy.nodes().removeClass('eh-source eh-target eh-hover eh-preview');
      cy.edges().removeClass('eh-preview eh-ghost-edge');

      if (isConnectMode) {
        console.log('✅ Activation du mode dessin');
        // Active le mode dessin d'arêtes
        if (typeof eh.enableDrawMode === 'function') {
          eh.enableDrawMode();
        } else if (typeof eh.enable === 'function') {
          eh.enable();
        }
        console.log('✅ Mode dessin activé');
      } else {
        console.log('❌ Désactivation du mode dessin');
        // Désactive le mode dessin
        if (typeof eh.disableDrawMode === 'function') {
          eh.disableDrawMode();
        } else if (typeof eh.disable === 'function') {
          eh.disable();
        }
        // Force l'arrêt de tout dessin en cours
        if (typeof eh.stop === 'function') {
          eh.stop();
        }
        console.log('❌ Mode dessin désactivé');
      }
    }
  }, [isConnectMode]); // Se déclenche à chaque changement du toggle

  // Visualisation Algo
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    
    // Mapping sécurisé
    const currentStates = new Map<string, string>();
    if (currentStepIndex >= 0 && algorithmSteps) {
      for (let i = 0; i <= currentStepIndex && i < algorithmSteps.length; i++) {
        const step = algorithmSteps[i];
        if (step && step.id) {
          currentStates.set(step.id, step.state as string);
        }
      }
    }

    cy.batch(() => {
      cy.nodes().removeData('state');
      cy.edges().removeData('state');
      currentStates.forEach((state, id) => {
        const el = cy.getElementById(id);
        if (el.length) el.data('state', state);
      });
    });
  }, [currentStepIndex, algorithmSteps]);

  const handleEdgeConfirm = (weight: number) => {
    if (pendingEdge && cyRef.current) {
      // Vérifie à nouveau que les nœuds existent
      const cy = cyRef.current;
      const sourceExists = cy.getElementById(pendingEdge.sourceId).length > 0;
      const targetExists = cy.getElementById(pendingEdge.targetId).length > 0;

      if (sourceExists && targetExists) {
        const edgeId = `edge-${Date.now()}`;
        addEdge({
          id: edgeId,
          source: pendingEdge.sourceId,
          target: pendingEdge.targetId,
          weight,
          label: weight.toString(),
        });
      } else {
        console.error('❌ Impossible de créer l\'arête: nœud introuvable');
      }
    }

    setPendingEdge(null);

    // Réactive edgehandles si on est toujours en mode connexion
    if (isConnectMode && edgehandlesRef.current) {
      setTimeout(() => {
        if (edgehandlesRef.current && typeof edgehandlesRef.current.enableDrawMode === 'function') {
          edgehandlesRef.current.enableDrawMode();
        }
      }, 100);
    }
  };

  const handleEdgeCancel = () => {
    setPendingEdge(null);

    // Réactive edgehandles si on est toujours en mode connexion
    if (isConnectMode && edgehandlesRef.current) {
      setTimeout(() => {
        if (edgehandlesRef.current && typeof edgehandlesRef.current.enableDrawMode === 'function') {
          edgehandlesRef.current.enableDrawMode();
        }
      }, 100);
    }
  };

  return (
    <>
      <div 
        className={`w-full h-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white ${isConnectMode ? 'cursor-crosshair' : 'cursor-default'}`}
      >
        <CytoscapeComponent
          elements={cytoscapeElements}
          stylesheet={stylesheet}
          style={{ width: '100%', height: '100%' }}
          cy={handleCyInit}
          layout={{ name: 'preset' }}
          minZoom={0.5}
          maxZoom={2}
        />
      </div>

      <EdgeWeightDialog
        isOpen={!!pendingEdge}
        onClose={handleEdgeCancel}
        onConfirm={handleEdgeConfirm}
        sourceLabel={pendingEdge?.sourceLabel || ''}
        targetLabel={pendingEdge?.targetLabel || ''}
      />
    </>
  );
}