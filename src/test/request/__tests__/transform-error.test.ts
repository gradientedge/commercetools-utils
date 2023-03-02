import { transformError } from '../../../lib/request/transform-error'
import { CommercetoolsError } from '../../../lib/error'

describe('transformError', () => {
  it("should return the object passed in when it's not an axios error object", async () => {
    const error = { test: 1 }

    const result = transformError(error)

    expect(result).toBe(error)
  })

  it('should return a CommercetoolsError object when an axios error is passed in', async () => {
    const error = { isAxiosError: true, message: 'Testing' }

    const result = transformError(error)

    expect(result).toBeInstanceOf(CommercetoolsError)
  })
})
