import stringify from 'json-stringify-safe'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { extractAxiosHeaders, maskSensitiveHeaders, maskSensitiveInput } from '../utils/index.js'

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

  /**
   * Utility for converting an AxiosError in to a CommercetoolsError.
   */
  public static fromAxiosError(e: AxiosError): CommercetoolsError {
    return new CommercetoolsError(
      e.message,
      {
        code: e.code,
        request: {
          url: e.config?.url,
          method: e.config?.method,
          headers: maskSensitiveHeaders(extractAxiosHeaders(e.config?.headers)),
          params: maskSensitiveInput(e.config?.params),
          data: maskSensitiveInput(this.parseRequestData(e.config)),
        },
        response: {
          status: e.response?.status,
          data: maskSensitiveInput(e.response?.data),
          headers: extractAxiosHeaders(e.response?.headers),
        },
      },
      e.response?.status,
    )
  }

  /**
   * Parse the JSON string back in to an object for easier viewing
   */
  public static parseRequestData(config: InternalAxiosRequestConfig | undefined): any {
    if (!config) {
      return null
    }
    let data = config?.data
    if (typeof data === 'string' && data) {
      let contentType = ''
      if (typeof config?.headers?.['Content-Type'] === 'string') {
        contentType = config?.headers?.['Content-Type']
      }
      if (contentType.substring(0, 16) === 'application/json') {
        try {
          data = JSON.parse(config.data)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
      } else if (contentType.substring(0, 33) === 'application/x-www-form-urlencoded') {
        try {
          const searchParams = new URLSearchParams(config.data)
          const paramsObj: Record<string, string | string[]> = {}
          searchParams.forEach((value, key, searchParams) => {
            const values = searchParams.getAll(key)
            if (values.length === 0) {
              paramsObj[key] = ''
            } else if (values.length === 1) {
              paramsObj[key] = values[0]
            } else {
              paramsObj[key] = values
            }
          })
          data = paramsObj
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
      }
    }
    return data
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
    return stringify(this.toJSON())
  }

  static isInstance(error: unknown): error is CommercetoolsError {
    return error instanceof Object && 'isCommercetoolsError' in error && error.isCommercetoolsError === true
  }
}
