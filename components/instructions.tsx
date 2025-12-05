'use client';

export function Instructions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <div className="bg-blue-200 border-2 border-black p-3">
          <h3 className="font-black text-sm uppercase mb-2">Construction du Graphe</h3>
        </div>
        <ul className="space-y-2 font-mono text-xs">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>&quot;Ajouter Nœud&quot;: Créer un nœud</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>&quot;Connecter&quot; ON: Glisser entre nœuds</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>&quot;Connecter&quot; OFF: Mode sélection</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Glisser les nœuds: Repositionner</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Sélectionner + Supprimer: Retirer</span>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <div className="bg-purple-200 border-2 border-black p-3">
          <h3 className="font-black text-sm uppercase mb-2">Configuration de l&apos;Algorithme</h3>
        </div>
        <ul className="space-y-2 font-mono text-xs">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Sélectionner un nœud, cliquer &quot;Définir Début&quot;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>(Optionnel) Définir le nœud de fin</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Choisir un algorithme dans la liste</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Cliquer &quot;Exécuter l&apos;Algorithme&quot;</span>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <div className="bg-green-200 border-2 border-black p-3">
          <h3 className="font-black text-sm uppercase mb-2">Visualisation</h3>
        </div>
        <ul className="space-y-2 font-mono text-xs">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Lecture: Déroulement automatique</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Ajuster le curseur de vitesse</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Réinitialiser: Effacer la visualisation</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Suivre le panneau de statut</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
