'use client';

import { useGraphStore } from '@/lib/store';

export function FeedbackPanel() {
  const { feedbackMessage, currentStepIndex, algorithmSteps } = useGraphStore();

  const currentStep = currentStepIndex >= 0 ? algorithmSteps[currentStepIndex] : null;

  return (
    <div className="p-6 bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <div className="space-y-2 transition-all duration-300">
        <h3 className="text-sm font-bold uppercase tracking-wide text-black">Statut</h3>
        <p className="text-sm font-mono font-bold text-black transition-all duration-300">{feedbackMessage}</p>
        {currentStep?.distance !== undefined && (
          <p className="text-xs font-mono font-bold text-black transition-all duration-300">
            Distance: {currentStep.distance}
          </p>
        )}
      </div>
    </div>
  );
}
