import { CommercetoolsError } from '../../lib'

describe('CommercetoolsError', () => {
  it('should return the expected string when stringified', async () => {
    expect(JSON.stringify(new CommercetoolsError('Test message', { test: 1 }))).toBe(
      '{"message":"Test message","data":{"test":1}}'
    )
  })

  it('should return the expected string when converted to a string', async () => {
    expect(new CommercetoolsError('Test message', { test: 1 }).toString()).toBe(
      '{"message":"Test message","data":{"test":1}}'
    )
  })

  it('should make the `status` property available directly on the error when passed in as a property on the `data` object', async () => {
    const error = new CommercetoolsError('Test message', null, 409)
    expect(error.toString()).toBe('{"status":409,"message":"Test message","data":null}')
    expect(error.status).toBe(409)
  })

  it('should return an undefined value for the `status` property when no data `status` arg is passed in', async () => {
    const error = new CommercetoolsError('Test message')
    expect(error.status).toBeUndefined()
  })

  it('should have a `isCommercetoolsError` property set to `true`', async () => {
    const error = new CommercetoolsError('Test message')
    expect(error.isCommercetoolsError).toBe(true)
  })
})
