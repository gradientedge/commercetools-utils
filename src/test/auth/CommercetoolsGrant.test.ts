import { CommercetoolsGrant } from '../../lib/auth/CommercetoolsGrant'
import FakeTimers from '@sinonjs/fake-timers'

describe('CommercetoolsGrant', () => {
  it('should set all properties as expected', () => {
    const clock = FakeTimers.install({ now: new Date('2020-02-21T16:46:42.000') })

    const grant = new CommercetoolsGrant({
      access_token: '123',
      refresh_token: '456',
      expires_in: 172800,
      scope: 'scope1:test-project'
    })

    expect(grant).toEqual({
      accessToken: '123',
      refreshToken: '456',
      expiresAt: new Date('2020-02-23T16:46:42.000Z'),
      expiresIn: 172800,
      scopes: ['scope1']
    })

    clock.uninstall()
  })

  it('should set the `expiresAt` property dependent on the `expires_in` value', () => {
    const clock = FakeTimers.install({ now: new Date('2020-02-21T16:46:42.000') })

    const grant = new CommercetoolsGrant({
      access_token: '123',
      refresh_token: '456',
      expires_in: 259200, // 3 days
      scope: 'scope1:test-project'
    })

    expect(grant).toEqual({
      accessToken: '123',
      refreshToken: '456',
      expiresAt: new Date('2020-02-24T16:46:42.000Z'),
      expiresIn: 259200,
      scopes: ['scope1']
    })

    clock.uninstall()
  })

  it('should not set the refresh token property when no `refresh_token` is passed in', () => {
    const grant = new CommercetoolsGrant({
      access_token: '123',
      expires_in: 172800,
      scope: 'scope1:test-project'
    })

    expect(grant.refreshToken).toBeUndefined()
  })

  it('should set the refresh token property when the `refresh_token` is passed in', () => {
    const grant = new CommercetoolsGrant({
      access_token: '123',
      refresh_token: 'test-refresh-token',
      expires_in: 172800,
      scope: 'scope1:test-project'
    })

    expect(grant.refreshToken).toBe('test-refresh-token')
  })

  it('should not set the `refreshToken` property if a blank refresh token is passed in', () => {
    const grant = new CommercetoolsGrant({
      access_token: '123',
      refresh_token: '',
      expires_in: 172800,
      scope: 'scope1:test-project'
    })

    expect(grant.refreshToken).toBeUndefined()
  })
})
