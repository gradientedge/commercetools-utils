import { DEFAULT_HTTPS_AGENT_CONFIG } from '../../constants.js'
import axios, { AxiosInstance } from 'axios'
import https from 'https'

/**
 * Define the base axios instance that forms the foundation
 * of all axios calls made by the {@see request} method.
 */
export function createAxiosInstance(options: { httpsAgent?: https.Agent }): AxiosInstance {
  let agent
  try {
    if (process.env.GECTU_IS_BROWSER !== '1') {
      if (options.httpsAgent) {
        agent = options.httpsAgent
      } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const https = require('https')
        agent = new https.Agent(DEFAULT_HTTPS_AGENT_CONFIG)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}

  return axios.create({ httpsAgent: agent })
}
