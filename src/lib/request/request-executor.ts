import https from 'https'
import { CommercetoolsRetryConfig } from '../api'
import { CommercetoolsHooks, CommercetoolsRequest, RequestExecutor } from '../types'
import { request } from './index'
import { buildUserAgent, createAxiosInstance } from '../utils'
import { DEFAULT_RETRY_CONFIG } from '../constants'

export interface GetRequestExecutorProps extends CommercetoolsHooks {
  httpsAgent?: https.Agent
  timeoutMs?: number
  retry?: Partial<CommercetoolsRetryConfig>
  systemIdentifier?: string
}

export function getRequestExecutor(props: GetRequestExecutorProps): RequestExecutor {
  const axiosInstance = createAxiosInstance({ httpsAgent: props.httpsAgent })
  const instanceHeaders = { 'User-Agent': buildUserAgent(props.systemIdentifier) }

  return (requestConfig: CommercetoolsRequest) => {
    const headers = { ...instanceHeaders, ...requestConfig.headers }
    return request({
      axiosInstance,
      onBeforeRequest: props.onBeforeRequest,
      onAfterResponse: props.onAfterResponse,
      request: { ...requestConfig, headers },
      retry: { ...DEFAULT_RETRY_CONFIG, ...props.retry },
      timeoutMs: props.timeoutMs,
    })
  }
}
