import { CommercetoolsRequestResponse, CommercetoolsRequestResponseStats } from '../../types.js'
import { AxiosResponse } from 'axios'
import { extractAxiosHeaders } from './extract-headers.js'

export function convertAxiosResponse(
  response: AxiosResponse,
  stats: CommercetoolsRequestResponseStats,
): CommercetoolsRequestResponse {
  return {
    request: {
      url: response.config?.url ?? '',
      method: response.config?.method as string,
      params: response.config?.params,
      headers: extractAxiosHeaders(response.config?.headers),
      data: response.config?.data,
    },
    response: {
      status: response.status,
      headers: extractAxiosHeaders(response.headers),
      data: response.data,
    },
    stats,
  }
}
