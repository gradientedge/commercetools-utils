export function extractHeaders(headers: Headers): Record<string, string> | undefined {
  let extractedHeaders: Record<string, string> = {}
  for (const [key, value] of headers.entries()) {
    extractedHeaders[key] = value
  }
  return extractedHeaders
}
