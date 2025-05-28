import { getSocketStats } from '../../lib/utils/get-socket-stats.js'
import type https from 'node:https'

describe('getSocketStats', () => {
  it('returns -1 for all stats when no agent is provided', () => {
    const stats = getSocketStats()
    expect(stats).toEqual({
      activeSockets: -1,
      freeSocketCount: -1,
      queuedRequests: -1,
    })
  })

  it('calculates correct socket stats from populated agent', () => {
    const mockAgent = {
      sockets: {
        'example.com:443': [1, 2],
        'api.example.com:443': [3],
      },
      freeSockets: {
        'example.com:443': [4],
      },
      requests: {
        'example.com:443': [5, 6, 7],
      },
    } as unknown as https.Agent

    const stats = getSocketStats(mockAgent)
    expect(stats).toEqual({
      activeSockets: 3,
      freeSocketCount: 1,
      queuedRequests: 3,
    })
  })

  it('handles missing sockets, freeSockets, or requests gracefully', () => {
    const mockAgent = {
      sockets: undefined,
      freeSockets: {},
      requests: {
        test: [1, 2],
      },
    } as unknown as https.Agent

    const stats = getSocketStats(mockAgent)
    expect(stats).toEqual({
      activeSockets: -1,
      freeSocketCount: 0,
      queuedRequests: 2,
    })
  })

  it('handles empty arrays properly', () => {
    const mockAgent = {
      sockets: {
        'host:443': [],
      },
      freeSockets: {
        'host:443': [],
      },
      requests: {
        'host:443': [],
      },
    } as unknown as https.Agent

    const stats = getSocketStats(mockAgent)
    expect(stats).toEqual({
      activeSockets: 0,
      freeSocketCount: 0,
      queuedRequests: 0,
    })
  })
})
