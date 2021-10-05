import { maskSensitiveData } from '../../lib'

describe('maskSensitiveData', () => {
  it('should return null if null is passed in', () => {
    expect(maskSensitiveData(null, ['password'], '***mask***')).toBeNull()
  })

  it('should return undefined if undefined is passed in', () => {
    expect(maskSensitiveData(undefined, ['password'], '***mask***')).toBeUndefined()
  })

  it('should return the passed in value if a scalar is passed in', () => {
    expect(maskSensitiveData(123, ['password'], '***mask***')).toBe(123)
    expect(maskSensitiveData('Testing', ['password'], '***mask***')).toBe('Testing')
  })

  describe('one property name', () => {
    it('should mask the top fields passed in when they exist on the top level object', () => {
      const result = maskSensitiveData({ password: 'test' }, ['password'], '***mask***')
      expect(result).toEqual({ password: '***mask***' })
    })

    it('should not alter non-matching properties', () => {
      const result = maskSensitiveData({ password: 'test', secret: '123', name: 'Jimmy' }, ['password'], '***mask***')
      expect(result).toEqual({ password: '***mask***', secret: '123', name: 'Jimmy' })
    })
  })

  describe('multiple property names', () => {
    it('should mask the top fields passed in when they exist on the top level object', () => {
      const result = maskSensitiveData(
        { password: 'test', name: 'Jimmy', secret: 123 },
        ['password', 'secret'],
        '***mask***',
      )
      expect(result).toEqual({ password: '***mask***', name: 'Jimmy', secret: '***mask***' })
    })
  })

  describe('deeply nested object', () => {
    it('should mask all matching field names, regardless of nesting level', () => {
      const result = maskSensitiveData(
        {
          password: 'test',
          name: 'Jimmy',
          secret: 123,
          nest1: {
            secret: 'Another secret',
            nest2: {
              password: 'test2',
              dob: '09-09-90',
            },
          },
        },
        ['password', 'secret'],
        '***mask***',
      )
      expect(result).toEqual({
        password: '***mask***',
        name: 'Jimmy',
        secret: '***mask***',
        nest1: {
          secret: '***mask***',
          nest2: {
            password: '***mask***',
            dob: '09-09-90',
          },
        },
      })
    })
  })
})
