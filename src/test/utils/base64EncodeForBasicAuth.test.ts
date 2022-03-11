import { mocked } from 'jest-mock'
import { base64EncodeForBasicAuth } from '../../lib/auth/utils'
import { isNode } from '../../lib/utils/isNode'

jest.mock('../../lib/utils/isNode')

describe('base64EncodeForBasicAuth', () => {
  it('should correctly encode the username and password using Buffer in a nodejs environment', () => {
    const result = base64EncodeForBasicAuth('username', 'password')

    expect(result).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=')
  })

  it('should correctly encode the username and password using the `btoa` method in a browser environment', () => {
    mocked(isNode).mockReturnValue(false)

    const result = base64EncodeForBasicAuth('username', 'password')

    expect(result).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=')
  })
})
