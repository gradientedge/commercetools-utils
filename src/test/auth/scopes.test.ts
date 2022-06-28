import { scopeArrayToRequestString, scopeRequestStringToArray } from '../../lib/auth/scopes'

describe('scopeArrayToRequestString', () => {
  it('should return a blank string when the argument is an empty array', () => {
    expect(scopeArrayToRequestString([], 'test')).toBe('')
  })

  it('should return the expected string when one scope is provided', () => {
    expect(scopeArrayToRequestString(['scope1'], 'test')).toBe('scope1:test')
  })

  it('should return the expected string when multiple scopes are provided', () => {
    expect(scopeArrayToRequestString(['scope1', 'scope2'], 'test')).toBe('scope1:test scope2:test')
  })
})

describe('scopeRequestStringToArray', () => {
  it('should return an empty array when a blank string is provided', () => {
    expect(scopeRequestStringToArray('')).toEqual([])
  })

  it('should return an array with one item when a string with one scope is provided', () => {
    expect(scopeRequestStringToArray('scope1:test')).toEqual(['scope1'])
  })

  it('should return an array with two items when a string with two scopes is provided', () => {
    expect(scopeRequestStringToArray('scope1:test scope2:test')).toEqual(['scope1', 'scope2'])
  })
})
