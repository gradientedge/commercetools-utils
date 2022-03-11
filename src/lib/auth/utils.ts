import { isNode } from '../utils'

export function base64EncodeForBasicAuth(username: string, password: string) {
  const toEncode = `${username}:${password}`
  if (isNode()) {
    return Buffer.from(toEncode).toString('base64')
  } else {
    return btoa(toEncode)
  }
}
