import nock from 'nock'
import { CommercetoolsAuth, CommercetoolsError } from '../../lib'
import { CommercetoolsGrantResponse } from '../../lib/auth/types'
import FakeTimers from '@sinonjs/fake-timers'
import { Region } from '../../lib'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.NORTH_AMERICA_AWS,
  clientScopes: ['defaultClientScope1'],
}

const defaultClientGrantResponse: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  scope: 'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800,
}

const defaultResponseToken: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800,
}

function nockGetClientGrant(body = '') {
  return nock('https://auth.us-east-2.aws.commercetools.com', {
    encodedQueryParams: true,
  })
    .post('/oauth/token', body || 'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key')
    .reply(200, defaultClientGrantResponse)
}

describe('CommercetoolsAuth', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  describe('constructor', () => {
    it('should throw if there are no client scopes defined on the config object', () => {
      expect(() => {
        new CommercetoolsAuth({ ...defaultConfig, clientScopes: [] })
      }).toThrow(new CommercetoolsError('`config.clientScopes` must contain at least one scope'))
    })

    it('should use the expected defaults for optional config properties', () => {
      const auth = new CommercetoolsAuth(defaultConfig)
      expect((auth as any).config).toMatchObject({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        projectKey: 'test-project-key',
        refreshIfWithinSecs: 1800,
        region: 'north_america_aws',
        clientScopes: ['defaultClientScope1'],
      })
    })

    it('should override the config defaults when config options are explicitly passed in', () => {
      const auth = new CommercetoolsAuth({
        ...defaultConfig,
        refreshIfWithinSecs: 2500,
      })
      expect((auth as any).config).toMatchObject({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        projectKey: 'test-project-key',
        refreshIfWithinSecs: 2500,
        region: 'north_america_aws',
        clientScopes: ['defaultClientScope1'],
      })
    })

    it('should set the customer and client scopes on the config when passed in', () => {
      const auth = new CommercetoolsAuth({
        ...defaultConfig,
        customerScopes: ['scope1', 'scope2'],
        clientScopes: ['scope3', 'scope4'],
      })
      expect((auth as any).config).toMatchObject({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        projectKey: 'test-project-key',
        refreshIfWithinSecs: 1800,
        region: 'north_america_aws',
        customerScopes: ['scope1', 'scope2'],
        clientScopes: ['scope3', 'scope4'],
      })
    })
  })

  describe('getClientGrant', () => {
    it('should directly make a request to get a new grant when no grant is cached', async () => {
      const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
      const auth = new CommercetoolsAuth(defaultConfig)
      const scope = nockGetClientGrant()

      const token = await auth.getClientGrant()

      scope.isDone()
      expect(token).toEqual({
        accessToken: 'test-access-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date('2020-01-03T09:35:23.000'),
        customerId: '123456',
      })
      clock.uninstall()
    })

    it('should use the configured client scopes when making a request', async () => {
      const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
      const auth = new CommercetoolsAuth({
        ...defaultConfig,
        clientScopes: ['test-scope1', 'test-scope2'],
      })
      const scope = nockGetClientGrant(
        'grant_type=client_credentials&scope=test-scope1%3Atest-project-key+test-scope2%3Atest-project-key',
      )

      const token = await auth.getClientGrant()

      scope.isDone()
      expect(token).toEqual({
        accessToken: 'test-access-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date(1578044123000),
        customerId: '123456',
      })
      clock.uninstall()
    })

    it('should return the cached grant if it has not expired', async () => {
      const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
      const auth = new CommercetoolsAuth(defaultConfig)
      const scope = nockGetClientGrant()
      await auth.getClientGrant()
      // Set the date/time ahead by 1 day
      clock.setSystemTime(new Date('2020-01-02T09:35:23.000'))

      const token = await auth.getClientGrant()

      scope.isDone()
      expect(token).toEqual({
        accessToken: 'test-access-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date(1578044123000),
        customerId: '123456',
      })
      clock.uninstall()
    })

    it('should wait on a single promise when two requests are made at the same time', async () => {
      const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
      const auth = new CommercetoolsAuth(defaultConfig)
      const scope1 = nockGetClientGrant()

      const [token1, token2] = await Promise.all([auth.getClientGrant(), auth.getClientGrant()])

      scope1.isDone()
      expect(token1).toEqual({
        accessToken: 'test-access-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date(1578044123000),
        customerId: '123456',
      })
      expect(token2).toEqual({
        accessToken: 'test-access-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date(1578044123000),
        customerId: '123456',
      })
      clock.uninstall()
    })
  })

  describe('refreshCustomerGrant', () => {
    it('should request a client grant before making the refresh customer access token request, if no cached client grant exists', async () => {
      const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
      const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
      // Resolving the client grant request
      const scope1 = nockGetClientGrant()
      // Resolving the customer refresh token request
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', `grant_type=refresh_token&refresh_token=customer-refresh-token`)
        .reply(200, {
          access_token: 'test-customer-access-token',
          expires_in: 1234567,
          scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
        })

      const customerToken = await auth.refreshCustomerGrant('customer-refresh-token')

      scope1.isDone()
      scope2.isDone()
      expect(customerToken).toEqual({
        accessToken: 'test-customer-access-token',
        refreshToken: 'customer-refresh-token',
        expiresIn: 1234567,
        expiresAt: new Date('2020-01-20T19:11:24.000Z'),
        scopes: [`customer-test-scope1`, `customer-test-scope2`],
      })
      clock.uninstall()
    })

    it('should immediately make the refresh customer access token request if a cached client grant exists', async () => {
      const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
      const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
      const scope1 = nockGetClientGrant()
      await auth.getClientGrant()
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', `grant_type=refresh_token&refresh_token=customer-refresh-token`)
        .reply(200, {
          access_token: 'test-customer-access-token',
          expires_in: 1234567,
          scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
        })

      const customerToken = await auth.refreshCustomerGrant('customer-refresh-token')

      scope1.isDone()
      scope2.isDone()
      expect(customerToken).toEqual({
        accessToken: 'test-customer-access-token',
        refreshToken: 'customer-refresh-token',
        expiresIn: 1234567,
        expiresAt: new Date('2020-01-20T19:11:24.000Z'),
        scopes: [`customer-test-scope1`, `customer-test-scope2`],
      })
      clock.uninstall()
    })
  })

  describe('login', () => {
    describe('cached client grant does not exist', () => {
      it('should request a client grant before making the login request', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        // Resolving the customer access token request for the login request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/customers/token',
            'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.login({
          username: 'testUsername',
          password: 'testPassword',
          scopes: ['scope1'],
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })
    })

    describe('cached client grant exists', () => {
      it('should immediately make the login request', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        const auth = new CommercetoolsAuth(defaultConfig)
        await auth.getClientGrant()
        // Resolving the customer access token request for the login request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/customers/token',
            'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.login({
          username: 'testUsername',
          password: 'testPassword',
          scopes: ['scope1'],
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })

      it('should throw an error if no customer scopes have been defined', async () => {
        const auth = new CommercetoolsAuth(defaultConfig)
        await expect(
          auth.login({
            username: 'testUsername',
            password: 'testPassword',
          }),
        ).rejects.toThrowError(
          'Customer scopes must be set on either the `options` parameter ' +
            'of this `login` method, or on the `customerScopes` property of the ' +
            '`CommercetoolsAuth` constructor',
        )
      })

      it('should use the customer scopes on the config if none passed in', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          customerScopes: ['configuredScope1'],
        })
        const scope1 = nockGetClientGrant()
        await auth.getClientGrant()
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/customers/token',
            'username=testUsername&password=testPassword&grant_type=password&scope=configuredScope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.login({
          username: 'testUsername',
          password: 'testPassword',
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })
    })
  })

  describe('getAnonymousGrant', () => {
    describe('cached client grant does not exist', () => {
      it('should request a client grant before making the anonymous customer request', async () => {
        const auth = new CommercetoolsAuth(defaultConfig)
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        // Resolving the customer access token request for the login request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/anonymous/token',
            'grant_type=client_credentials&scope=anonymousScope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.getAnonymousGrant({
          scopes: ['anonymousScope1'],
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })
    })

    describe('cached client grant exists', () => {
      it('should immediately make the anonymous customer request', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        const auth = new CommercetoolsAuth(defaultConfig)
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        await auth.getClientGrant()
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/anonymous/token',
            'grant_type=client_credentials&scope=anonymousScope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.getAnonymousGrant({
          scopes: ['anonymousScope1'],
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })

      it('should throw an error if no customer scopes have been defined', async () => {
        const auth = new CommercetoolsAuth(defaultConfig)
        await expect(auth.getAnonymousGrant()).rejects.toThrowError(
          'Customer scopes must be set on either the `options` parameter ' +
            'of this `login` method, or on the `customerScopes` property of the ' +
            '`CommercetoolsAuth` constructor',
        )
      })

      it('should use the customer scopes on the config if none passed in', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          customerScopes: ['configuredScope1'],
        })
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        await auth.getClientGrant()
        // Resolving the customer access token request for the anonymous customer request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/anonymous/token',
            'grant_type=client_credentials&scope=configuredScope1%3Atest-project-key',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.getAnonymousGrant()

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`],
        })
        clock.uninstall()
      })

      it('should pass across the anonymous id if specified in the config', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        const auth = new CommercetoolsAuth({ ...defaultConfig })
        // Resolving the client grant request
        const scope1 = nockGetClientGrant()
        await auth.getClientGrant()
        // Resolving the customer access token request for the anonymous customer request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true,
        })
          .post(
            '/oauth/test-project-key/anonymous/token',
            'grant_type=client_credentials&scope=test1%3Atest-project-key&anonymous_id=myAnonId',
          )
          .reply(200, {
            access_token: 'test-customer-access-token',
            refresh_token: 'test-customer-refresh-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey}`,
          })

        const customerToken = await auth.getAnonymousGrant({
          anonymousId: 'myAnonId',
          scopes: ['test1'],
        })

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'test-customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`],
        })
        clock.uninstall()
      })
    })
  })

  describe('logout', () => {
    it('should make a call to revoke the given token', async () => {
      const auth = new CommercetoolsAuth(defaultConfig)
      const scope1 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', `token=my-access-token&token_type_hint=access_token`)
        .reply(200, {})
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', `token=my-refresh-token&token_type_hint=refresh_token`)
        .reply(200, {})

      await expect(auth.logout({ accessToken: 'my-access-token', refreshToken: 'my-refresh-token' })).resolves.toBe(
        undefined,
      )
      scope1.isDone()
      scope2.isDone()
    })
  })

  describe('multiple simultaneous requests', () => {
    it('should make all requests wait for the pending client credentials', (done) => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', 'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key')
        .delay(1500)
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuth(defaultConfig)

      const promises: Promise<any>[] = []

      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          promises.push(auth.getClientGrant())
        }, i * 10)
      }

      setTimeout(async () => {
        const token = await Promise.all(promises)
        expect(token.length).toBe(5)
        scope.isDone()
        done()
      }, 1000)
    })
  })
})
