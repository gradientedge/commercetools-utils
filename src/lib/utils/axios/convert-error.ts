import { CommercetoolsRequestResponse, CommercetoolsRequestResponseStats } from '../../types.js'
import { extractHeaders } from './extract-headers.js'

export function convertFetchError(
  error: Error,
  stats: CommercetoolsRequestResponseStats,
): CommercetoolsRequestResponse | null {
  return {
    request: {
      url: error.config?.url ?? '',
      method: error.config?.method as string,
      params: error.config?.params,
      headers: extractHeaders(error.config?.headers),
      data: error.config?.data,
    },
    response: {
      code: error.code,
      message: !error.response?.status ? error.message : undefined,
      status: error.response?.status,
      headers: extractHeaders(error.response?.headers),
      data: error.response?.data,
    },
    stats,
  }
}
