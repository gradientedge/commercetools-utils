import { convertAxiosResponse } from '../../../lib/utils/axios/convert-response.js'
import { AxiosHeaders, AxiosResponse } from 'axios'
import { CommercetoolsRequestResponseStats } from '../../../lib/types.js'

const stats: CommercetoolsRequestResponseStats = {
  accumulativeDurationMs: 10,
  durationMs: 5,
  retries: 0,
  activeSockets: 1,
  freeSocketCount: 0,
  queuedRequests: 0,
  clientStartTime: 0,
  clientEndTime: 5,
}

function buildResponse(overrides: Partial<AxiosResponse> = {}): AxiosResponse {
  return {
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders({ 'content-type': 'application/json' }),
    data: { ok: true },
    config: {
      url: 'https://api.example.com/resource',
      method: 'get',
      params: { foo: 'bar' },
      headers: new AxiosHeaders({ accept: 'application/json' }),
      data: undefined,
    } as AxiosResponse['config'],
    request: {
      socket: {
        getProtocol: () => 'TLSv1.3',
      },
    },
    ...overrides,
  } as AxiosResponse
}

describe('convertAxiosResponse', () => {
  it('populates tlsVersion from the TLS socket on the request', () => {
    const result = convertAxiosResponse(buildResponse(), stats)
    expect(result.response.tlsVersion).toBe('TLSv1.3')
  })

  it('leaves tlsVersion undefined for non-TLS requests', () => {
    const result = convertAxiosResponse(
      buildResponse({ request: { socket: {} } } as unknown as Partial<AxiosResponse>),
      stats,
    )
    expect(result.response.tlsVersion).toBeUndefined()
  })

  it('leaves tlsVersion undefined when no request is present', () => {
    const result = convertAxiosResponse(
      buildResponse({ request: undefined } as unknown as Partial<AxiosResponse>),
      stats,
    )
    expect(result.response.tlsVersion).toBeUndefined()
  })

  it('includes the other response fields alongside tlsVersion', () => {
    const result = convertAxiosResponse(buildResponse(), stats)
    expect(result).toEqual({
      request: {
        url: 'https://api.example.com/resource',
        method: 'get',
        params: { foo: 'bar' },
        headers: { accept: 'application/json' },
        data: undefined,
      },
      response: {
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { ok: true },
        tlsVersion: 'TLSv1.3',
      },
      stats,
    })
  })
})
