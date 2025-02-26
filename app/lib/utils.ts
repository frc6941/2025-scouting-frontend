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
}

export function calculateScore(phase: Phase | null | undefined): number {
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
      score += (phase.coralCount[level as keyof CoralCount] || 0) * points;
    });
  }

  // Calculate algae points
  if (phase.algaeCount) {
    score += (phase.algaeCount.netShot || 0) * 3;
    score += (phase.algaeCount.processor || 0) * 2;
  }

  return score;
} 