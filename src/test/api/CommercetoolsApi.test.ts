import path from 'path'
import nock from 'nock'
import { CommercetoolsApi, CommercetoolsError, Region } from '../../lib'
import { CommercetoolsGrantResponse } from '../../lib/auth/types'

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

const singleResultItem = { success: true }

const singleItemResponse = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [singleResultItem]
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

  describe('Categories', () => {
    describe('getCategoryById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/categories/my-category-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryById('my-category-id')

        expect(product).toEqual({ success: true })
      })
    })

    describe('getCategoryBySlug', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/categories?where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryBySlug('my-slug', 'en')

        expect(product).toEqual(singleResultItem)
      })
    })

    describe('queryCategories', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/categories')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryCategories()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/categories?staged=true&where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryCategories({
          staged: true,
          where: 'slug(en="my-slug")'
        })

        expect(product).toEqual(singleItemResponse)
      })
    })
  })

  describe('Products', () => {
    describe('getProductById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/products/my-product-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductById('my-product-id')

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

    describe('getProductProjectionBySlug', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections?where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionBySlug('my-slug', 'en')

        expect(product).toEqual(singleResultItem)
      })
    })

    describe('queryProductProjections', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductProjections()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections?staged=true&where=slug(en%3D%22my-product-slug%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductProjections({
          staged: true,
          where: 'slug(en="my-product-slug")'
        })

        expect(product).toEqual({ success: true })
      })
    })
  })

  describe('Cart', () => {
    describe('getActiveCart', () => {
      it('should make a GET request to the correct endpoint with the given access token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .get('/test-project-key/me/active-cart')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.getActiveCart('my-access-token')

        expect(response).toEqual({ success: true })
      })
    })

    describe('createCart', () => {
      it('should make a POST request to the correct endpoint, passing the provided data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/carts', { test: 1 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createCart('my-access-token', {
          test: 1
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('deleteActiveCart', () => {
      it('should get the active cart and delete that cart when it exists', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .get('/test-project-key/me/active-cart')
          .reply(200, { id: '123', version: 2 })
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .delete('/test-project-key/me/carts/123')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        await api.deleteActiveCart('my-access-token')
      })

      it('should not try to delete a cart if there is not an active cart', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .get('/test-project-key/me/active-cart')
          .reply(404, {})
        const api = new CommercetoolsApi(defaultConfig)

        await api.deleteActiveCart('my-access-token')
      })
    })

    describe('updateMyCart', () => {
      it('should call the expected endpoint with the correct parameters', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/carts/123', {
            version: 4,
            actions: [{ action: 'test', value: 789 }]
          })
          .reply(200, { test: true })
        const api = new CommercetoolsApi(defaultConfig)

        const result = await api.updateMyCart('my-access-token', '123', 4, [{ action: 'test', value: 789 }])

        expect(result).toEqual({ test: true })
      })
    })

    describe('setActiveCartShippingAddress', () => {
      it('should call the expected endpoint with the expected params', async () => {
        const cartJson = require(path.join(__dirname, './data/cart/active-1.json'))
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .get('/test-project-key/me/active-cart')
          .reply(200, cartJson)
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/carts/20a8f975-b075-4fa7-9a01-c9487154adff', {
            version: 4,
            actions: [
              {
                action: 'setShippingAddress',
                address: {
                  firstName: 'Jimmy',
                  city: 'Birmingham',
                  country: 'GB',
                  custom: {
                    type: {
                      key: 'customFieldsKey'
                    },
                    fields: {
                      addressLine1: 'Test address line 1'
                    }
                  }
                }
              }
            ]
          })
          .reply(200, { test: true })
        const api = new CommercetoolsApi(defaultConfig)

        const result = await api.setActiveCartShippingAddress('my-access-token', {
          firstName: 'Jimmy',
          city: 'Birmingham',
          country: 'GB',
          custom: {
            type: {
              key: 'customFieldsKey'
            },
            fields: {
              addressLine1: 'Test address line 1'
            }
          }
        })

        expect(result).toEqual({ test: true })
      })
    })
  })

  describe('Order', () => {
    describe('createMyOrderFromCart', () => {
      it('should make a POST request to the correct endpoint with the given access token and cart data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/orders', {
            id: 'my-cart-id',
            version: 2
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyOrderFromCart('my-access-token', 'my-cart-id', 2)

        expect(response).toEqual({ success: true })
      })
    })

    describe('getMyOrderById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .get('/test-project-key/me/orders/my-order-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getMyOrderById('my-access-token', 'my-order-id')

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Payment', () => {
    describe('createMyPayment', () => {
      it('should make a POST request to the correct endpoint with the given access token and payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/payments', {
            test: 1
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyPayment('my-access-token', { test: 1 })

        expect(response).toEqual({ success: true })
      })
    })
  })

  describe('request', () => {
    it('should send a `User-Agent` HTTP header when the `userAgent` config option is passed in', async () => {
      const scope = nock('https://api.europe-west1.gcp.commercetools.com')
        .matchHeader('User-Agent', 'Test user agent')
        .matchHeader('Authorization', 'Bearer test-access-token')
        .get('/test-project-key/test')
        .reply(200, { success: true })
      const api = new CommercetoolsApi({ ...defaultConfig, userAgent: 'Test user agent' })

      const response = await api.request({
        path: '/test',
        method: 'GET'
      })

      scope.isDone()
      expect(response).toEqual({ success: true })
    })
  })

  describe('Request timeout behaviour', () => {
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
