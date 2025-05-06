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
    const result = base64EncodeForBasicAuth('username', 'password')

    expect(result).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=')
  })
})
