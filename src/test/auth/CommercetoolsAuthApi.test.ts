import nock from 'nock'
import {
  CommercetoolsAuthError,
  CommercetoolsGrantResponse,
  CommercetoolsRefreshGrantResponse,
  Region
} from '../../lib'
import { CommercetoolsAuthApi } from '../../lib/auth/CommercetoolsAuthApi'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.US_EAST
}

const defaultResponseToken: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'scope1:test-project-key customer_id:123456',
  expires_in: 172800
}

const defaultRefreshGrantResponse: CommercetoolsRefreshGrantResponse = {
  access_token: 'test-access-token',
  scope: 'scope1:test-project-key customer_id:123456',
  expires_in: 172800
}

describe('CommercetoolsAuthApi', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  describe('getClientGrant', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
      })
        .post('/oauth/token', 'grant_type=client_credentials&scope=scope1%3Atest-project-key')
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getClientGrant(['scope1'])

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('refreshGrant', () => {
    it('should call commercetools with the expected request', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
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
        encodedQueryParams: true
      })
        .post(
          '/oauth/test-project-key/customers/token',
          'username=jimmy%40gradientedge.com&password=testing&grant_type=password&scope=scope1%3Atest-project-key+scope2%3Atest-project-key'
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.login({
        username: 'jimmy@gradientedge.com',
        password: 'testing',
        scopes: ['scope1', 'scope2']
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('getAnonymousGrant', () => {
    it('should call commercetools with the expected request when no options are passed in', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
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
        encodedQueryParams: true
      })
        .post(
          '/oauth/test-project-key/anonymous/token',
          'grant_type=client_credentials&scope=scope1%3Atest-project-key'
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getAnonymousGrant({
        scopes: ['scope1']
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })

    it('should call commercetools with the expected request when scopes an anonymous id is passed in', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
      })
        .post(
          '/oauth/test-project-key/anonymous/token',
          'grant_type=client_credentials&scope=scope1%3Atest-project-key&anonymous_id=myAnonId'
        )
        .reply(200, defaultResponseToken)
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.getAnonymousGrant({
        anonymousId: 'myAnonId',
        scopes: ['scope1']
      })

      scope.isDone()
      expect(grant).toEqual(defaultResponseToken)
    })
  })

  describe('post', () => {
    it('should POST to the expected URL and return the result when no errors occurs', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
      })
        .post('/oauth/test', 'name=Adrian&age=13.75')
        .reply(200, { test: 1 })
      const auth = new CommercetoolsAuthApi(defaultConfig)

      const grant = await auth.post('/test', {
        name: 'Adrian',
        age: 13.75
      })

      scope.isDone()
      expect(grant).toEqual({ test: 1 })
    })

    it('should throw an error when the underlying request errors', async () => {
      const scope = nock('https://auth.us-east-2.aws.commercetools.com', {
        encodedQueryParams: true
      })
        .post('/oauth/test', 'name=Adrian&age=13.75')
        .reply(500, {})
      const auth = new CommercetoolsAuthApi(defaultConfig)

      await expect(
        auth.post('/test', {
          name: 'Adrian',
          age: 13.75
        })
      ).rejects.toThrow(
        new CommercetoolsAuthError('Unexpected status code: 500', {
          options: {
            body: 'name=Adrian&age=13.75',
            headers: {
              Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post'
          },
          responseText: '{}',
          url: 'https://auth.us-east-2.aws.commercetools.com/oauth/test'
        })
      )

      scope.isDone()
    })
  })
})
