import { CommercetoolsError } from '../../lib'

describe('CommercetoolsError', () => {
  it('should return the expected string when stringified', async () => {
    expect(JSON.stringify(new CommercetoolsError('Test message', { test: 1 }))).toBe(
      '{"message":"Test message","data":{"test":1},"isCommercetoolsError":true}',
    )
  })

  it('should return the expected string when converted to a string', async () => {
    expect(new CommercetoolsError('Test message', { test: 1 }).toString()).toBe(
      '{"message":"Test message","data":{"test":1},"isCommercetoolsError":true}',
    )
  })

  it('should make the `status` property available directly on the error when passed in as a property on the `data` object', async () => {
    const error = new CommercetoolsError('Test message', null, 409)
    expect(error.toString()).toBe('{"status":409,"message":"Test message","data":null,"isCommercetoolsError":true}')
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

  it('should have a `isCommercetoolsError` property set to `true`', async () => {
    const error = new CommercetoolsError('Test message')
    expect(error.isCommercetoolsError).toBe(true)
  })

  describe('parseRequestData', () => {
    it("should return the data passed in if it isn't a non-zero length string", () => {
      expect(CommercetoolsError.parseRequestData({})).toBeUndefined()
      expect(CommercetoolsError.parseRequestData({ data: null })).toBeNull()
      expect(CommercetoolsError.parseRequestData({ data: 123 })).toBe(123)
    })

    it("should return the data passed in if it's a string but the Content-Type is missing", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {},
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's a string but the Content-Type is empty", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': '',
          },
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's a string but the Content-Type is not recognised", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': 'text/plain',
          },
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's an invalid JSON string", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test"///:1}',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toBe('{"test"///:1}')
    })

    it('should return the parsed JSON string if the string is valid JSON data and the `Content-Type` is `application/json`', () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toEqual({ test: 1 })
    })

    it("should return the data passed in the `Content-Type` is `application/x-www-form-urlencoded` but the data isn't valid", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: null,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      ).toBeNull()
    })

    it('should return the data as an object if the `Content-Type` is `application/x-www-form-urlencoded` and the data is valid', () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: 'single=1&double=2&double=3&novalue&blankvalue=',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      ).toEqual({
        single: '1',
        double: ['2', '3'],
        novalue: '',
        blankvalue: '',
      })
    })
  })
})
