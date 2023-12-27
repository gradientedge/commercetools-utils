import { base64EncodeForBasicAuth } from '../../lib/auth/utils.js'

describe('base64EncodeForBasicAuth', () => {
  let originalProcessEnv = {}

  beforeAll(() => {
    originalProcessEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = { ...originalProcessEnv }
  })

  it('should correctly encode the username and password using Buffer in a nodejs environment', () => {
    process.env.GECTU_IS_BROWSER = '0'

    const result = base64EncodeForBasicAuth('username', 'password')

    expect(result).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=')
  })

  it('should correctly encode the username and password using the `btoa` method in a browser environment', () => {
    process.env.GECTU_IS_BROWSER = '1'

    const result = base64EncodeForBasicAuth('username', 'password')

    expect(result).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=')
  })
})
