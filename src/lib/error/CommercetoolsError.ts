/**
 * The error class thrown by any of the utility classes.
 */
export class CommercetoolsError extends Error {
  /**
   * The data passed in to the error class. This could be anything,
   * but is most likely to be the response from a commercetools request.
   */
  public readonly data?: any

  /**
   * If available, this is the status code of the request received
   * back from commercetools: https://docs.commercetools.com/api/errors
   */
  public readonly status: number | undefined

  /**
   * Convenience mechanism for identifying that the error that's
   * just been caught is a CommercetoolsError.
   */
  public readonly isCommercetoolsError = true

  constructor(message: string, data?: any, status?: number) {
    super(message)
    this.data = data
    this.status = status

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, CommercetoolsError.prototype)
  }

  toJSON(): Record<string, any> {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      isCommercetoolsError: true,
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}
