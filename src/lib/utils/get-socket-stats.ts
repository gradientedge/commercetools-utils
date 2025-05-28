import type https from 'node:https'

export type SocketStats = {
  activeSockets: number
  freeSocketCount: number
  queuedRequests: number
}

export function getSocketStats(agent?: https.Agent): SocketStats {
  const activeSockets =
    agent && agent.sockets
      ? Object.keys(agent.sockets).reduce((sum, key) => sum + (agent.sockets?.[key]?.length ?? 0), 0)
      : -1

  const freeSocketCount =
    agent && agent.freeSockets
      ? Object.keys(agent.freeSockets).reduce((sum, key) => sum + (agent.freeSockets?.[key]?.length ?? 0), 0)
      : -1

  const queuedRequests =
    agent && agent.requests
      ? Object.keys(agent.requests).reduce((sum, key) => sum + (agent.requests?.[key]?.length ?? 0), 0)
      : -1

  return { activeSockets, freeSocketCount, queuedRequests }
}
