import stringify from 'json-stringify-safe'

/**
 * The error class thrown by any of the utility classes.
 */
export class CommercetoolsError extends Error {
  private readonly data?: any

  constructor(message: string, data?: any) {
    super(message)
    this.data = data

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, CommercetoolsError.prototype)
  }

  toJSON() {
    return {
      message: this.message,
      data: this.data
    }
  }

  toString() {
    return `${this.message}: ${stringify(this.data)}`
  }
}
