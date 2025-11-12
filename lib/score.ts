type BucketBounds = { L: number; U: number }

export interface ScoreResult {
  id: string
  rankIndex: number
  score10: number
}

/**
 * Computes scores for a list of dishes in order
 * @param idsInOrder - Array of dish IDs in their ranked order (0 = best/top)
 * @param bounds - The numeric bounds for the bucket (L = lower, U = upper)
 * @returns Array of score results with rankIndex and computed score10
 */
export function computeScoresForOrder(
  idsInOrder: string[],
  bounds: BucketBounds
): ScoreResult[] {
  const N = idsInOrder.length
  const { L, U } = bounds

  // Special case: single dish in bucket gets midpoint
  if (N === 1) {
    return [
      {
        id: idsInOrder[0],
        rankIndex: 0,
        score10: Number(((L + U) / 2).toFixed(2)),
      },
    ]
  }

  // General case: linear mapping
  // rankIndex 0 (top) maps to U (upper bound)
  // rankIndex N-1 (bottom) maps to L (lower bound)
  return idsInOrder.map((id, idx) => {
    const rankIndex = idx
    const score10 = L + ((U - L) * ((N - 1 - rankIndex) / (N - 1)))
    return {
      id,
      rankIndex,
      score10: Number(score10.toFixed(2)),
    }
  })
}

/**
 * Preview score calculation for client-side display
 */
export function previewScore(
  position: number,
  totalItems: number,
  bounds: BucketBounds
): number {
  const { L, U } = bounds
  if (totalItems === 1) return Number(((L + U) / 2).toFixed(2))
  const score = L + ((U - L) * ((totalItems - 1 - position) / (totalItems - 1)))
  return Number(score.toFixed(2))
}

