import { CommercetoolsAuth, CommercetoolsAccessTokenResponse, Region } from '../../lib'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.US_EAST
}

const defaultResponseToken: CommercetoolsAccessTokenResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope:
    'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800
}

describe('CommercetoolsAuth', () => {
  describe('constructor', () => {
    it('should set the value of the endpoints based on the region configured', () => {
      const auth = new CommercetoolsAuth(defaultConfig)
      expect((auth as any).endpoints).toEqual({
        auth: 'https://auth.us-east-2.aws.commercetools.com',
        api: 'https://api.us-east-2.aws.commercetools.com'
      })
    })

    it('should use the expected defaults for optional config properties', () => {
      const auth = new CommercetoolsAuth(defaultConfig)
      expect((auth as any).config).toEqual({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        projectKey: 'test-project-key',
        refreshIfWithinSecs: 1800,
        region: 'us_east',
        timeout: 5
      })
    })

    it('should override the config defaults when config options are explicitly passed in', () => {
      const auth = new CommercetoolsAuth({
        ...defaultConfig,
        refreshIfWithinSecs: 2500,
        timeout: 10
      })
      expect((auth as any).config).toEqual({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        projectKey: 'test-project-key',
        refreshIfWithinSecs: 2500,
        region: 'us_east',
        timeout: 10
      })
    })

    it('should set the customer and client scopes on the config when passed in', () => {
      const auth = new CommercetoolsAuth({
        ...defaultConfig,
        customerScopes: ['scope1', 'scope2'],
        clientScopes: ['scope3', 'scope4']
      })
      expect((auth as any).config).toEqual({
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

  describe('getClientAccessToken', () => {
    it('should directly make a request to get a new access token when no access token is cached', async () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000').getTime())
      const auth = new CommercetoolsAuth(defaultConfig) as any
      auth.fetch = jest.fn().mockResolvedValue({ data: defaultResponseToken })
      const token = await auth.getClientAccessToken()
      expect(token).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        scopes: ['scope1', 'scope2', 'scope3'],
        expiresIn: 172800,
        expiresAt: new Date(1578044123000)
      })
      expect(auth.fetch).toHaveBeenCalledTimes(1)
      expect(auth.fetch).toHaveBeenCalledWith(
        'https://auth.us-east-2.aws.commercetools.com/oauth/token',
        {
          data: 'grant_type=client_credentials&scope=',
          headers: {
            Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'post'
        }
      )
      jest.useRealTimers()
    })
  })
})
