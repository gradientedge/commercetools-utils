import nock from 'nock'
import { CommercetoolsApi, CommercetoolsApiConfig, Region } from '../../lib/index.js'
import { CommercetoolsGrantResponse } from '../../lib/auth/types.js'

const AUTH_URL = 'https://auth.europe-west1.gcp.commercetools.com'
const API_URL = 'https://api.europe-west1.gcp.commercetools.com'

const config: CommercetoolsApiConfig = {
  projectKey: 'test-project',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.EUROPE_GCP,
  clientScopes: ['manage_orders'],
  timeoutMs: 1_000,
}

const grantResponse: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'manage_orders:test-project',
  expires_in: 172800,
}

function mockAuth(): void {
  nock(AUTH_URL, { encodedQueryParams: true }).persist().post('/oauth/token').reply(200, grantResponse)
}

describe('per-request timeout override', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.enableNetConnect('127.0.0.1')
    mockAuth()
  })

  afterAll(() => {
    nock.cleanAll()
    nock.disableNetConnect()
  })

  it('should timeout at the instance-level default (1s) when no per-request override is given', async () => {
    nock(API_URL).get('/test-project/orders').query(true).delay(2_000).reply(200, { results: [], total: 0 })

    const api = new CommercetoolsApi(config)

    await expect(api.queryOrders({ params: { limit: 1 }, retry: { maxRetries: 0, delayMs: 0 } })).rejects.toThrow(
      /timeout/i,
    )
  }, 10_000)

  it('should NOT timeout at the instance default when a per-request timeoutMs override exceeds the delay', async () => {
    nock(API_URL)
      .get('/test-project/orders')
      .query(true)
      .delay(2_000)
      .reply(200, { results: [{ id: 'order-1' }], total: 1 })

    const api = new CommercetoolsApi(config)

    const result = await api.queryOrders({
      params: { limit: 1 },
      timeoutMs: 5_000,
      aggregateTimeoutMs: 5_000,
    })

    expect(result.results).toEqual([{ id: 'order-1' }])
  }, 10_000)
})
