'use client';

import { useGraphStore } from '@/lib/store';
import { runDFS, runBFS, runDijkstra, runAStar } from '@/lib/algorithms';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  Link,
  Flag,
  FlagOff,
  Circle,
} from 'lucide-react';

export function Toolbar() {
  const {
    nodes,
    edges,
    algorithm,
    isPlaying,
    playbackSpeed,
    currentStepIndex,
    algorithmSteps,
    startNode,
    endNode,
    isConnectMode,
    selectedElement,
    addNodeWithAutoName,
    getNodeLabel,
    setAlgorithm,
    play,
    pause,
    reset,
    clearGraph,
    setPlaybackSpeed,
    toggleConnectMode,
    deleteSelected,
    setStartNode,
    setEndNode,
    setAlgorithmSteps,
    setFeedbackMessage,
  } = useGraphStore();

  const startNodeLabel = startNode ? getNodeLabel(startNode) : null;
  const endNodeLabel = endNode ? getNodeLabel(endNode) : null;

  const handleRunAlgorithm = () => {
    if (!algorithm || !startNode) {
      setFeedbackMessage('Veuillez sélectionner un algorithme et un nœud de départ');
      return;
    }

    let steps;
    try {
      switch (algorithm) {
        case 'dfs':
          steps = runDFS({ nodes, edges }, startNode, endNode || undefined);
          break;
        case 'bfs':
          steps = runBFS({ nodes, edges }, startNode, endNode || undefined);
          break;
        case 'dijkstra':
          steps = runDijkstra({ nodes, edges }, startNode, endNode || undefined);
          break;
        case 'astar':
          if (!endNode) {
            setFeedbackMessage('A* nécessite un nœud de départ et d\'arrivée');
            return;
          }
          steps = runAStar({ nodes, edges }, startNode, endNode);
          break;
        default:
          return;
      }
      setAlgorithmSteps(steps);
    } catch (error) {
      setFeedbackMessage('Erreur lors de l\'exécution de l\'algorithme');
      console.error(error);
    }
  };

  const handleSetStartNode = () => {
    if (selectedElement?.type === 'node') {
      setStartNode(selectedElement.id);
    } else {
      setFeedbackMessage('Sélectionnez d\'abord un nœud');
    }
  };

  const handleSetEndNode = () => {
    if (selectedElement?.type === 'node') {
      setEndNode(selectedElement.id);
    } else {
      setFeedbackMessage('Sélectionnez d\'abord un nœud');
    }
  };

  const canPlay = algorithmSteps.length > 0 && currentStepIndex < algorithmSteps.length - 1;

  return (
    <div className="flex-1 flex flex-col gap-4 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-y-auto">
      <h2 className="text-xl font-bold">Contrôles du Graphe</h2>

      {/* Graph Manipulation */}
      <div className="space-y-2">
        <Label className="text-sm font-bold">Outils de Graphe</Label>
        <div className="flex flex-wrap gap-2 justify-between">
          <Button
            onClick={addNodeWithAutoName}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 bg-blue-400 hover:bg-blue-500"
          >
            <Circle className="h-4 w-4" />
            Ajouter Nœud
          </Button>
          <Button
            onClick={() => {
              toggleConnectMode();
            }}
            variant={'outline'}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200"
          >
            <Link className="h-4 w-4" />
            {isConnectMode ? 'Déconnecter' : 'Connecter'}
          </Button>
          <Button
            onClick={deleteSelected}
            disabled={!selectedElement}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 bg-rose-400 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
          <Button
            onClick={clearGraph}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 bg-yellow-300 hover:bg-yellow-400"
          >
            <Trash2 className="h-4 w-4" />
            Tout Effacer
          </Button>
        </div>
      </div>

      {/* Node Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-bold">Sélection des Nœuds</Label>
        <div className="flex flex-wrap gap-2 justify-between">
          <Button
            onClick={handleSetStartNode}
            disabled={!selectedElement || selectedElement.type !== 'node'}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 bg-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
          >
            <Flag className="h-4 w-4" />
            Définir Début {startNodeLabel && `(${startNodeLabel})`}
          </Button>
          <Button
            onClick={handleSetEndNode}
            disabled={!selectedElement || selectedElement.type !== 'node'}
            className="text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 bg-red-400 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
          >
            <FlagOff className="h-4 w-4" />
            Définir Fin {endNodeLabel && `(${endNodeLabel})`}
          </Button>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="space-y-2">
        <Label htmlFor="algorithm" className="text-sm font-bold ">
          Algorithme
        </Label>
        <Select
          value={algorithm || ''}
          onValueChange={(value) => setAlgorithm(value as any)}
        >
          <SelectTrigger
            id="algorithm"
            className="w-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none focus:ring-0 focus:ring-offset-0 transition-all duration-200"
          >
            <SelectValue placeholder="Sélectionnez un algorithme" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black rounded-none">
            <SelectItem value="bfs" className="font-bold ">
              BFS (Parcours en Largeur)
            </SelectItem>
            <SelectItem value="dfs" className="font-bold ">
              DFS (Parcours en Profondeur)
            </SelectItem>
            <SelectItem value="dijkstra" className="font-bold ">
              Dijkstra (Plus Court Chemin)
            </SelectItem>
            <SelectItem value="astar" className="font-bold">
              A* (A-Étoile)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Run Algorithm */}
      <Button
        onClick={handleRunAlgorithm}
        disabled={!algorithm || !startNode}
        className="w-full text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:shadow-none bg-purple-400 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-none!"
      >
        <Plus className="h-4 w-4" />
        Exécuter l&apos;Algorithme
      </Button>

      {/* Playback Controls */}
      {algorithmSteps.length > 0 && (
        <div className="space-y-3 pt-3 border-t-2 border-black">
          <Label className="text-sm font-bold">Contrôles de Lecture</Label>
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button
                onClick={play}
                disabled={!canPlay}
                className="flex-1 text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none bg-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
              >
                <Play className="h-4 w-4" />
                Lecture
              </Button>
            ) : (
              <Button
                onClick={pause}
                className="flex-1 text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none bg-orange-400 hover:bg-orange-500"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button
              onClick={reset}
              variant={'outline'}
              className="flex-1 text-black font-bold gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>

          {/* Speed Slider */}
          <div className="space-y-2 transition-all duration-300">
            <div className="flex justify-between transition-all duration-200">
              <Label htmlFor="speed" className="text-sm font-bold transition-all duration-200">
                Vitesse
              </Label>
              <span className="text-xs font-mono transition-all duration-200">{playbackSpeed}ms</span>
            </div>
            <Slider
              id="speed"
              min={100}
              max={2000}
              step={100}
              value={[playbackSpeed]}
              onValueChange={([value]) => setPlaybackSpeed(value)}
              className="**:[[role=slider]]:border-2 **:[[role=slider]]:border-black **:[[role=slider]]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            />
          </div>

          {/* Progress */}
          <div className="text-xs font-mono text-center transition-all duration-200">
            Étape {currentStepIndex + 1} / {algorithmSteps.length}
          </div>
        </div>
      )}
    </div>
  );
}
