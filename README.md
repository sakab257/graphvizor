# 🎯 Visualiseur de Théorie des Graphes

Une application interactive de visualisation d'algorithmes de graphes construite avec Next.js et Cytoscape.js, utilisant un design neobrutalist audacieux.

## 📋 Description

Cette application permet de créer des graphes orientés pondérés de manière interactive et de visualiser pas-à-pas l'exécution d'algorithmes classiques de théorie des graphes. L'interface utilise un style neobrutalist avec des bordures épaisses, des ombres dures et des couleurs vives pour une expérience utilisateur unique.

## ✨ Fonctionnalités

### Construction de Graphes
- **Ajout de nœuds** : Création de nœuds avec nommage automatique (A, B, C...)
- **Création d'arêtes** : Système drag-and-drop intuitif pour connecter les nœuds
- **Poids personnalisés** : Dialog modal pour définir le poids de chaque arête
- **Manipulation visuelle** : Déplacement des nœuds par glisser-déposer
- **Suppression** : Retrait de nœuds ou d'arêtes sélectionnés

### Algorithmes Implémentés
- **BFS** (Breadth-First Search) - Parcours en largeur
- **DFS** (Depth-First Search) - Parcours en profondeur
- **Dijkstra** - Plus court chemin pondéré
- **A*** - Recherche heuristique optimale

### Visualisation
- **Lecture pas-à-pas** : Navigation dans l'exécution de l'algorithme
- **Contrôle de vitesse** : Ajustement du délai entre les étapes (100-2000ms)
- **États visuels** : Couleurs différentes pour visiting, visited, path, etc.
- **Feedback temps réel** : Messages descriptifs pour chaque étape

## 🛠️ Stack Technique

- **Framework** : Next.js 16.0.7 (App Router)
- **Langage** : TypeScript
- **Visualisation** : Cytoscape.js + react-cytoscapejs
- **Interaction** : cytoscape-edgehandles (drag-and-drop d'arêtes)
- **State Management** : Zustand
- **UI Components** : shadcn/ui (Radix UI)
- **Styling** : Tailwind CSS (Neobrutalism)

## 📁 Architecture du Code

```
/app
  page.tsx              # Page principale avec layout
  globals.css           # Styles globaux

/components
  graph-canvas.tsx      # Canvas Cytoscape avec gestion des interactions
  toolbar.tsx           # Contrôles du graphe et algorithmes
  feedback-panel.tsx    # Panneau d'affichage des messages
  algorithm-player.tsx  # Gestion de la lecture automatique
  edge-weight-dialog.tsx # Dialog pour saisir le poids d'une arête
  /ui                   # Composants shadcn/ui

/lib
  types.ts              # Types TypeScript (GraphNode, GraphEdge, AlgorithmStep)
  store.ts              # Store Zustand avec état global
  algorithms.ts         # Implémentations BFS, DFS, Dijkstra, A*
```

### Principes Architecturaux

1. **Séparation des responsabilités**
   - Logique d'algorithmes isolée dans `/lib/algorithms.ts`
   - État global géré par Zustand
   - Components React purement visuels

2. **Pattern Step-by-Step**
   - Les algorithmes génèrent un tableau d'`AlgorithmStep[]`
   - Chaque step contient : type, id, state, message
   - La lecture parcourt séquentiellement les steps

3. **Configuration Cytoscape**
   - `curve-style: 'bezier'` pour supporter les multi-arêtes
   - Stylesheet CSS-like pour les styles visuels
   - Event handlers pour tap, drag, edgehandles

4. **Gestion des Arêtes**
   - Edgehandles pour le drag-and-drop natif
   - Protection contre les événements multiples (flag `isProcessingEdgeRef`)
   - Dialog modal pour la saisie du poids

## 🚀 Installation et Utilisation

```bash
# Installation des dépendances
pnpm install

# Lancement en développement
pnpm dev

# Build de production
pnpm build
pnpm start
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

### Guide Rapide

1. **Créer un graphe**
   - Cliquer sur "Ajouter Nœud" pour créer des nœuds
   - Activer "Connecter", puis glisser d'un nœud à un autre
   - Entrer le poids de l'arête dans le dialog

2. **Exécuter un algorithme**
   - Sélectionner un nœud, cliquer "Définir Début"
   - (Optionnel) Définir un nœud de fin
   - Choisir un algorithme dans la liste
   - Cliquer "Exécuter l'Algorithme"

3. **Visualiser**
   - Cliquer "Lecture" pour déroulement automatique
   - Ajuster le curseur de vitesse
   - Observer les changements de couleur et messages

## 🔮 Évolutions Futures

### Court Terme
- **Import/Export** : Sauvegarde et chargement de graphes (JSON)
- **Graphes non-orientés** : Support des arêtes bidirectionnelles
- **Zoom/Pan** : Amélioration de la navigation dans les grands graphes
- **Historique** : Undo/Redo pour les modifications

### Moyen Terme
- **Nouveaux Algorithmes**
  - Bellman-Ford (arêtes négatives)
  - Floyd-Warshall (tous les plus courts chemins)
  - Kruskal/Prim (arbres couvrants minimaux)
  - Détection de cycles
- **Graphes Pondérés** : Visualisation des poids sur les nœuds
- **Mode Comparaison** : Exécution parallèle de plusieurs algorithmes

### Long Terme
- **Éditeur de Graphes Avancé**
  - Templates de graphes classiques (complet, biparti, arbre...)
  - Génération aléatoire paramétrable
  - Grille d'alignement pour positionnement précis
- **Analyse de Graphes**
  - Calcul de métriques (degré, centralité, clustering...)
  - Détection de composantes connexes
  - Visualisation de la matrice d'adjacence
- **Export Visuel**
  - Capture d'écran/GIF animé de l'exécution
  - Export en image vectorielle (SVG)
- **Mode Pédagogique**
  - Explications détaillées pour chaque étape
  - Quizz interactifs sur les algorithmes
  - Comparaison de complexités temporelles

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ et Claude Code**
