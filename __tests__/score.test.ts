import { computeScoresForOrder, previewScore } from '../lib/score'

describe('Score Computation', () => {
  describe('computeScoresForOrder', () => {
    it('should compute midpoint score for single dish', () => {
      const ids = ['dish1']
      const bounds = { L: 0, U: 3.49 }
      const results = computeScoresForOrder(ids, bounds)

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('dish1')
      expect(results[0].rankIndex).toBe(0)
      expect(results[0].score10).toBeCloseTo(1.75, 2)
    })

    it('should map top dish to upper bound and bottom to lower bound', () => {
      const ids = ['dish1', 'dish2', 'dish3']
      const bounds = { L: 7, U: 10 }
      const results = computeScoresForOrder(ids, bounds)

      expect(results).toHaveLength(3)
      
      // First dish (rank 0) should be close to upper bound (10)
      expect(results[0].rankIndex).toBe(0)
      expect(results[0].score10).toBeCloseTo(10, 2)

      // Middle dish
      expect(results[1].rankIndex).toBe(1)
      expect(results[1].score10).toBeCloseTo(8.5, 2)

      // Last dish (rank 2) should be close to lower bound (7)
      expect(results[2].rankIndex).toBe(2)
      expect(results[2].score10).toBeCloseTo(7, 2)
    })

    it('should handle AVERAGE bucket range correctly', () => {
      const ids = ['dish1', 'dish2', 'dish3', 'dish4']
      const bounds = { L: 3.5, U: 6.99 }
      const results = computeScoresForOrder(ids, bounds)

      expect(results).toHaveLength(4)
      
      // First should be near top
      expect(results[0].score10).toBeCloseTo(6.99, 2)
      
      // Last should be near bottom
      expect(results[3].score10).toBeCloseTo(3.5, 2)
      
      // All scores should be within bounds
      results.forEach(r => {
        expect(r.score10).toBeGreaterThanOrEqual(bounds.L)
        expect(r.score10).toBeLessThanOrEqual(bounds.U)
      })
    })

    it('should distribute scores evenly across many dishes', () => {
      const ids = Array.from({ length: 10 }, (_, i) => `dish${i}`)
      const bounds = { L: 0, U: 10 }
      const results = computeScoresForOrder(ids, bounds)

      expect(results).toHaveLength(10)
      
      // Check that scores are monotonically decreasing
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score10).toBeLessThan(results[i - 1].score10)
      }

      // First and last should be at bounds
      expect(results[0].score10).toBeCloseTo(10, 2)
      expect(results[9].score10).toBeCloseTo(0, 2)
    })

    it('should assign correct rankIndex values', () => {
      const ids = ['a', 'b', 'c', 'd', 'e']
      const bounds = { L: 0, U: 10 }
      const results = computeScoresForOrder(ids, bounds)

      results.forEach((result, index) => {
        expect(result.rankIndex).toBe(index)
        expect(result.id).toBe(ids[index])
      })
    })

    it('should round scores to 2 decimal places', () => {
      const ids = ['dish1', 'dish2', 'dish3']
      const bounds = { L: 3.5, U: 6.99 }
      const results = computeScoresForOrder(ids, bounds)

      results.forEach(result => {
        const decimalPlaces = (result.score10.toString().split('.')[1] || '').length
        expect(decimalPlaces).toBeLessThanOrEqual(2)
      })
    })
  })

  describe('previewScore', () => {
    it('should match computeScoresForOrder for single item', () => {
      const bounds = { L: 0, U: 3.49 }
      const preview = previewScore(0, 1, bounds)
      const computed = computeScoresForOrder(['dish1'], bounds)[0].score10

      expect(preview).toBeCloseTo(computed, 2)
    })

    it('should match computeScoresForOrder for multiple items', () => {
      const bounds = { L: 7, U: 10 }
      const totalItems = 5

      for (let position = 0; position < totalItems; position++) {
        const preview = previewScore(position, totalItems, bounds)
        const ids = Array.from({ length: totalItems }, (_, i) => `dish${i}`)
        const computed = computeScoresForOrder(ids, bounds)[position].score10

        expect(preview).toBeCloseTo(computed, 2)
      }
    })
  })
})

