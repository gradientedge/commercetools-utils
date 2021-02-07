import { AxiosError } from 'axios'

export class CommercetoolsAuthError extends Error {
  // Axios related values
  private errorCode?: any

  // Commercetools response data
  private responseStatusCode?: number
  private responseStatusText?: string
  private responseData?: any

  constructor(e: Error | AxiosError | string) {
    if (typeof e === 'string') {
      super(e)
    } else {
      super(e.message)
      this.name = e.name
      this.stack = e.stack

      if (Object.prototype.hasOwnProperty.call(e, 'isAxiosError')) {
        const error = e as AxiosError
        this.errorCode = error.code
        this.responseData = error.response?.data
        this.responseStatusCode = error.response?.status
        this.responseStatusText = error.response?.statusText
      }
    }
  }
}
