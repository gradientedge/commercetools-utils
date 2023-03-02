import { CommercetoolsRequestResponse, CommercetoolsRequestResponseStats } from '../../types'
import { AxiosError } from 'axios'
import { extractAxiosHeaders } from './extract-headers'

export function convertAxiosError(
  error: AxiosError | Error,
  stats: CommercetoolsRequestResponseStats,
): CommercetoolsRequestResponse | null {
  if (!('isAxiosError' in error)) {
    return null
  }
  return {
    request: {
      url: error.config?.url ?? '',
      method: error.config?.method as string,
      params: error.config?.params,
      headers: extractAxiosHeaders(error.config?.headers),
      data: error.config?.data,
    },
    response: {
      code: error.code,
      message: !error.response?.status ? error.message : undefined,
      status: error.response?.status,
      headers: extractAxiosHeaders(error.response?.headers),
      data: error.response?.data,
    },
    stats,
  }
}
