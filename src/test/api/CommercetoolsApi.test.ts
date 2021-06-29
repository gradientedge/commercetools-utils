import nock from 'nock'
import { CommercetoolsApi, CommercetoolsError, Region } from '../../lib'
import { CommercetoolsGrantResponse } from '../../lib/auth/types'
import { ProductDraft, ProductUpdateAction } from '@commercetools/platform-sdk'

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.EUROPE_GCP,
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

  describe('Stores', () => {
    describe('getStoreById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/stores/my-store-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStoreById({ id: 'my-store-id' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getStoreByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/stores/key=my-store-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStoreByKey({ key: 'my-store-key' })

        expect(product).toEqual({ success: true })
      })
    })
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

    describe('getCategoryParents', () => {
      it('should make a GET request to the correct endpoint when using an id as criteria', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories/my-cat-id')
          .query({
            expand: 'ancestors[*]'
          })
          .reply(200, {
            id: 'my-cat-id',
            ancestors: [
              { id: 'ancestor-root', obj: { id: 'ancestor-root' } },
              { id: 'grandparent-cat', obj: { id: 'grandparent-cat' } },
              { id: 'parent-cat', obj: { id: 'parent-cat' } }
            ]
          })
        const api = new CommercetoolsApi(defaultConfig)

        const list = await api.getCategoryParents({ id: 'my-cat-id' })

        expect(list).toEqual([
          { id: 'ancestor-root' },
          { id: 'grandparent-cat' },
          { id: 'parent-cat' },
          {
            id: 'my-cat-id',
            ancestors: [{ id: 'ancestor-root' }, { id: 'grandparent-cat' }, { id: 'parent-cat' }]
          }
        ])
      })

      it('should make a GET request to the correct endpoint when using a key as criteria', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories/key=my-cat-key')
          .query({
            expand: 'ancestors[*]'
          })
          .reply(200, {
            key: 'my-cat-key',
            ancestors: [
              { id: 'ancestor-root', obj: { id: 'ancestor-root' } },
              { id: 'grandparent-cat', obj: { id: 'grandparent-cat' } },
              { id: 'parent-cat', obj: { id: 'parent-cat' } }
            ]
          })
        const api = new CommercetoolsApi(defaultConfig)

        const list = await api.getCategoryParents({ key: 'my-cat-key' })

        expect(list).toEqual([
          { id: 'ancestor-root' },
          { id: 'grandparent-cat' },
          { id: 'parent-cat' },
          {
            key: 'my-cat-key',
            ancestors: [{ id: 'ancestor-root' }, { id: 'grandparent-cat' }, { id: 'parent-cat' }]
          }
        ])
      })
    })

    describe('createCategory', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/categories', { name: { en: 'Test' }, slug: { en: 'test ' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createCategory({ data: { name: { en: 'Test' }, slug: { en: 'test ' } } })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateCategoryById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/categories/my-cat-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateCategoryById({ id: 'my-cat-id', data: { version: 1, actions: [] } })

        expect(category).toEqual({ success: true })
      })
    })

    describe('updateCategoryByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/categories/key=my-cat-key', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateCategoryByKey({ key: 'my-cat-key', data: { version: 1, actions: [] } })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteCategoryByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/categories/my-cat-id')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteCategoryById({ id: 'my-cat-id', version: 3 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteProductById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/my-prod-id')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteProductById({ id: 'my-prod-id', version: 2 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteProductByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/key=my-prod-key')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteProductByKey({ key: 'my-prod-key', version: 3 })

        expect(category).toEqual({ success: true })
      })

      it('should unpublish the product first before attempting to delete it when the `unpublish` option is true', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/key=my-prod-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)
        api.unpublishProductByKey = jest.fn().mockResolvedValue({
          version: 4
        })

        const category = await api.deleteProductByKey({ key: 'my-prod-key', version: 3, unpublish: true })

        expect(category).toEqual({ success: true })
      })
    })

    describe('unpublishProductById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/my-prod-id', { version: 2, actions: [{ action: 'unpublish' }] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.unpublishProductById({ id: 'my-prod-id', version: 2 })

        expect(category).toEqual({ success: true })
      })

      it('should unpublish the product first before attempting to delete it when the `unpublish` option is true', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/my-prod-id')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)
        api.unpublishProductById = jest.fn().mockResolvedValue({
          version: 4
        })

        const category = await api.deleteProductById({ id: 'my-prod-id', version: 3, unpublish: true })

        expect(category).toEqual({ success: true })
      })
    })

    describe('unpublishProductByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/key=my-prod-key', { version: 3, actions: [{ action: 'unpublish' }] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.unpublishProductByKey({ key: 'my-prod-key', version: 3 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteCategoryById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/categories/my-cat-id')
          .query({ version: 1 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteCategoryById({ id: 'my-cat-id', version: 1 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteCategoryByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/categories/key=my-cat-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteCategoryByKey({ key: 'my-cat-key', version: 4 })

        expect(category).toEqual({ success: true })
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

    describe('getProductByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/products/key=my-product-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductByKey({ key: 'my-product-key' })

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

        const product = await api.getProductProjectionById({ id: 'my-prod-guid' })

        expect(product).toEqual({ success: true })
      })

      it('should use the `params` parameter to form the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections/my-prod-guid?staged=true')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionById({ id: 'my-prod-guid', params: { staged: true } })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getProductProjectionByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections/key=my-prod-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionByKey({ key: 'my-prod-key' })

        expect(product).toEqual({ success: true })
      })

      it('should use the `params` parameter to form the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections/key=my-prod-key?staged=true')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionByKey({ key: 'my-prod-key', params: { staged: true } })

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

    describe('searchProductProjections', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections/search')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.searchProductProjections({})

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true
        })
          .get('/test-project-key/product-projections/search?staged=true&where=slug(en%3D%22my-product-slug%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.searchProductProjections({
          staged: true,
          where: 'slug(en="my-product-slug")'
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('createProduct', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products', { test: 1 })
          .query({
            testParam: 1
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createProduct({
          data: { test: 1 } as unknown as ProductDraft,
          params: { testParam: 1 }
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateProductById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/my-prod-id', { actions: [{ test: 1 }], version: 2 })
          .query({
            testParam: 1
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateProductById({
          id: 'my-prod-id',
          data: {
            actions: [{ test: 1 }] as unknown as ProductUpdateAction[],
            version: 2
          },
          params: { testParam: 1 }
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateProductByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/key=my-prod-key', { actions: [{ test: 1 }], version: 3 })
          .query({
            testParam: 1
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateProductByKey({
          key: 'my-prod-key',
          data: { actions: [{ test: 1 }] as unknown as ProductUpdateAction[], version: 3 },
          params: { testParam: 1 }
        })

        expect(product).toEqual({ success: true })
      })
    })
  })

  describe('Cart', () => {
    describe('with customer access token', () => {
      describe('getMyActiveCart', () => {
        it('should make a GET request to the correct endpoint with the given access token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer customer-access-token'
            }
          })
            .get('/test-project-key/me/active-cart')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.getMyActiveCart({ accessToken: 'customer-access-token' })

          expect(response).toEqual({ success: true })
        })
      })

      describe('createMyCart', () => {
        it('should make a POST request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token'
            }
          })
            .post('/test-project-key/me/carts', { currency: 'GBP' })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createMyCart({
            accessToken: 'customer-access-token',
            data: {
              currency: 'GBP'
            }
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('deleteMyActiveCart', () => {
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

          await api.deleteMyActiveCart({ accessToken: 'my-access-token' })
        })

        it('should throw an error if there is not an active cart', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token'
            }
          })
            .get('/test-project-key/me/active-cart')
            .reply(404, {})
          const api = new CommercetoolsApi(defaultConfig)

          await expect(api.deleteMyActiveCart({ accessToken: 'my-access-token' })).rejects.toThrow(
            'Request failed with status code 404'
          )
        })
      })

      describe('updateMyActiveCart', () => {
        it('should call the expected endpoint with the correct parameters', async () => {
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
            .post('/test-project-key/me/carts/123', {
              version: 2,
              actions: [{ action: 'setCountry', country: 'GB' }]
            })
            .reply(200, { test: true })
          const api = new CommercetoolsApi(defaultConfig)

          const result = await api.updateMyActiveCart({
            accessToken: 'my-access-token',
            actions: [{ action: 'setCountry', country: 'GB' }]
          })

          expect(result).toEqual({ test: true })
        })
      })
    })

    describe('without customer token', () => {
      describe('createCart', () => {
        it('should make a POST request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .post('/test-project-key/carts', { currency: 'GBP' })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createCart({
            data: {
              currency: 'GBP'
            }
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('getCartById', () => {
        it('should make a GET request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .get('/test-project-key/carts/test-cart-id')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.getCartById({ id: 'test-cart-id' })
        })
      })

      describe('updateCartById', () => {
        it('should make a POST request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .post('/test-project-key/carts/test-cart-id', { version: 1, actions: [] })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.updateCartById({ id: 'test-cart-id', version: 1, actions: [] })
        })
      })

      describe('deleteCartById', () => {
        it('should get the active cart and delete that cart when it exists', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .delete('/test-project-key/carts/test-cart-id')
            .query({ version: 1 })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.deleteCartById({ id: 'test-cart-id', version: 1 })
        })
      })
    })
  })

  describe('Order', () => {
    describe('createMyOrderFromActiveCart', () => {
      it('should make a POST request to the correct endpoint with the given access token and cart data', async () => {
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
          .post('/test-project-key/me/orders', {
            id: '123',
            version: 2
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyOrderFromActiveCart({ accessToken: 'my-access-token' })

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

        const order = await api.getMyOrderById({ id: 'my-order-id', accessToken: 'my-access-token' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getOrderById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/orders/test-order-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getOrderById({ id: 'test-order-id' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('updateOrderById', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .post('/test-project-key/orders/test-order-id', {
            version: 2,
            actions: []
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.updateOrderById({ id: 'test-order-id', data: { version: 2, actions: [] } })

        expect(order).toEqual({ success: true })
      })
    })

    describe('deleteOrderById', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .delete('/test-project-key/orders/test-order-id')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.deleteOrderById({ id: 'test-order-id', version: 2 })

        expect(order).toEqual({ success: true })
      })
    })

    describe('deleteOrderByOrderNumber', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .delete('/test-project-key/orders/order-number=test-order-num')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.deleteOrderByOrderNumber({ orderNo: 'test-order-num', version: 2 })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryOrders', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/orders')
          .query({
            where: 'orderNumber="1234"'
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryOrders({
          params: {
            where: 'orderNumber="1234"'
          }
        })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Payment', () => {
    describe('createMyPayment', () => {
      it('should make a POST request to the correct endpoint with the given access token and payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token'
          }
        })
          .post('/test-project-key/me/payments', { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyPayment({
          accessToken: 'my-access-token',
          data: { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } }
        })

        expect(response).toEqual({ success: true })
      })
    })
  })

  describe('Customer', () => {
    describe('getCustomerById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/customers/test-customer-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomerById({ id: 'test-customer-id' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getCustomerByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/customers/key=test-customer-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomerByKey({ key: 'test-customer-key' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getCustomerByPasswordToken', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/customers/password-token=test-password-token')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomerByPasswordToken({ token: 'test-password-token' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryCustomers', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/customers')
          .query({
            where: 'email="jimmy@gradientedge.com"'
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryCustomers({
          params: {
            where: 'email="jimmy@gradientedge.com"'
          }
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('Customer', () => {
      describe('createAccount', () => {
        it('should make a POST request to the correct endpoint with the expected data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .post('/test-project-key/customers', {
              email: 'test@test.com',
              password: 'testing'
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createAccount({
            data: {
              email: 'test@test.com',
              password: 'testing'
            }
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('createMyAccount', () => {
        it('should make a POST request to the correct endpoint with the expected data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token'
            }
          })
            .post('/test-project-key/me/signup', {
              email: 'test@test.com',
              password: 'testing'
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createMyAccount({
            accessToken: 'customer-access-token',
            data: {
              email: 'test@test.com',
              password: 'testing'
            }
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('deleteCustomerById', () => {
        it('should make a DELETE request to the correct endpoint with the expected data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .delete('/test-project-key/customers/customer-id')
            .query({ version: 2 })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.deleteCustomerById({
            id: 'customer-id',
            version: 2
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('deleteCustomerByKey', () => {
        it('should make a DELETE request to the correct endpoint with the expected data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .delete('/test-project-key/customers/key=customer-key')
            .query({ version: 3 })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.deleteCustomerByKey({
            key: 'customer-key',
            version: 3
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('login', () => {
        it('should make a POST request to the correct endpoint with the expected data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .post('/test-project-key/login', {
              email: 'test@test.com',
              password: 'testing'
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.login({
            data: {
              email: 'test@test.com',
              password: 'testing'
            }
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('getMyAccount', () => {
        it('should make a GET request to the correct endpoint using the customer token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token'
            }
          })
            .get('/test-project-key/me')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const product = await api.getMyAccount({ accessToken: 'customer-access-token' })

          expect(product).toEqual({ success: true })
        })
      })

      describe('updateMyAccount', () => {
        it('should make a POST request to the correct endpoint using the customer token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token'
            }
          })
            .post('/test-project-key/me', {
              version: 4,
              actions: []
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const product = await api.updateMyAccount({
            accessToken: 'customer-access-token',
            data: {
              version: 4,
              actions: []
            }
          })

          expect(product).toEqual({ success: true })
        })
      })

      describe('getPasswordResetToken', () => {
        it('should make a POST request to the correct endpoint using the customer token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token'
            }
          })
            .post('/test-project-key/customers/password-token', {
              email: 'jimmy@gradientedge.com',
              ttlMinutes: 60
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const product = await api.getPasswordResetToken({
            data: {
              email: 'jimmy@gradientedge.com',
              ttlMinutes: 60
            }
          })

          expect(product).toEqual({ success: true })
        })
      })

      describe('resetMyPassword', () => {
        it('should make a POST request to the correct endpoint using the customer token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token'
            }
          })
            .post('/test-project-key/me/password/reset', {
              tokenValue: 'test-token',
              newPassword: 'test123'
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const product = await api.resetMyPassword({
            accessToken: 'my-access-token',
            data: {
              tokenValue: 'test-token',
              newPassword: 'test123'
            }
          })

          expect(product).toEqual({ success: true })
        })
      })

      describe('changeMyPassword', () => {
        it('should make a POST request to the correct endpoint using the customer token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token'
            }
          })
            .post('/test-project-key/me/password', {
              version: 1,
              currentPassword: 'myOldPassword',
              newPassword: 'myNewPassword'
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const product = await api.changeMyPassword({
            accessToken: 'my-access-token',
            data: {
              version: 1,
              currentPassword: 'myOldPassword',
              newPassword: 'myNewPassword'
            }
          })

          expect(product).toEqual({ success: true })
        })
      })
    })
  })

  describe('Product Types', () => {
    describe('getProductTypeById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/product-types/my-product-type-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getProductTypeById({ id: 'my-product-type-id ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getProductTypeByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/product-types/key=my-product-type-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getProductTypeByKey({ key: 'my-product-type-key ' })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Types', () => {
    describe('getTypeById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/types/my-type-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getTypeById({ id: 'my-type-id ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getTypeByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/types/key=my-type-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getTypeByKey({ key: 'my-type-key ' })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Custom Objects', () => {
    describe('getCustomObject', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .get('/test-project-key/custom-objects/my-container/my-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomObject({ container: 'my-container', key: 'my-key' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('saveCustomObject', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .post('/test-project-key/custom-objects', { container: 'my-container', key: 'my-key', value: { test: 1 } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.saveCustomObject({
          data: { container: 'my-container', key: 'my-key', value: { test: 1 } }
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('deleteCustomObject', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token'
          }
        })
          .delete('/test-project-key/custom-objects/my-container/my-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.deleteCustomObject({ container: 'my-container', key: 'my-key' })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('graphql', () => {
    it('should call the /graphql endpoint with the data passed in, using the client access token', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        reqheaders: {
          authorization: 'Bearer test-access-token'
        }
      })
        .post('/test-project-key/graphql', {
          query: 'products { results { id } }'
        })
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.graphql({
        data: {
          query: 'products { results { id } }'
        }
      })

      expect(response).toEqual({ success: true })
    })

    it('should call the /graphql endpoint with the data passed in, using the passed in access token', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        reqheaders: {
          authorization: 'Bearer customer-access-token'
        }
      })
        .post('/test-project-key/graphql', {
          query: 'products { results { id } }'
        })
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.graphql({
        data: {
          query: 'products { results { id } }'
        },
        accessToken: 'customer-access-token'
      })

      expect(response).toEqual({ success: true })
    })
  })

  describe('applyStore', () => {
    it('should return an unchanged path when a store is neither passed in or available on the config object', async () => {
      const api = new CommercetoolsApi(defaultConfig)

      expect(api.applyStore('/test', null)).toBe('/test')
      expect(api.applyStore('/test', undefined)).toBe('/test')
      expect(api.applyStore('/test', '')).toBe('/test')
    })

    it('should apply the store key to the path when passed in to the method', async () => {
      const api = new CommercetoolsApi(defaultConfig)

      expect(api.applyStore('/test', 'my-store')).toBe('/in-store/key=my-store/test')
    })

    it('should apply the store key to the path when passed in to the method, overriding the store on the config', async () => {
      const api = new CommercetoolsApi({ ...defaultConfig, storeKey: 'my-store-a' })

      expect(api.applyStore('/test', 'my-store-b')).toBe('/in-store/key=my-store-b/test')
    })

    it('should apply the store key set on the config when no store key is directly passed in to the method', async () => {
      const api = new CommercetoolsApi({ ...defaultConfig, storeKey: 'my-store-a' })

      expect(api.applyStore('/test', undefined)).toBe('/in-store/key=my-store-a/test')
      expect(api.applyStore('/test', null)).toBe('/in-store/key=my-store-a/test')
      expect(api.applyStore('/test', '')).toBe('/in-store/key=my-store-a/test')
    })
  })

  describe('request', () => {
    it('should send a `User-Agent` HTTP header containing only the package name/version when the `systemIdentifier` config option is missing', async () => {
      const scope = nock('https://api.europe-west1.gcp.commercetools.com')
        .matchHeader('User-Agent', '@gradientedge/commercetools-utils')
        .matchHeader('Authorization', 'Bearer test-access-token')
        .get('/test-project-key/test')
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.request({
        path: '/test',
        method: 'GET'
      })

      scope.isDone()
      expect(response).toEqual({ success: true })
    })

    it('should send a `User-Agent` HTTP header containing the `systemIdentifier` when specified in the config', async () => {
      const scope = nock('https://api.europe-west1.gcp.commercetools.com')
        .matchHeader('User-Agent', '@gradientedge/commercetools-utils (my-system)')
        .matchHeader('Authorization', 'Bearer test-access-token')
        .get('/test-project-key/test')
        .reply(200, { success: true })
      const api = new CommercetoolsApi({ ...defaultConfig, systemIdentifier: 'my-system' })

      const response = await api.request({
        path: '/test',
        method: 'GET'
      })

      scope.isDone()
      expect(response).toEqual({ success: true })
    })

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
                'User-Agent': '@gradientedge/commercetools-utils'
              },
              method: 'get',
              url: 'https://api.europe-west1.gcp.commercetools.com/test-project-key/products/cb3c563c-98dd-4b11-8694-8d17b15fa844'
            },
            response: {}
          },
          message: 'timeout of 1000ms exceeded'
        })
        return
      }
      fail('api.getProductById should have thrown due to timeout')
    })

    it('should send an `X-Correlation-ID` HTTP header when sent in the via a request option', async () => {
      const scope = nock('https://api.europe-west1.gcp.commercetools.com')
        .matchHeader('User-Agent', '@gradientedge/commercetools-utils')
        .matchHeader('Authorization', 'Bearer test-access-token')
        .matchHeader('X-Correlation-ID', 'my-correlation-id')
        .get('/test-project-key/test')
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.request({
        path: '/test',
        method: 'GET',
        correlationId: 'my-correlation-id'
      })

      scope.isDone()
      expect(response).toEqual({ success: true })
    })
  })
})
