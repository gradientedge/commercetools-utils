import { TLSSocket } from 'tls'

/**
 * Attempts to extract the negotiated TLS protocol version (e.g. `TLSv1.3`)
 * from an Axios request/response object. Returns `undefined` if the request
 * was not made over TLS or the socket information is unavailable.
 */
export function extractTlsVersion(request: unknown): string | undefined {
  const socket = (request as { socket?: unknown } | undefined)?.socket
  if (socket && typeof (socket as TLSSocket).getProtocol === 'function') {
    const protocol = (socket as TLSSocket).getProtocol()
    if (typeof protocol === 'string') {
      return protocol
    }
  }
  return undefined
}
