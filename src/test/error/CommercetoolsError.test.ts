import { CommercetoolsError } from '../../lib'

describe('CommercetoolsError', () => {
  it('should return the expected string when stringified', async () => {
    expect(
      JSON.stringify(
        new CommercetoolsError('Test message', {
          test: 1
        })
      )
    ).toBe('{"message":"Test message","data":{"test":1}}')
  })

  it('should return the expected string when converted to a string', async () => {
    expect(
      new CommercetoolsError('Test message', {
        test: 1
      }).toString()
    ).toBe('Test message: {"test":1}')
  })
})
