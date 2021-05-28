import { buildUserAgent, formatAsKey } from '../../lib'

describe('buildUserAgent', () => {
  it('should use only the package name when no system identifier is passed in', () => {
    expect(buildUserAgent()).toBe('@gradientedge/commercetools-utils')
  })

  it('should append the system identifier when passed in', () => {
    expect(buildUserAgent('my-system')).toBe('@gradientedge/commercetools-utils (my-system)')
  })

  it('should ignore a null value for the system identifier', () => {
    expect(buildUserAgent(null as unknown as string)).toBe('@gradientedge/commercetools-utils')
  })
})

describe('formatAsKey', () => {
  it('should throw an error if the parameter is undefined', () => {
    expect(() => formatAsKey(undefined as unknown as string)).toThrow('The [input] parameter must be a string')
  })

  it('should throw an error if the parameter is null', () => {
    expect(() => formatAsKey(null as unknown as string)).toThrow('The [input] parameter must be a string')
  })

  it('should throw an error if the parameter is numeric', () => {
    expect(() => formatAsKey(123 as unknown as string)).toThrow('The [input] parameter must be a string')
  })

  it('should throw an error if the formatted string is less than 2 chars', () => {
    expect(() => formatAsKey('a')).toThrow('Formatted key did not meet minimum length of 2 characters: a')
  })

  it('should throw an error if the formatted string is greater than 256 chars', () => {
    const key =
      'testing123012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789' +
      '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789' +
      '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
    expect(() => formatAsKey(key)).toThrow('Formatted key exceeds the maximum length of 256 characters: ')
  })

  it('should not throw an error if the parameter is a valid string', () => {
    expect(() => formatAsKey('testing')).not.toThrow()
  })

  it('should convert the key to lowercase', () => {
    expect(formatAsKey('TeStInG')).toBe('testing')
  })

  it('should trim any whitespace', () => {
    expect(formatAsKey(' TeStInG  ')).toBe('testing')
  })

  it('should replace spaces with hyphens', () => {
    expect(formatAsKey('testing one two')).toBe('testing-one-two')
  })

  it('should not result in a string with multiple hyphens in a row', () => {
    expect(formatAsKey('testing - one two')).toBe('testing-one-two')
    expect(formatAsKey('testing ---one two')).toBe('testing-one-two')
  })

  it('should replace the ampersand character with the word `and`', () => {
    expect(formatAsKey('testing one & two')).toBe('testing-one-and-two')
  })

  it('should convert underscores to hyphens', () => {
    expect(formatAsKey('testing _one_ & two')).toBe('testing-one-and-two')
  })

  it('should remove any leading or trailing hyphens', () => {
    expect(formatAsKey('-testing _one_ & two-')).toBe('testing-one-and-two')
    expect(formatAsKey('_testing _one_ & two_')).toBe('testing-one-and-two')
    expect(formatAsKey('__-_testing _one_ & two___')).toBe('testing-one-and-two')
  })

  it('should completely remove any non-alphanumeric or hyphen characters', () => {
    expect(formatAsKey('Testing "one" two $ % three * four ')).toBe('testing-one-two-three-four')
  })
})
