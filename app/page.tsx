'use client';

import { useState } from 'react';
import { GraphCanvas } from '@/components/graph-canvas';
import { Toolbar } from '@/components/toolbar';
import { FeedbackPanel } from '@/components/feedback-panel';
import { AlgorithmPlayer } from '@/components/algorithm-player';
import { Instructions } from '@/components/instructions';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

export default function Home() {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 p-4 transition-all duration-300">
      <AlgorithmPlayer />

      <div className="max-w-[1800px] mx-auto space-y-4 h-full transition-all duration-300">
        {/* Header */}
        <div className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex justify-between bg-white items-center transition-all duration-300">
          <div className="transition-all flex gap-6">
            <Image src="/logo.png" alt='logo' height={75} width={75} className='hover:animate-spin hover:scale-125 transition-all'/>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight transition-all duration-200">
                Visualiseur de Théorie des Graphes
              </h1>
              <p className="mt-2 text-sm font-mono transition-all duration-200">
                Outil interactif de visualisation d&apos;algorithmes de graphes
              </p>
            </div>
          </div>

          <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
            <DialogTrigger asChild>
              <button
                className="hover:scale-110 transition-all duration-200 cursor-pointer"
                aria-label="Afficher les instructions"
              >
                <PlusCircle size={55} className="text-black transition-all duration-200" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[95vw]! border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white transition-all duration-300">
              <DialogHeader className="transition-all duration-300">
                <DialogTitle className="text-2xl font-black uppercase transition-all duration-200">
                  Guide d&apos;Utilisation
                </DialogTitle>
                <DialogDescription className="text-sm font-mono transition-all duration-200">
                  Comment utiliser le visualiseur de graphes
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 transition-all duration-300">
                <Instructions />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 transition-all duration-300">
          {/* Sidebar */}
          <div className="flex flex-col gap-4 h-[calc(100vh-180px)] min-h-[600px] transition-all duration-300">
            <FeedbackPanel />
            <Toolbar />
          </div>

          {/* Canvas */}
          <div className="h-[calc(100vh-180px)] min-h-[600px] transition-all duration-300">
            <GraphCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
