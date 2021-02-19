import { CommercetoolsAuthError } from '../../lib'

describe('CommercetoolsAuthError', () => {
  it('should return the expected string when stringified', async () => {
    expect(
      JSON.stringify(
        new CommercetoolsAuthError('Test message', {
          test: 1
        })
      )
    ).toBe('{"message":"Test message","data":{"test":1}}')
  })

  it('should return the expected string when converted to a string', async () => {
    expect(
      new CommercetoolsAuthError('Test message', {
        test: 1
      }).toString()
    ).toBe('Test message: {"test":1}')
  })
})
