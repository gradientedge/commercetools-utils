import { calculateDelay } from '../../lib//utils/calculate-delay.js'

describe('calculateDelay', () => {
  it('should return zero if the retry configuration is missing', () => {
    const result = calculateDelay(1, undefined)

    expect(result).toBe(0)
  })

  it('should return zero if the retry count is zero', () => {
    const result = calculateDelay(0, {
      delayMs: 50,
    })

    expect(result).toBe(0)
  })

  describe('jitter disabled', () => {
    describe('delayMs of 50', () => {
      it('should delay by the value defined by the `delayMs` property on the first retry', () => {
        const result = calculateDelay(1, {
          delayMs: 50,
        })

        expect(result).toBe(50)
      })

      it('should delay by 100 on the second retry', () => {
        const result = calculateDelay(2, {
          delayMs: 50,
        })

        expect(result).toBe(100)
      })

      it('should delay by 200 on the third retry', () => {
        const result = calculateDelay(3, {
          delayMs: 50,
        })

        expect(result).toBe(200)
      })

      it('should delay by 500 on the fourth retry', () => {
        const result = calculateDelay(4, {
          delayMs: 50,
        })

        expect(result).toBe(400)
      })
    })
  })

  describe('jitter enabled', () => {
    // Note that these tests expect that when `calculateDelay` is
    // called `MAX_ITERATIONS` times, it won't return a list of the
    // exact same numbers. Theoretically, however, that scenario is
    // possible but the chances of this are astronomically small,
    // and so the following expectation should never fail:
    // `expect(uniqueCount).not.toBe(results.length)`

    const MAX_ITERATIONS = 500

    describe('delayMs of 50', () => {
      it('should delay by >=0ms and <=74ms on the first retry', () => {
        const results: number[] = []

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const result = calculateDelay(1, {
            delayMs: 50,
            jitter: true,
          })
          results.push(result)

          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(74)
        }

        const uniqueCount = Array.from(new Set(results)).length

        expect(uniqueCount).not.toBe(results.length)
      })

      it('should delay by >=0ms and <=133ms on the second retry', () => {
        const results: number[] = []

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const result = calculateDelay(2, {
            delayMs: 50,
            jitter: true,
          })
          results.push(result)

          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(133)
        }

        const uniqueCount = Array.from(new Set(results)).length
        expect(uniqueCount).not.toBe(results.length)
      })

      it('should delay by >=0ms and <=249ms on the third retry', () => {
        const results: number[] = []

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const result = calculateDelay(3, {
            delayMs: 50,
            jitter: true,
          })
          results.push(result)

          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(249)
        }

        const uniqueCount = Array.from(new Set(results)).length
        expect(uniqueCount).not.toBe(results.length)
      })

      it('should delay by >=0ms and <=959ms on the fourth retry', () => {
        const results: number[] = []

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const result = calculateDelay(4, {
            delayMs: 50,
            jitter: true,
          })
          results.push(result)

          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(959)
        }

        const uniqueCount = Array.from(new Set(results)).length
        expect(uniqueCount).not.toBe(results.length)
      })
    })
  })
})
