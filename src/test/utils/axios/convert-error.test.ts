import { convertAxiosError } from '../../../lib/utils/axios/convert-error.js'
import { AxiosError, AxiosHeaders } from 'axios'
import { CommercetoolsRequestResponseStats } from '../../../lib/types.js'

const stats: CommercetoolsRequestResponseStats = {
  accumulativeDurationMs: 10,
  durationMs: 5,
  retries: 0,
  activeSockets: 1,
  freeSocketCount: 0,
  queuedRequests: 0,
}

function buildAxiosError(overrides: Partial<AxiosError> = {}): AxiosError {
  const error = new Error('boom') as AxiosError
  ;(error as unknown as { isAxiosError: boolean }).isAxiosError = true
  error.code = 'ERR_BAD_RESPONSE'
  error.config = {
    url: 'https://api.example.com/resource',
    method: 'post',
    params: { foo: 'bar' },
    headers: new AxiosHeaders({ accept: 'application/json' }),
    data: '{"a":1}',
  } as AxiosError['config']
  Object.assign(error, overrides)
  return error
}

describe('convertAxiosError', () => {
  it('returns null for non-axios errors', () => {
    expect(convertAxiosError(new Error('nope'), stats)).toBeNull()
  })

  it('populates tlsVersion from error.response.request socket', () => {
    const error = buildAxiosError({
      response: {
        status: 500,
        statusText: 'Server Error',
        headers: new AxiosHeaders({ 'content-type': 'application/json' }),
        data: { error: 'bad' },
        config: {} as AxiosError['config'],
        request: {
          socket: { getProtocol: () => 'TLSv1.3' },
        },
      } as AxiosError['response'],
    })
    const result = convertAxiosError(error, stats)
    expect(result?.response.tlsVersion).toBe('TLSv1.3')
  })

  it('falls back to error.request socket when there is no response (e.g. network error)', () => {
    const error = buildAxiosError({
      request: {
        socket: { getProtocol: () => 'TLSv1.2' },
      },
    })
    const result = convertAxiosError(error, stats)
    expect(result?.response.tlsVersion).toBe('TLSv1.2')
    expect(result?.response.status).toBeUndefined()
    expect(result?.response.message).toBe('boom')
  })

  it('leaves tlsVersion undefined when no socket info is available', () => {
    const error = buildAxiosError()
    const result = convertAxiosError(error, stats)
    expect(result?.response.tlsVersion).toBeUndefined()
  })

  it('produces the expected full shape including tlsVersion', () => {
    const error = buildAxiosError({
      response: {
        status: 404,
        statusText: 'Not Found',
        headers: new AxiosHeaders({ 'content-type': 'application/json' }),
        data: { message: 'missing' },
        config: {} as AxiosError['config'],
        request: {
          socket: { getProtocol: () => 'TLSv1.3' },
        },
      } as AxiosError['response'],
    })

    const result = convertAxiosError(error, stats)

    expect(result).toEqual({
      request: {
        url: 'https://api.example.com/resource',
        method: 'post',
        params: { foo: 'bar' },
        headers: { accept: 'application/json' },
        data: '{"a":1}',
      },
      response: {
        code: 'ERR_BAD_RESPONSE',
        message: undefined,
        status: 404,
        headers: { 'content-type': 'application/json' },
        data: { message: 'missing' },
        tlsVersion: 'TLSv1.3',
      },
      stats,
    })
  })
})
