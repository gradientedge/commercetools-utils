export function base64EncodeForBasicAuth(username: string, password: string) {
  const toEncode = `${username}:${password}`
  if (process.env.GECTU_IS_BROWSER !== '1') {
    return Buffer.from(toEncode).toString('base64')
  } else {
    return btoa(toEncode)
  }
}
