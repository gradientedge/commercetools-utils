import { AxiosHeaders } from 'axios'
import { extractAxiosHeaders } from '../../../lib/utils/axios/extract-headers.js'

describe('extractAxiosHeaders', () => {
  it('returns undefined when given non-AxiosHeaders input', () => {
    expect(extractAxiosHeaders(undefined)).toBeUndefined()
    expect(extractAxiosHeaders(null)).toBeUndefined()
    expect(extractAxiosHeaders({ accept: 'application/json' })).toBeUndefined()
  })

  it('returns undefined when given an empty AxiosHeaders instance', () => {
    expect(extractAxiosHeaders(new AxiosHeaders())).toBeUndefined()
  })

  it('lowercases header names and stringifies scalar values', () => {
    const headers = new AxiosHeaders()
    headers.set('Accept', 'application/json')
    headers.set('X-Number', 42)
    headers.set('X-Boolean', true)

    expect(extractAxiosHeaders(headers)).toEqual({
      accept: 'application/json',
      'x-number': '42',
      'x-boolean': 'true',
    })
  })

  it('joins array header values with a comma and space', () => {
    const headers = new AxiosHeaders()
    headers.set('Set-Cookie', ['a=1', 'b=2'])

    expect(extractAxiosHeaders(headers)).toEqual({
      'set-cookie': 'a=1, b=2',
    })
  })
})
