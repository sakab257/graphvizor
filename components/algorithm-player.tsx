'use client';

import { useEffect } from 'react';
import { useGraphStore } from '@/lib/store';

export function AlgorithmPlayer() {
  const { isPlaying, playbackSpeed, nextStep } = useGraphStore();

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextStep();
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, nextStep]);

  return null;
}
