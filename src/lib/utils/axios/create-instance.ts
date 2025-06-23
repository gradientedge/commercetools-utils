import { DEFAULT_HTTPS_AGENT_CONFIG } from '../../constants.js'
import axios, { AxiosInstance } from 'axios'
import https from 'https'

/**
 * Define the base axios instance that forms the foundation
 * of all axios calls made by the {@see request} method.
 */
export function createAxiosInstance(options: { httpsAgent?: https.Agent }): AxiosInstance {
  return axios.create({
    transitional: {
      clarifyTimeoutError: true,
    },
    httpsAgent:
      options?.httpsAgent ??
      new https.Agent({
        ...DEFAULT_HTTPS_AGENT_CONFIG,
        keepAliveMsecs: 1000,
      }),
  })
}
