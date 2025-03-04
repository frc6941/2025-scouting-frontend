interface CoralCount {
  l4: number;
  l3: number;
  l2: number;
  l1: number;
  dropOrMiss: number;
}

interface AlgaeCount {
  netShot: number;
  processor: number;
  dropOrMiss: number;
}

interface Phase {
  coralCount: CoralCount;
  algaeCount: AlgaeCount;
  leftStartingZone?: boolean;
}

export function calculateScore(phase: Phase | null | undefined, isAuto: boolean = false): number {
  if (!phase) return 0;
  
  // Coral points
  const coralPoints = isAuto ? 
    { l1: 3, l2: 4, l3: 6, l4: 7 } : 
    { l1: 2, l2: 3, l3: 4, l4: 5 };
  
  const coralScore = 
    (phase.coralCount.l1 || 0) * coralPoints.l1 +
    (phase.coralCount.l2 || 0) * coralPoints.l2 +
    (phase.coralCount.l3 || 0) * coralPoints.l3 +
    (phase.coralCount.l4 || 0) * coralPoints.l4;

  // Algae points are same for both auto and teleop
  const algaeScore = 
    (phase.algaeCount.netShot || 0) * 4 +
    (phase.algaeCount.processor || 0) * 6;
    
  // Add 2 points for leaving starting zone in auto phase
  const leftStartingZonePoints = isAuto && phase.leftStartingZone ? 3 : 0;

  return coralScore + algaeScore + leftStartingZonePoints;
}

export function calculateEndGameScore(status: string): number {
  switch (status) {
    case 'Deep Climb':
      return 12;
    case 'Shallow Climb':
      return 6;
    case 'Park':
      return 2;
    case 'Failed':
      return 2;
    case 'Played Defense':
      return 0;
    default:
      return 0;
  }
} 


import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}