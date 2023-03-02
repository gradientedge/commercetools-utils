import { AxiosHeaders } from 'axios'

export function extractAxiosHeaders(headers: unknown): Record<string, string> | undefined {
  let extractedHeaders: Record<string, string> = {}
  if (headers instanceof AxiosHeaders) {
    const jsonHeaders = headers.toJSON() as Record<string, any>
    extractedHeaders = {}
    Object.entries(jsonHeaders).forEach(([name, value]) => {
      const lcName = name.toLowerCase()
      if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        extractedHeaders[lcName] = value.toString()
      } else if (Array.isArray(value)) {
        extractedHeaders[lcName] = value.join(', ')
      }
    })
  }
  return Object.keys(extractedHeaders).length ? extractedHeaders : undefined
}
