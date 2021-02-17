export class CommercetoolsAuthError extends Error {
  private readonly data?: any

  constructor(message: string, data?: any) {
    super(message)
    this.data = data
  }

  toJSON() {
    return JSON.stringify({
      message: this.message,
      data: this.data
    })
  }

  toString() {
    return `${this.message}: ${this.toJSON()}`
  }
}
