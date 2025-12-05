'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EdgeWeightDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
  sourceLabel: string;
  targetLabel: string;
}

export function EdgeWeightDialog({
  isOpen,
  onClose,
  onConfirm,
  sourceLabel,
  targetLabel,
}: EdgeWeightDialogProps) {
  const [weight, setWeight] = useState('1');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const weightValue = parseInt(weight, 10);
    if (!isNaN(weightValue) && weightValue > 0) {
      onConfirm(weightValue);
      setWeight('1');
    }
  };

  const handleCancel = () => {
    onClose();
    setWeight('1');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-2xl font-black mb-4 uppercase">
            Créer une Arête
          </h2>

          <div className="space-y-4">
            <div className="p-3 bg-yellow-200 border-2 border-black">
              <p className="font-mono text-sm">
                De <span className="font-bold">{sourceLabel}</span> vers{' '}
                <span className="font-bold">{targetLabel}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="font-bold">
                Poids de l&apos;arête
              </Label>
              <Input
                id="weight"
                type="number"
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-2 border-black rounded-none focus:ring-0 focus:ring-offset-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirm();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConfirm}
                className="flex-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-green-400 hover:bg-green-500 font-bold"
              >
                Créer
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-rose-400 hover:bg-rose-500 font-bold"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
