import { extractTlsVersion } from '../../../lib/index.js'

describe('extractTlsVersion', () => {
  it('returns the negotiated protocol from a TLS socket', () => {
    const request = {
      socket: {
        getProtocol: (): string => 'TLSv1.3',
      },
    }
    expect(extractTlsVersion(request)).toBe('TLSv1.3')
  })

  it('returns undefined when the request is undefined', () => {
    expect(extractTlsVersion(undefined)).toBeUndefined()
  })

  it('returns undefined when the request has no socket', () => {
    expect(extractTlsVersion({})).toBeUndefined()
  })

  it('returns undefined when the socket has no getProtocol function (plain HTTP)', () => {
    const request = {
      socket: {
        // no getProtocol present
      },
    }
    expect(extractTlsVersion(request)).toBeUndefined()
  })

  it('returns undefined when getProtocol returns null (not yet negotiated)', () => {
    const request = {
      socket: {
        getProtocol: (): null => null,
      },
    }
    expect(extractTlsVersion(request)).toBeUndefined()
  })

  it('returns undefined when the request is null', () => {
    expect(extractTlsVersion(null)).toBeUndefined()
  })
})
