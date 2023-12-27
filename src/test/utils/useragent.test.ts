import { buildUserAgent } from '../../lib/utils/useragent.js'

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
