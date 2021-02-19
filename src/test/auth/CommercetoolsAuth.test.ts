import nock from 'nock'
import {
  CommercetoolsAuth,
  CommercetoolsGrantResponse,
  Region,
  CommercetoolsAuthError
} from '../../lib'
import FakeTimers from '@sinonjs/fake-timers'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.US_EAST,
  clientScopes: ['defaultClientScope1']
}

const defaultResponseToken: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope:
    'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800
}

function nockGetClientGrant(body = '') {
  return nock('https://auth.us-east-2.aws.commercetools.com', {
    encodedQueryParams: true
  })
    .post(
      '/oauth/token',
      body || 'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key'
    )
    .reply(200, defaultResponseToken)
}

describe('CommercetoolsAuth', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  describe('public methods', () => {
    describe('constructor', () => {
      it('should throw if there are no client scopes defined on the config object', () => {
        expect(() => {
          new CommercetoolsAuth({ ...defaultConfig, clientScopes: [] })
        }).toThrow(
          new CommercetoolsAuthError('`config.clientScopes` must contain at least one scope')
        )
      })

      it('should use the expected defaults for optional config properties', () => {
        const auth = new CommercetoolsAuth(defaultConfig)
        expect((auth as any).config).toMatchObject({
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          projectKey: 'test-project-key',
          refreshIfWithinSecs: 1800,
          region: 'us_east',
          timeout: 5,
          clientScopes: ['defaultClientScope1']
        })
      })

      it('should override the config defaults when config options are explicitly passed in', () => {
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          refreshIfWithinSecs: 2500,
          timeout: 10
        })
        expect((auth as any).config).toMatchObject({
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          projectKey: 'test-project-key',
          refreshIfWithinSecs: 2500,
          region: 'us_east',
          timeout: 10,
          clientScopes: ['defaultClientScope1']
        })
      })

      it('should set the customer and client scopes on the config when passed in', () => {
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          customerScopes: ['scope1', 'scope2'],
          clientScopes: ['scope3', 'scope4']
        })
        expect((auth as any).config).toMatchObject({
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          projectKey: 'test-project-key',
          refreshIfWithinSecs: 1800,
          region: 'us_east',
          timeout: 5,
          customerScopes: ['scope1', 'scope2'],
          clientScopes: ['scope3', 'scope4']
        })
      })
    })

    describe('getClientGrant', () => {
      it('should directly make a request to get a new access token when no access token is cached', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
        const auth = new CommercetoolsAuth(defaultConfig)
        const scope = nockGetClientGrant()

        const token = await auth.getClientGrant()

        scope.isDone()
        expect(token).toEqual({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date('2020-01-03T09:35:23.000')
        })
        clock.uninstall()
      })

      it('should use the configured client scopes when making a request', async () => {
        const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          clientScopes: ['test-scope1', 'test-scope2']
        })
        const scope = nockGetClientGrant(
          'grant_type=client_credentials&scope=test-scope1%3Atest-project-key+test-scope2%3Atest-project-key'
        )

        const token = await auth.getClientGrant()

        scope.isDone()
        expect(token).toEqual({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date(1578044123000)
        })
        clock.uninstall()
      })

      it('should return the cached token if it has not expired', async () => {
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
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date(1578044123000)
        })
        clock.uninstall()
      })

      it('should attempt to refresh the token when a cached token has expired', async () => {
        // This will be the date/time that we use to get the expiry date of the initial token
        const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })
        const auth = new CommercetoolsAuth(defaultConfig)
        const scope1 = nockGetClientGrant()
        const initialGrant = await auth.getClientGrant()
        const refreshToken = initialGrant.refreshToken
        // Set the fake timer forward by 3 days, which means the system should
        // see the existing access token as having expired.
        clock.setSystemTime(new Date('2020-01-04T01:25:46.000'))
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true
        })
          .post('/oauth/token', `grant_type=refresh_token&refresh_token=${refreshToken}`)
          .reply(200, {
            access_token: 'test-refreshed-access-token',
            scope:
              'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
            expires_in: 172800
          })

        const grant = await auth.getClientGrant()

        scope1.isDone()
        scope2.isDone()
        expect(grant).toEqual({
          accessToken: 'test-refreshed-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date('2020-01-06T01:25:46.000')
        })
        clock.uninstall()
      })

      it('should attempt to refresh the token when the expiry time of the cached token in within the configured range', async () => {
        // This will be the date/time that we use to get the expiry date of the initial token
        const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })

        // Refresh if within 1 hour of expiry time
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
        const scope1 = nockGetClientGrant()
        const initialToken = await auth.getClientGrant()
        const refreshToken = initialToken.refreshToken
        // Set the fake timer forward by 3 days, which means the system should
        // see the existing access token as having expired.
        clock.setSystemTime(new Date('2020-01-03T09:01:12.000'))
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true
        })
          .post('/oauth/token', `grant_type=refresh_token&refresh_token=${refreshToken}`)
          .reply(200, {
            access_token: 'test-refreshed-access-token',
            scope:
              'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
            expires_in: 172800
          })

        const token = await auth.getClientGrant()

        scope1.isDone()
        scope2.isDone()
        expect(token).toEqual({
          accessToken: 'test-refreshed-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date('2020-01-05T09:01:12.000Z')
        })
        clock.uninstall()
      })
    })

    describe('refreshCustomerGrant', () => {
      it('should request a client access token before making the refresh customer access token request, if no cached client access token exists', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        // Resolving the client access token request
        const scope1 = nockGetClientGrant()
        // Resolving the customer refresh token request
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true
        })
          .post('/oauth/token', `grant_type=refresh_token&refresh_token=customer-refresh-token`)
          .reply(200, {
            access_token: 'test-customer-access-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
          })

        const customerToken = await auth.refreshCustomerGrant('customer-refresh-token')

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`]
        })
        clock.uninstall()
      })

      it('should immediately make the refresh customer access token request if a cached client access token exists', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
        const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
        const scope1 = nockGetClientGrant()
        await auth.getClientGrant()
        const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
          encodedQueryParams: true
        })
          .post('/oauth/token', `grant_type=refresh_token&refresh_token=customer-refresh-token`)
          .reply(200, {
            access_token: 'test-customer-access-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
          })

        const customerToken = await auth.refreshCustomerGrant('customer-refresh-token')

        scope1.isDone()
        scope2.isDone()
        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          refreshToken: 'customer-refresh-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`]
        })
        clock.uninstall()
      })
    })

    describe('login', () => {
      describe('cached client access token does not exist', () => {
        it('should request a client access token before making the login request', async () => {
          const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 })
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          // Resolving the customer access token request for the login request
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/customers/token',
              'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword',
            scopes: ['scope1']
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })
      })

      describe('cached client access token exists', () => {
        it('should immediately make the login request', async () => {
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          const auth = new CommercetoolsAuth(defaultConfig)
          await auth.getClientGrant()
          // Resolving the customer access token request for the login request
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/customers/token',
              'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword',
            scopes: ['scope1']
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })

        it('should throw an error if no customer scopes have been defined', async () => {
          const auth = new CommercetoolsAuth(defaultConfig)
          await expect(
            auth.login({
              username: 'testUsername',
              password: 'testPassword'
            })
          ).rejects.toThrowError(
            'Customer scopes must be set on either the `options` parameter ' +
              'of this `login` method, or on the `customerScopes` property of the ' +
              '`CommercetoolsAuth` constructor'
          )
        })

        it('should use the customer scopes on the config if none passed in', async () => {
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          const auth = new CommercetoolsAuth({
            ...defaultConfig,
            customerScopes: ['configuredScope1']
          })
          const scope1 = nockGetClientGrant()
          await auth.getClientGrant()
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/customers/token',
              'username=testUsername&password=testPassword&grant_type=password&scope=configuredScope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword'
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })
      })
    })

    describe('getAnonymousGrant', () => {
      describe('cached client access token does not exist', () => {
        it('should request a client access token before making the anonymous customer request', async () => {
          const auth = new CommercetoolsAuth(defaultConfig)
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          // Resolving the customer access token request for the login request
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/anonymous/token',
              'grant_type=client_credentials&scope=anonymousScope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.getAnonymousGrant({
            scopes: ['anonymousScope1']
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })
      })

      describe('cached client access token exists', () => {
        it('should immediately make the anonymous customer request', async () => {
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          const auth = new CommercetoolsAuth(defaultConfig)
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          await auth.getClientGrant()
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/anonymous/token',
              'grant_type=client_credentials&scope=anonymousScope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.getAnonymousGrant({
            scopes: ['anonymousScope1']
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })

        it('should throw an error if no customer scopes have been defined', async () => {
          const auth = new CommercetoolsAuth(defaultConfig)
          await expect(auth.getAnonymousGrant()).rejects.toThrowError(
            'Customer scopes must be set on either the `options` parameter ' +
              'of this `login` method, or on the `customerScopes` property of the ' +
              '`CommercetoolsAuth` constructor'
          )
        })

        it('should use the customer scopes on the config if none passed in', async () => {
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          const auth = new CommercetoolsAuth({
            ...defaultConfig,
            customerScopes: ['configuredScope1']
          })
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          await auth.getClientGrant()
          // Resolving the customer access token request for the anonymous customer request
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/anonymous/token',
              'grant_type=client_credentials&scope=configuredScope1%3Atest-project-key'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.getAnonymousGrant()

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
          clock.uninstall()
        })

        it('should pass across the anonymous id if specified in the config', async () => {
          const clock = FakeTimers.install({ now: new Date('2020-01-06T12:15:17.000Z') })
          const auth = new CommercetoolsAuth({ ...defaultConfig })
          // Resolving the client access token request
          const scope1 = nockGetClientGrant()
          await auth.getClientGrant()
          // Resolving the customer access token request for the anonymous customer request
          const scope2 = nock('https://auth.us-east-2.aws.commercetools.com', {
            encodedQueryParams: true
          })
            .post(
              '/oauth/test-project-key/anonymous/token',
              'grant_type=client_credentials&scope=test1%3Atest-project-key&anonymous_id=myAnonId'
            )
            .reply(200, {
              access_token: 'test-customer-access-token',
              refresh_token: 'test-customer-refresh-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey}`
            })

          const customerToken = await auth.getAnonymousGrant({
            anonymousId: 'myAnonId',
            scopes: ['test1']
          })

          scope1.isDone()
          scope2.isDone()
          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            refreshToken: 'test-customer-refresh-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`]
          })
          clock.uninstall()
        })
      })
    })
  })
})
