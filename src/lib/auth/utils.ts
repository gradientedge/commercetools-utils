export function base64EncodeForBasicAuth(username: string, password: string) {
  return Buffer.from(`${username}:${password}`).toString('base64')
}
