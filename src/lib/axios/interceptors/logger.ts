import { AxiosError, AxiosInstance } from 'axios'
import { Logger } from '../../types'

export function applyLoggerInterceptor(instance: AxiosInstance, logFn: Logger) {
  instance.interceptors.response.use(
    (response) => {
      logFn({
        request: {
          url: response.config?.url ?? '',
          method: response.config?.method as string,
          params: response.config?.params,
          headers: response.request?.headers,
          data: response.config?.data,
        },
        response: {
          status: response.status,
          headers: response.headers,
          data: response.data,
        },
      })
      return response
    },
    (error: AxiosError) => {
      logFn({
        request: {
          url: error.config?.url ?? '',
          method: error.config?.method as string,
          params: error.config?.params,
          headers: error.request?.headers,
          data: error.config?.data,
        },
        response: {
          code: error.code,
          message: !error.response?.status ? error.message : undefined,
          status: error.response?.status,
          headers: error.response?.headers,
          data: error.response?.data,
        },
      })
      return Promise.reject(error)
    },
  )
}
