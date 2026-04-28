import nock from 'nock'
import { afterAll, beforeAll, expect } from 'vitest'

/**
 * Ensure no real network calls are made during tests.
 *
 * Wired up in `vitest.config.ts` via `setupFiles`, so it runs at the
 * start of every test file.
 */
beforeAll(() => {
  nock.disableNetConnect()
})

afterAll(() => {
  nock.cleanAll()
})

/**
 * Custom matcher equivalent to the `jest-matcher-specific-error` package's
 * `toMatchError` matcher: asserts that the actual error is an instance of
 * the same constructor as the expected error, with the same `message`, and
 * deeply-equal own enumerable properties.
 */
expect.extend({
  toMatchError(received: unknown, expected: Error): { pass: boolean; message: () => string } {
    const actualName =
      received && typeof received === 'object' && received.constructor ? received.constructor.name : typeof received

    if (!(received instanceof Error)) {
      return {
        pass: false,
        message: (): string => `Expected value to be an Error instance, but received ${actualName}`,
      }
    }

    if (received.constructor !== expected.constructor) {
      return {
        pass: false,
        message: (): string =>
          `Expected error to be of type ${expected.constructor.name}, but received ${received.constructor.name}`,
      }
    }

    if (received.message !== expected.message) {
      return {
        pass: false,
        message: (): string =>
          `Expected error message:\n  ${this.utils.printExpected(expected.message)}\nReceived:\n  ${this.utils.printReceived(received.message)}`,
      }
    }

    // Compare own enumerable properties (e.g. `data`, `status` on CommercetoolsError)
    const ownProps = (err: Error): Record<string, unknown> => {
      const out: Record<string, unknown> = {}
      for (const key of Object.keys(err) as Array<keyof typeof err>) {
        out[key as string] = err[key]
      }
      return out
    }

    const receivedProps = ownProps(received)
    const expectedProps = ownProps(expected)

    if (!this.equals(receivedProps, expectedProps)) {
      return {
        pass: false,
        message: (): string =>
          `Expected error own properties to equal:\n  ${this.utils.printExpected(expectedProps)}\nReceived:\n  ${this.utils.printReceived(receivedProps)}`,
      }
    }

    return {
      pass: true,
      message: (): string => `Expected errors not to match, but they did`,
    }
  },
})
