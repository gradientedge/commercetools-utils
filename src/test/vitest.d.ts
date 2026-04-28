import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Asserts that the actual error is an instance of the same constructor
     * as the expected error, with the same `message`, and deeply-equal own
     * enumerable properties (e.g. `data`, `status` on `CommercetoolsError`).
     */
    toMatchError(expected: Error): T
  }
  interface AsymmetricMatchersContaining {
    toMatchError(expected: Error): unknown
  }
}
