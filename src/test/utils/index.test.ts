import { buildUserAgent } from '../../lib/utils'

describe('buildUserAgent', () => {
  it('should use only the package name and version when no system identifier is passed in', () => {
    expect(buildUserAgent()).toBe('commercetools-utils/0.0.0-development')
  })

  it('should append the system identifier when passed in', () => {
    expect(buildUserAgent('my-system')).toBe('commercetools-utils/0.0.0-development (my-system)')
  })

  it('should ignore a null value for the system identifier', () => {
    expect(buildUserAgent((null as unknown) as string)).toBe('commercetools-utils/0.0.0-development')
  })
})
