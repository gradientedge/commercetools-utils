import { fileURLToPath } from 'url'
import tls from 'tls'
import fs from 'fs'
import path from 'path'
import nock from 'nock'
import { request } from '../../../lib/request/index.js'
import axios from 'axios'
import https from 'https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const key = fs.readFileSync(path.resolve(__dirname, 'key.pem'))
const cert = fs.readFileSync(path.resolve(__dirname, 'cert.pem'))

describe('request timeout tests', () => {
  let server: tls.Server

  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })

  beforeAll(async () => {
    // The global test setup calls `nock.disableNetConnect()` so that no real
    // outbound network calls are made during tests. This file is an exception
    // because it spins up a local TLS server and needs to connect to it, so
    // we re-enable net connect for the duration of this suite (restricted to
    // localhost so other suites can't accidentally hit real services).
    nock.enableNetConnect('127.0.0.1')

    server = tls.createServer({ key, cert }, (socket) => {
      setTimeout(() => {
        socket.destroy()
      }, 2000)
    })

    await new Promise<void>((resolve) => {
      server.listen(4433, '127.0.0.1', () => resolve())
    })
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })

    // Restore the global "no network" guard for any subsequent test files.
    nock.disableNetConnect()
  })

  it('should fail with 1s timeout on TLS socket hangup of 2s', async () => {
    const timeoutMs = 1000
    const start = Date.now()

    const requestPromise = request({
      axiosInstance,
      retry: { delayMs: 0, maxRetries: 0 },
      request: {
        url: 'https://127.0.0.1:4433/test',
        method: 'GET',
        headers: {},
      },
      timeoutMs,
    })

    await expect(requestPromise).rejects.toThrow(/timeout/i)

    const duration = Date.now() - start
    expect(duration).toBeGreaterThanOrEqual(timeoutMs)
    expect(duration).toBeLessThan(2000)
  }, 6000)
})
