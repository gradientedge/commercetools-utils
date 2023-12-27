import { CommercetoolsError } from '../../lib/index.js'
import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

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
      expect(CommercetoolsError.parseRequestData({} as InternalAxiosRequestConfig)).toBeUndefined()
      expect(CommercetoolsError.parseRequestData({ data: null } as InternalAxiosRequestConfig)).toBeNull()
      expect(CommercetoolsError.parseRequestData({ data: 123 } as InternalAxiosRequestConfig)).toBe(123)
    })

    it("should return the data passed in if it's a string but the Content-Type is missing", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {} as AxiosRequestHeaders,
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's a string but the Content-Type is empty", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': '',
          } as AxiosRequestHeaders,
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's a string but the Content-Type is not recognised", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': 'text/plain',
          } as AxiosRequestHeaders,
        }),
      ).toBe('{"test":1}')
    })

    it("should return the data passed in if it's an invalid JSON string", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test"///:1}',
          headers: {
            'Content-Type': 'application/json',
          } as AxiosRequestHeaders,
        }),
      ).toBe('{"test"///:1}')
    })

    it('should return the parsed JSON string if the string is valid JSON data and the `Content-Type` is `application/json`', () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: '{"test":1}',
          headers: {
            'Content-Type': 'application/json',
          } as AxiosRequestHeaders,
        }),
      ).toEqual({ test: 1 })
    })

    it("should return the data passed in the `Content-Type` is `application/x-www-form-urlencoded` but the data isn't valid", () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: null,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          } as AxiosRequestHeaders,
        }),
      ).toBeNull()
    })

    it('should return the data as an object if the `Content-Type` is `application/x-www-form-urlencoded` and the data is valid', () => {
      expect(
        CommercetoolsError.parseRequestData({
          data: 'single=1&double=2&double=3&novalue&blankvalue=',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          } as AxiosRequestHeaders,
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
