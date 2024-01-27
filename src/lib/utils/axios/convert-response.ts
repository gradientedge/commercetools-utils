import { CommercetoolsRequest, CommercetoolsRequestResponse, CommercetoolsRequestResponseStats } from '../../types.js'
import { extractHeaders } from './extract-headers.js'

export function convertResponse(
  requestConfig: CommercetoolsRequest,
  response: Response,
  responseData: unknown,
  stats: CommercetoolsRequestResponseStats,
): CommercetoolsRequestResponse {
  return {
    request: {
      url: requestConfig.url,
      method: requestConfig.method,
      params: requestConfig.params,
      headers: requestConfig.headers,
      data: requestConfig.data,
    },
    response: {
      status: response.status,
      headers: extractHeaders(response.headers),
      data: responseData,
    },
    stats,
  }
}
