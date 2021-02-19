import nock from 'nock'
import { CommercetoolsApi } from '../../lib/api/CommercetoolsApi'
import { CommercetoolsGrantResponse, Region } from '../../lib'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.EUROPE_WEST,
  clientScopes: ['defaultClientScope1']
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
    it('should return the correct product', async () => {
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
})
