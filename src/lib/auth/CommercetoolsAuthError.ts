import stringify from 'json-stringify-safe'

export class CommercetoolsAuthError extends Error {
  private readonly data?: any

  constructor(message: string, data?: any) {
    const trueProto = new.target.prototype
    super(message)
    Object.setPrototypeOf(this, trueProto)
    this.data = data
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
