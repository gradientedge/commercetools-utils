import { AxiosError } from 'axios'

export class CommercetoolsAuthError extends Error {
  constructor(e: Error | AxiosError) {
    super(e.toString())
  }
}
