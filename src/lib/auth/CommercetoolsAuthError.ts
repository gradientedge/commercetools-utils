export class CommercetoolsAuthError extends Error {
  private data?: any

  constructor(message: string, data?: any) {
    super(message)
    this.data = data
  }
}
