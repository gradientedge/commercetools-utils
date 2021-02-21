import nock from 'nock'
import { CommercetoolsApi, CommercetoolsError, CommercetoolsGrantResponse, Region } from '../../lib'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.EUROPE_WEST,
  clientScopes: ['defaultClientScope1'],
  timeoutMs: 1000
}

const defaultClientGrantResponse: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800
}

describe('CommercetoolsApi', () => {
  beforeAll(() => {
    nock.disableNetConnect()
    nock('https://auth.europe-west1.gcp.commercetools.com', {
      encodedQueryParams: true
    })
      .persist()
      .post('/oauth/token', 'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key')
      .reply(200, defaultClientGrantResponse)
  })

  describe('getProduct', () => {
    it('should make a GET request to the correct endpoint', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        encodedQueryParams: true
      })
        .get('/test-project-key/products/cb3c563c-98dd-4b11-8694-8d17b15fa844')
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const product = await api.getProductById('cb3c563c-98dd-4b11-8694-8d17b15fa844')

      expect(product).toEqual({ success: true })
    })
  })

  describe('getProductProjectionById', () => {
    it('should make a GET request to the correct endpoint', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        encodedQueryParams: true
      })
        .get('/test-project-key/product-projections/my-prod-guid')
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const product = await api.getProductProjectionById('my-prod-guid')

      expect(product).toEqual({ success: true })
    })

    it('should use the `params` parameter to form the querystring', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        encodedQueryParams: true
      })
        .get('/test-project-key/product-projections/my-prod-guid?staged=true')
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const product = await api.getProductProjectionById('my-prod-guid', { staged: true })

      expect(product).toEqual({ success: true })
    })
  })

  describe('request timeout behaviour', () => {
    it('should time after the default timeout period', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        encodedQueryParams: true
      })
        .get('/test-project-key/products/cb3c563c-98dd-4b11-8694-8d17b15fa844')
        .delay(2000)
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      try {
        await api.getProductById('cb3c563c-98dd-4b11-8694-8d17b15fa844')
      } catch (e) {
        expect(e).toBeInstanceOf(CommercetoolsError)
        expect(e.toJSON()).toEqual({
          data: {
            code: 'ECONNABORTED',
            request: {
              headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: 'Bearer test-access-token',
                'User-Agent': 'axios/0.21.1'
              },
              method: 'get',
              url:
                'https://api.europe-west1.gcp.commercetools.com/test-project-key/products/cb3c563c-98dd-4b11-8694-8d17b15fa844'
            },
            response: {}
          },
          message: 'timeout of 1000ms exceeded'
        })
        return
      }
      fail('api.getProductById should have thrown due to timeout')
    })
  })
})
