import { CommercetoolsAuth, CommercetoolsAccessTokenResponse, Region } from '../../lib'
import ResolvedValue = jest.ResolvedValue

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
  describe('public methods', () => {
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

      it('should use the configured client scopes when making a request', async () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000').getTime())
        const auth = new CommercetoolsAuth({
          ...defaultConfig,
          clientScopes: ['test-scope1', 'test-scope2']
        }) as any
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
            data:
              'grant_type=client_credentials&scope=test-scope1%3Atest-project-key+test-scope2%3Atest-project-key',
            headers: {
              Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post'
          }
        )
        jest.useRealTimers()
      })

      it('should return the cached token if it has not expired', async () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000').getTime())
        const auth = new CommercetoolsAuth(defaultConfig) as any
        auth.fetch = jest.fn().mockResolvedValue({ data: defaultResponseToken })
        await auth.getClientAccessToken()

        // Set the date/time ahead by 1 day
        jest.setSystemTime(new Date('2020-01-02T09:35:23.000').getTime())

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

      it('should attempt to refresh the token when a cached token has expired', async () => {
        // This will be the date/time that we use to get the expiry date of the initial token
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000').getTime())

        const auth = new CommercetoolsAuth(defaultConfig) as any
        auth.fetch = jest.fn().mockResolvedValue({ data: defaultResponseToken })
        let token = await auth.getClientAccessToken()
        const refreshToken = token.refreshToken

        // Set the fake timer forward by 3 days, which means the system should
        // see the existing access token as having expired.
        jest.setSystemTime(new Date('2020-01-04T01:25:46.000').getTime())

        auth.fetch.mockClear()

        token = await auth.getClientAccessToken()

        expect(token).toEqual({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date('2020-01-06T01:25:46.000')
        })

        expect(auth.fetch).toHaveBeenCalledTimes(1)
        expect(auth.fetch).toHaveBeenCalledWith(
          'https://auth.us-east-2.aws.commercetools.com/oauth/token',
          {
            data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
            headers: {
              Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post'
          }
        )
        jest.useRealTimers()
      })

      it('should attempt to refresh the token when the expiry time of the cached token in within the configured range', async () => {
        // This will be the date/time that we use to get the expiry date of the initial token
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000').getTime())

        // Refresh if within 1 hour of expiry time
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any
        auth.fetch = jest.fn().mockResolvedValue({ data: defaultResponseToken })
        let token = await auth.getClientAccessToken()
        const refreshToken = token.refreshToken

        // Set the fake timer forward by 3 days, which means the system should
        // see the existing access token as having expired.
        jest.setSystemTime(new Date('2020-01-03T09:01:12.000').getTime())

        auth.fetch.mockClear()

        token = await auth.getClientAccessToken()

        expect(token).toEqual({
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          scopes: ['scope1', 'scope2', 'scope3'],
          expiresIn: 172800,
          expiresAt: new Date('2020-01-05T09:01:12.000Z')
        })

        expect(auth.fetch).toHaveBeenCalledTimes(1)
        expect(auth.fetch).toHaveBeenCalledWith(
          'https://auth.us-east-2.aws.commercetools.com/oauth/token',
          {
            data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
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

    describe('refreshClientAccessToken', () => {
      it('should throw an error if there is not a cached access token', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any
        await expect(auth.refreshClientAccessToken()).rejects.toThrowError(
          'No current access token to refresh'
        )
      })

      it('should return the updated access token when successful', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any

        auth.fetch = jest.fn().mockResolvedValue({ data: defaultResponseToken })

        await auth.getClientAccessToken()

        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-05T10:23:17.000Z').getTime())

        auth.fetch = jest.fn().mockResolvedValue({
          data: {
            access_token: 'test-refreshed-access-token',
            expires_in: 1234567,
            scope: `test-scope1:${defaultConfig.projectKey} test-scope2:${defaultConfig.projectKey}`
          }
        })

        const token = await auth.refreshClientAccessToken()

        expect(token).toEqual({
          accessToken: 'test-refreshed-access-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-19T17:19:24.000Z'),
          scopes: [`test-scope1`, `test-scope2`]
        })

        jest.useRealTimers()
      })
    })

    describe('refreshCustomerAccessToken', () => {
      it('should request a client access token before making the refresh customer access token request, if no cached client access token exists', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any

        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

        auth.fetch = jest.fn()

        // Resolving the client access token request
        auth.fetch.mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)

        // Resolving the customer access token request
        auth.fetch.mockResolvedValueOnce({
          data: {
            access_token: 'test-customer-access-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
          }
        } as ResolvedValue<unknown>)

        const customerToken = await auth.refreshCustomerAccessToken('customer-refresh-token')

        expect(auth.fetch).toHaveBeenNthCalledWith(
          1,
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

        expect(auth.fetch).toHaveBeenNthCalledWith(
          2,
          'https://auth.us-east-2.aws.commercetools.com/oauth/token',
          {
            data: 'grant_type=refresh_token&refresh_token=customer-refresh-token',
            headers: {
              Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post'
          }
        )

        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`]
        })

        jest.useRealTimers()
      })

      it('should immediately make the refresh customer access token request if a cached client access token exists', async () => {
        const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any

        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

        auth.fetch = jest.fn()

        // Resolving the client access token request
        auth.fetch.mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)
        await auth.getClientAccessToken()
        auth.fetch.mockReset()

        // Resolving the customer access token request
        auth.fetch.mockResolvedValueOnce({
          data: {
            access_token: 'test-customer-access-token',
            expires_in: 1234567,
            scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
          }
        } as ResolvedValue<unknown>)

        const customerToken = await auth.refreshCustomerAccessToken('customer-refresh-token')

        expect(auth.fetch).toHaveBeenCalledTimes(1)
        expect(auth.fetch).toHaveBeenCalledWith(
          'https://auth.us-east-2.aws.commercetools.com/oauth/token',
          {
            data: 'grant_type=refresh_token&refresh_token=customer-refresh-token',
            headers: {
              Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post'
          }
        )

        expect(customerToken).toEqual({
          accessToken: 'test-customer-access-token',
          expiresIn: 1234567,
          expiresAt: new Date('2020-01-20T19:11:24.000Z'),
          scopes: [`customer-test-scope1`, `customer-test-scope2`]
        })

        jest.useRealTimers()
      })
    })

    describe('login', () => {
      describe('cached client access token does not exist', () => {
        it('should request a client access token before making the login request', async () => {
          const auth = new CommercetoolsAuth({ ...defaultConfig, refreshIfWithinSecs: 3600 }) as any

          jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

          auth.fetch = jest.fn()

          // Resolving the client access token request
          auth.fetch.mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)

          // Resolving the customer access token request for the login request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword',
            scopes: ['scope1']
          })

          expect(auth.fetch).toHaveBeenNthCalledWith(
            1,
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

          expect(auth.fetch).toHaveBeenNthCalledWith(
            2,
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/customers/token`,
            {
              data:
                'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })

          jest.useRealTimers()
        })
      })

      describe('cached client access token exists', () => {
        let auth: any

        beforeEach(async () => {
          auth = new CommercetoolsAuth(defaultConfig) as any

          jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

          // Resolving the client access token request
          auth.fetch = jest
            .fn()
            .mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)
          await auth.getClientAccessToken()
          auth.fetch.mockReset()
        })

        afterEach(() => {
          jest.useRealTimers()
        })

        it('should immediately make the login request', async () => {
          // Resolving the customer access token request for the login request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword',
            scopes: ['scope1']
          })

          expect(auth.fetch).toHaveBeenCalledTimes(1)
          expect(auth.fetch).toHaveBeenCalledWith(
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/customers/token`,
            {
              data:
                'username=testUsername&password=testPassword&grant_type=password&scope=scope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
        })

        it('should throw an error if no customer scopes have been defined', async () => {
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
          const auth = new CommercetoolsAuth({
            ...defaultConfig,
            customerScopes: ['configuredScope1']
          }) as any

          auth.fetch = jest
            .fn()
            .mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)
          await auth.getClientAccessToken()
          auth.fetch.mockReset()

          // Resolving the customer access token request for the login request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.login({
            username: 'testUsername',
            password: 'testPassword'
          })

          expect(auth.fetch).toHaveBeenCalledTimes(1)
          expect(auth.fetch).toHaveBeenCalledWith(
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/customers/token`,
            {
              data:
                'username=testUsername&password=testPassword&grant_type=password&scope=configuredScope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
        })
      })
    })

    describe('getAnonymousToken', () => {
      describe('cached client access token does not exist', () => {
        it('should request a client access token before making the anonymous customer request', async () => {
          const auth = new CommercetoolsAuth(defaultConfig) as any

          jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

          auth.fetch = jest.fn()

          // Resolving the client access token request
          auth.fetch.mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)

          // Resolving the customer access token request for the login request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.getAnonymousToken({
            scopes: ['scope1']
          })

          expect(auth.fetch).toHaveBeenNthCalledWith(
            1,
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

          expect(auth.fetch).toHaveBeenNthCalledWith(
            2,
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/anonymous/token`,
            {
              data: 'grant_type=client_credentials&scope=scope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })

          jest.useRealTimers()
        })
      })

      describe('cached client access token exists', () => {
        let auth: any

        beforeEach(async () => {
          auth = new CommercetoolsAuth(defaultConfig) as any

          jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-06T12:15:17.000Z').getTime())

          // Resolving the client access token request
          auth.fetch = jest
            .fn()
            .mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)
          await auth.getClientAccessToken()
          auth.fetch.mockReset()
        })

        afterEach(() => {
          jest.useRealTimers()
        })

        it('should immediately make the anonymous customer request', async () => {
          // Resolving the customer access token request for the anonymous customer request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.getAnonymousToken({
            scopes: ['scope1']
          })

          expect(auth.fetch).toHaveBeenCalledTimes(1)
          expect(auth.fetch).toHaveBeenCalledWith(
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/anonymous/token`,
            {
              data: 'grant_type=client_credentials&scope=scope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
        })

        it('should throw an error if no customer scopes have been defined', async () => {
          await expect(auth.getAnonymousToken()).rejects.toThrowError(
            'Customer scopes must be set on either the `options` parameter ' +
              'of this `login` method, or on the `customerScopes` property of the ' +
              '`CommercetoolsAuth` constructor'
          )
        })

        it('should use the customer scopes on the config if none passed in', async () => {
          const auth = new CommercetoolsAuth({
            ...defaultConfig,
            customerScopes: ['configuredScope1']
          }) as any

          auth.fetch = jest
            .fn()
            .mockResolvedValueOnce({ data: defaultResponseToken } as ResolvedValue<unknown>)
          await auth.getClientAccessToken()
          auth.fetch.mockReset()

          // Resolving the customer access token request for the login request
          auth.fetch.mockResolvedValueOnce({
            data: {
              access_token: 'test-customer-access-token',
              expires_in: 1234567,
              scope: `customer-test-scope1:${defaultConfig.projectKey} customer-test-scope2:${defaultConfig.projectKey}`
            }
          } as ResolvedValue<unknown>)

          const customerToken = await auth.getAnonymousToken()

          expect(auth.fetch).toHaveBeenCalledTimes(1)
          expect(auth.fetch).toHaveBeenCalledWith(
            `https://auth.us-east-2.aws.commercetools.com/oauth/${defaultConfig.projectKey}/anonymous/token`,
            {
              data: 'grant_type=client_credentials&scope=configuredScope1%3Atest-project-key',
              headers: {
                Authorization: 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'post'
            }
          )

          expect(customerToken).toEqual({
            accessToken: 'test-customer-access-token',
            expiresIn: 1234567,
            expiresAt: new Date('2020-01-20T19:11:24.000Z'),
            scopes: [`customer-test-scope1`, `customer-test-scope2`]
          })
        })
      })
    })
  })
})
