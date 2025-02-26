import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScore(phase: { coralCount: any; algaeCount: any }) {
  if (!phase) return 0;
  
  const coralPoints = {
    l4: 5,
    l3: 4,
    l2: 3,
    l1: 2
  };

  let score = 0;

  // Calculate coral points
  if (phase.coralCount) {
    Object.entries(coralPoints).forEach(([level, points]) => {
      score += (phase.coralCount[level] || 0) * points;
    });
  }

  // Calculate algae points
  if (phase.algaeCount) {
    score += (phase.algaeCount.netShot || 0) * 3;
    score += (phase.algaeCount.processor || 0) * 2;
  }

  return score;
}