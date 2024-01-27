import { CommercetoolsRetryConfig } from '../api/index.js'
import { CommercetoolsHooks, CommercetoolsRequest, RequestExecutor } from '../types.js'
import { request } from './index.js'
import { buildUserAgent } from '../utils/index.js'
import { DEFAULT_RETRY_CONFIG } from '../constants.js'

export interface GetRequestExecutorProps extends CommercetoolsHooks {
  timeoutMs?: number
  retry?: Partial<CommercetoolsRetryConfig>
  systemIdentifier?: string
}

export function getRequestExecutor(props: GetRequestExecutorProps): RequestExecutor {
  const instanceHeaders = { 'User-Agent': buildUserAgent(props.systemIdentifier) }

  return (requestConfig: CommercetoolsRequest) => {
    const headers = { ...instanceHeaders, ...requestConfig.headers }
    return request({
      onBeforeRequest: props.onBeforeRequest,
      onAfterResponse: props.onAfterResponse,
      request: { ...requestConfig, headers },
      retry: { ...DEFAULT_RETRY_CONFIG, ...props.retry },
      timeoutMs: props.timeoutMs,
    })
  }
}
