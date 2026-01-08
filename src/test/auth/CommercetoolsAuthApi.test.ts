import nock from 'nock'
import { CommercetoolsError, Region } from '../../lib/index.js'
import { CommercetoolsAuthApi } from '../../lib/auth/CommercetoolsAuthApi.js'
import { CommercetoolsGrantResponse } from '../../lib/auth/types.js'
import * as assert from 'assert'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.NORTH_AMERICA_AWS,
  timeoutMs: 1000,
  retry: {
    maxRetries: 0,
    delayMs: 50,
    jitter: false,
  },
}

const defaultResponseToken: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'scope1:test-project-key customer_id:123456',
  expires_in: 172800,
}

const defaultRefreshGrantResponse: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  scope: 'scope1:test-project-key customer_id:123456',
  expires_in: 172800,
}

describe('CommercetoolsAuthApi', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  describe('constructor', () => {
    it('should use region-based endpoint when custom authUrl is not provided', () => {
      const auth = new CommercetoolsAuthApi(defaultConfig)
      expect(auth.endpoints.auth).toBe('https://auth.us-east-2.aws.commercetools.com')
    })

    it('should use custom auth endpoint when provided', () => {
      const auth = new CommercetoolsAuthApi({
        ...defaultConfig,
        authUrl: 'http://localhost:4000/auth',
      })
      expect(auth.endpoints.auth).toBe('http://localhost:4000/auth')
    })

    it('should use custom auth and api endpoints when both are provided', () => {
      const auth = new CommercetoolsAuthApi({
        ...defaultConfig,
        authUrl: 'http://localhost:4000/auth',
        apiUrl: 'http://localhost:4000/api',
      })
      expect(auth.endpoints.auth).toBe('http://localhost:4000/auth')
      expect(auth.endpoints.api).toBe('http://localhost:4000/api')
    })

    it('should fall back to region-based API endpoint when only custom authUrl is provided', () => {
      const auth = new CommercetoolsAuthApi({
        ...defaultConfig,
        authUrl: 'http://localhost:4000/auth',
      })
      expect(auth.endpoints.auth).toBe('http://localhost:4000/auth')
      expect(auth.endpoints.api).toBe('https://api.us-east-2.aws.commercetools.com')
    })
  })

  describe('getClientGrant', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', 'grant_type=client_credentials&scope=scope1%3Atest-project-key')
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getClientGrant(['scope1'])

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })

    it('should use custom auth endpoint when making requests', async () => {
      const customAuthUrl = 'http://localhost:4000'
      const scope = nock(customAuthUrl, {
        encodedQueryParams: true,
      })
        .post('/oauth/token', 'grant_type=client_credentials&scope=scope1%3Atest-project-key')
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi({
        ...defaultConfig,
        authUrl: customAuthUrl,
      })

      const grant = await auth.getClientGrant(['scope1'])

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('refreshGrant', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', 'grant_type=refresh_token&refresh_token=myRefreshToken')
        .reply(200, defaultRefreshGrantResponse)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.refreshGrant('myRefreshToken')

      scope.isDone()
      expect(grant).toEqual(defaultRefreshGrantResponse)
    })
  })

  describe('login', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post(
          '/oauth/test-project-key/customers/token',
          'username=jimmy%40gradientedge.com&password=testing&grant_type=password&scope=scope1%3Atest-project-key+scope2%3Atest-project-key',
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.login({
        username: 'jimmy@gradientedge.com',
        password: 'testing',
        scopes: ['scope1', 'scope2'],
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })

    it('should apply the given store key when provided', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post(
          '/oauth/test-project-key/in-store/key=my-store-a/customers/token',
          //'username=jimmy%40gradientedge.com&password=testing&grant_type=password&scope=scope1%3Atest-project-key+scope2%3Atest-project-key'
          {
            username: 'jimmy@gradientedge.com',
            password: 'testing',
            grant_type: 'password',
            scope: 'scope1:test-project-key scope2:test-project-key',
          },
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.login({
        username: 'jimmy@gradientedge.com',
        password: 'testing',
        scopes: ['scope1', 'scope2'],
        storeKey: 'my-store-a',
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('getAnonymousGrant', () => {
    it('should call commercetools with the expected request when no options are passed in', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/test-project-key/anonymous/token', 'grant_type=client_credentials')
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getAnonymousGrant()

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })

    it('should call commercetools with the expected request when scopes but no anonymous id is passed in', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post(
          '/oauth/test-project-key/anonymous/token',
          'grant_type=client_credentials&scope=scope1%3Atest-project-key',
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getAnonymousGrant({
        scopes: ['scope1'],
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })

    it('should call commercetools with the expected request when scopes an anonymous id is passed in', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post(
          '/oauth/test-project-key/anonymous/token',
          'grant_type=client_credentials&scope=scope1%3Atest-project-key&anonymous_id=myAnonId',
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getAnonymousGrant({
        anonymousId: 'myAnonId',
        scopes: ['scope1'],
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('revokeToken', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-refresh-token&token_type_hint=refresh_token')
        .reply(200, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      await expect(
        auth.revokeToken({ tokenValue: 'my-refresh-token', tokenType: 'refresh_token' }),
      ).resolves.toBeUndefined()
      scope.isDone()
    })
  })

  describe('logout', () => {
    it('should call commercetools with the expected requests', async () => {
      const scope1 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-refresh-token&token_type_hint=refresh_token')
        .reply(200, {})
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-access-token&token_type_hint=access_token')
        .reply(200, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      await expect(
        auth.logout({ accessToken: 'my-access-token', refreshToken: 'my-refresh-token' }),
      ).resolves.toBeUndefined()
      scope1.isDone()
      scope2.isDone()
    })

    it('should throw an exception encapsulating the failed revocation call exception when one revocation call fails', async () => {
      const scope1 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-refresh-token&token_type_hint=refresh_token')
        .reply(200, {})
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-access-token&token_type_hint=access_token')
        .reply(500, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      let didThrow = false
      try {
        await auth.logout({ accessToken: 'my-access-token', refreshToken: 'my-refresh-token' })
      } catch (e: any) {
        didThrow = true
        expect(e).toBeInstanceOf(CommercetoolsError)
        expect(e.data?.[0]).toBeInstanceOf(CommercetoolsError)
        expect(e.data?.[0].data).toEqual({
          code: 'ERR_BAD_RESPONSE',
          request: {
            data: {
              token: 'my-access-token',
              token_type_hint: 'access_token',
            },
            headers: {
              accept: 'application/json, text/plain, */*',
              'accept-encoding': 'gzip, compress, deflate, br',
              authorization: '********',
              'content-length': '50',
              'content-type': 'application/x-www-form-urlencoded',
              'user-agent': '@gradientedge/commercetools-utils',
              'x-correlation-id': expect.any(String),
            },
            method: 'post',
            url: 'https://auth.us-east-2.aws.commercetools.com/oauth/token/revoke',
            params: undefined,
          },
          response: {
            data: {},
            headers: {
              'content-type': 'application/json',
            },
            status: 500,
          },
        })
      }

      expect(didThrow).toBe(true)
      scope1.isDone()
      scope2.isDone()
    })

    it('should throw an exception encapsulating both failed revocation call exceptions when both revocation call fails', async () => {
      const scope1 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-refresh-token&token_type_hint=refresh_token')
        .reply(500, {})
      const scope2 = nock('https://auth.us-east-2.aws.commercetools.com')
        .post('/oauth/token/revoke', 'token=my-access-token&token_type_hint=access_token')
        .reply(500, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      let didThrow = false
      try {
        await auth.logout({ accessToken: 'my-access-token', refreshToken: 'my-refresh-token' })
      } catch (e: any) {
        didThrow = true
        expect(e).toBeInstanceOf(CommercetoolsError)
        expect(e.data?.[0]).toBeInstanceOf(CommercetoolsError)
        expect(e.data?.[0].data).toEqual({
          code: 'ERR_BAD_RESPONSE',
          request: {
            data: {
              token: 'my-access-token',
              token_type_hint: 'access_token',
            },
            headers: {
              accept: 'application/json, text/plain, */*',
              'accept-encoding': 'gzip, compress, deflate, br',
              authorization: '********',
              'content-length': '50',
              'content-type': 'application/x-www-form-urlencoded',
              'user-agent': '@gradientedge/commercetools-utils',
              'x-correlation-id': expect.any(String),
            },
            method: 'post',
            url: 'https://auth.us-east-2.aws.commercetools.com/oauth/token/revoke',
            params: undefined,
          },
          response: {
            data: {},
            headers: {
              'content-type': 'application/json',
            },
            status: 500,
          },
        })
        expect(e.data?.[1]).toBeInstanceOf(CommercetoolsError)
        expect(e.data?.[1].data).toEqual({
          code: 'ERR_BAD_RESPONSE',
          request: {
            data: {
              token: 'my-refresh-token',
              token_type_hint: 'refresh_token',
            },
            headers: {
              accept: 'application/json, text/plain, */*',
              'accept-encoding': 'gzip, compress, deflate, br',
              authorization: '********',
              'content-length': '52',
              'content-type': 'application/x-www-form-urlencoded',
              'user-agent': '@gradientedge/commercetools-utils',
              'x-correlation-id': expect.any(String),
            },
            method: 'post',
            url: 'https://auth.us-east-2.aws.commercetools.com/oauth/token/revoke',
          },
          response: {
            data: {},
            headers: {
              'content-type': 'application/json',
            },
            status: 500,
          },
        })
      }

      expect(didThrow).toBe(true)
      scope1.isDone()
      scope2.isDone()
    })
  })

  describe('post', () => {
    it('should POST to the expected URL and return the result when no errors occurs', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/test', 'name=Adrian&age=13.75')
        .reply(200, { test: 1 })
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.post('/test', {
        name: 'Adrian',
        age: 13.75,
      })

      scope.isDone()
      expect(grant).toEqual({ test: 1 })
    })

    it('should send a `User-Agent` HTTP header containing only the package name/version when the `systemIdentifier` config option is missing', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com')
        .matchHeader('User-Agent', '@gradientedge/commercetools-utils')
        .post('/oauth/test', '')
        .reply(200, { test: 1 })
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.post('/test', {})

      scope.isDone()
      expect(grant).toEqual({ test: 1 })
    })

    it('should send a `User-Agent` HTTP header containing the `systemIdentifier` when specified in the config', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com')
        .matchHeader('User-Agent', '@gradientedge/commercetools-utils (my-system v1.2.3)')
        .post('/oauth/test', '')
        .reply(200, { test: 1 })
      const auth = new CommercetoolsAuthApi({ ...defaultConfig, systemIdentifier: 'my-system v1.2.3' })

      const grant = await auth.post('/test', {})

      scope.isDone()
      expect(grant).toEqual({ test: 1 })
    })

    it('should throw an error when the underlying request errors', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/test', 'name=Adrian&age=13.75')
        .reply(500, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      await expect(
        auth.post('/test', {
          name: 'Adrian',
          age: 13.75,
        }),
      ).rejects.toThrow(new CommercetoolsError('Request failed with status code 500'))

      scope.isDone()
    })
  })

  describe('request timeout behaviour', () => {
    it('should timeout after the default timeout period', async () => {
      nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post('/oauth/token', 'grant_type=client_credentials&scope=scope1%3Atest-project-key')
        .delay(2000)
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      try {
        await auth.getClientGrant(['scope1'])
      } catch (e: any) {
        expect(e).toBeInstanceOf(CommercetoolsError)
        expect(e.toJSON()).toMatchObject({
          data: {
            code: 'ETIMEDOUT',
            request: {
              headers: {
                authorization: '********',
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': '@gradientedge/commercetools-utils',
              },
              method: 'post',
              url: 'https://auth.us-east-2.aws.commercetools.com/oauth/token',
            },
            response: {},
          },
          message: 'timeout of 1000ms exceeded',
        })
        return
      }

      assert.fail('auth.getClientGrant should have thrown due to timeout')
    })
  })

  describe('applyStore', () => {
    it('should return an unchanged path when a store is neither passed in or available on the config object', async () => {
      const auth = new CommercetoolsAuthApi(defaultConfig)

      expect(auth.applyStore('/test', null)).toBe('/test')
      expect(auth.applyStore('/test', undefined)).toBe('/test')
      expect(auth.applyStore('/test', '')).toBe('/test')
    })

    it('should apply the store key to the path when passed in to the method', async () => {
      const auth = new CommercetoolsAuthApi(defaultConfig)

      expect(auth.applyStore('/test', 'my-store')).toBe('/in-store/key=my-store/test')
    })

    it('should apply the store key to the path when passed in to the method, overriding the store on the config', async () => {
      const auth = new CommercetoolsAuthApi(defaultConfig)

      expect(auth.applyStore('/test', 'my-store-b')).toBe('/in-store/key=my-store-b/test')
    })

    it('should apply the store key set on the config when no store key is directly passed in to the method', async () => {
      const auth = new CommercetoolsAuthApi({ ...defaultConfig, storeKey: 'my-store-a' })

      expect(auth.applyStore('/test', undefined)).toBe('/in-store/key=my-store-a/test')
      expect(auth.applyStore('/test', null)).toBe('/in-store/key=my-store-a/test')
      expect(auth.applyStore('/test', '')).toBe('/in-store/key=my-store-a/test')
    })
  })

  describe('masking', () => {
    it('should mask the Authorization header when an error is thrown', async () => {
      nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true,
      })
        .post(
          '/oauth/test-project-key/customers/token',
          'username=jimmy%40gradientedge.com&password=testing&grant_type=password&scope=scope1%3Atest-project-key+scope2%3Atest-project-key',
        )
        .reply(500)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      try {
        await auth.login({
          username: 'jimmy@gradientedge.com',
          password: 'testing',
          scopes: ['scope1', 'scope2'],
        })
      } catch (error: any) {
        expect(error?.toJSON()).toEqual({
          data: {
            code: 'ERR_BAD_RESPONSE',
            request: {
              data: {
                grant_type: 'password',
                password: '********',
                scope: 'scope1:test-project-key scope2:test-project-key',
                username: 'jimmy@gradientedge.com',
              },
              headers: {
                accept: 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, compress, deflate, br',
                authorization: '********',
                'content-length': '128',
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': '@gradientedge/commercetools-utils',
                'x-correlation-id': expect.any(String),
              },
              method: 'post',
              url: 'https://auth.us-east-2.aws.commercetools.com/oauth/test-project-key/customers/token',
              params: undefined,
            },
            response: {
              data: '',
              status: 500,
            },
          },
          isCommercetoolsError: true,
          message: 'Request failed with status code 500',
          status: 500,
        })
      }
    })
  })
})
