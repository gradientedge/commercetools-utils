export function base64EncodeForBasicAuth(username: string, password: string): string {
  const toEncode = `${username}:${password}`
  return Buffer.from(toEncode).toString('base64')
}
