import nock from 'nock'
import { CommercetoolsApi, CommercetoolsApiConfig, CommercetoolsError, Region } from '../../lib'
import { CommercetoolsGrantResponse } from '../../lib/auth/types'
import type { CustomerUpdateAction, ProductDraft, ProductUpdateAction } from '../../lib'

const defaultConfig: CommercetoolsApiConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.EUROPE_GCP,
  clientScopes: ['defaultClientScope1'],
  timeoutMs: 1000,
}

const defaultClientGrantResponse: CommercetoolsGrantResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope: 'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800,
}

const singleResultItem = { success: true }

const singleItemResponse = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [singleResultItem],
}

const zeroItemResponse = {
  limit: 20,
  offset: 0,
  count: 0,
  total: 0,
  results: [],
}

describe('CommercetoolsApi', () => {
  let originalProcessEnv = {}

  beforeAll(() => {
    nock.disableNetConnect()
    nock('https://auth.europe-west1.gcp.commercetools.com', {
      encodedQueryParams: true,
    })
      .persist()
      .post('/oauth/token', 'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key')
      .reply(200, defaultClientGrantResponse)
    originalProcessEnv = { ...process.env }
  })

  beforeEach(() => {
    process.env = { ...originalProcessEnv }
  })

  describe('constructor', () => {
    it('should set the `config` member property with the correct values', () => {
      const api = new CommercetoolsApi({ ...defaultConfig, customerScopes: ['manage_my_profile'] })

      expect(api.config).toEqual({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        clientScopes: ['defaultClientScope1'],
        customerScopes: ['manage_my_profile'],
        projectKey: 'test-project-key',
        region: 'europe_gcp',
        timeoutMs: 1000,
      })
    })

    it('should set the `config` member property of the local `CommercetoolsAuth` instance with the correct values', () => {
      const api = new CommercetoolsApi({ ...defaultConfig, customerScopes: ['manage_my_profile'] })

      expect(api.auth.config).toEqual({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        clientScopes: ['defaultClientScope1'],
        customerScopes: ['manage_my_profile'],
        projectKey: 'test-project-key',
        region: 'europe_gcp',
        timeoutMs: 1000,
        refreshIfWithinSecs: 1800,
      })
    })

    it('should bubble up the error if `validateConfig` method throws an error', () => {
      expect(() => new CommercetoolsApi({ ...defaultConfig, projectKey: '' })).toThrowError()
    })
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

    describe('queryStores', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/stores')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStores()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/stores?where=name(en%3D%22test%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStores({
          params: {
            where: 'name(en="test")',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('createStore', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/stores', { key: 'test', name: { en: 'Test' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createStore({ data: { key: 'test', name: { en: 'Test' } } })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateStoreById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/stores/my-store-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateStoreById({ id: 'my-store-id', data: { version: 1, actions: [] } })

        expect(category).toEqual({ success: true })
      })
    })

    describe('updateStoreByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/stores/key=my-store-key', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateStoreByKey({ key: 'my-store-key', data: { version: 1, actions: [] } })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteStoreById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/stores/my-store-id')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteStoreById({ id: 'my-store-id', version: 3 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteStoreByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/stores/key=my-store-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteStoreByKey({ key: 'my-store-key', version: 4 })

        expect(category).toEqual({ success: true })
      })
    })
  })

  describe('Channels', () => {
    describe('getChannelById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/channels/my-channel-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const channel = await api.getChannelById({ id: 'my-channel-id' })

        expect(channel).toEqual({ success: true })
      })
    })

    describe('getChannelByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/channels')
          .query({ limit: 1, where: 'key="my-channel-key"' })
          .reply(200, {
            count: 1,
            results: [{ key: 'my-channel-key' }],
          })
        const api = new CommercetoolsApi(defaultConfig)

        const channel = await api.getChannelByKey({ key: 'my-channel-key' })

        expect(channel).toEqual({ key: 'my-channel-key' })
      })

      it('should throw an error when the channel does not exist', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/channels')
          .query({ limit: 1, where: 'key="my-channel-key"' })
          .reply(200, {
            count: 0,
            results: [],
          })
        const api = new CommercetoolsApi(defaultConfig)

        await expect(api.getChannelByKey({ key: 'my-channel-key' })).rejects.toThrow(
          'No channel found with key [my-channel-key]',
        )
      })
    })

    describe('queryChannels', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/channels')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryChannels()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/channels')
          .query({
            staged: true,
            where: 'key=123',
          })
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryChannels({
          params: {
            staged: true,
            where: 'key=123',
          },
        })

        expect(product).toEqual(singleItemResponse)
      })
    })
  })

  describe('Categories', () => {
    describe('getCategoryById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories/my-category-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryById({ id: 'my-category-id' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getCategoryBySlug', () => {
      it('should make a GET request to the correct endpoint when passing a single locale', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories?where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryBySlug({ slug: 'my-slug', languageCode: 'en' })

        expect(product).toEqual(singleResultItem)
      })

      it('should make a GET request to the correct endpoint when passing multiple locales', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories?where=slug(en%3D%22my-slug%22%20or%20en-GB%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryBySlug({ slug: 'my-slug', languageCodes: ['en', 'en-GB'] })

        expect(product).toEqual(singleResultItem)
      })

      it('should throw an error when neither the `languageCode` or `languageCodes` properties are populated ', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories?where=slug(en%3D%22my-slug%22)')
          .reply(200, zeroItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        await expect(api.getCategoryBySlug({ slug: 'my-slug' })).rejects.toMatchError(
          new CommercetoolsError('Either the `languageCode` or `languageCodes` property must be provided'),
        )
      })

      it('should throw an error if no category was found', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories')
          .query({ where: 'slug(en="my-slug")' })
          .reply(200, zeroItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        await expect(api.getCategoryBySlug({ slug: 'my-slug', languageCode: 'en' })).rejects.toMatchError(
          new CommercetoolsError(
            'No category found with slug [my-slug] and language code [en]',
            {
              options: {
                languageCode: 'en',
                slug: 'my-slug',
              },
            },
            404,
          ),
        )
      })
    })

    describe('getCategoryByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories/key=my-category-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getCategoryByKey({ key: 'my-category-key' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('queryCategories', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryCategories()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/categories?staged=true&where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryCategories({
          params: {
            staged: true,
            where: 'slug(en="my-slug")',
          },
        })

        expect(product).toEqual(singleItemResponse)
      })
    })

    describe('getCategoryParents', () => {
      it('should make a GET request to the correct endpoint when using an id as criteria', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories/my-cat-id')
          .query({
            expand: 'ancestors[*]',
          })
          .reply(200, {
            id: 'my-cat-id',
            ancestors: [
              { id: 'ancestor-root', obj: { id: 'ancestor-root' } },
              { id: 'grandparent-cat', obj: { id: 'grandparent-cat' } },
              { id: 'parent-cat', obj: { id: 'parent-cat' } },
            ],
          })
        const api = new CommercetoolsApi(defaultConfig)

        const list = await api.getCategoryParents({ id: 'my-cat-id' })

        expect(list).toEqual([
          { id: 'ancestor-root' },
          { id: 'grandparent-cat' },
          { id: 'parent-cat' },
          {
            id: 'my-cat-id',
            ancestors: [{ id: 'ancestor-root' }, { id: 'grandparent-cat' }, { id: 'parent-cat' }],
          },
        ])
      })

      it('should make a GET request to the correct endpoint when using a key as criteria', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/categories/key=my-cat-key')
          .query({
            expand: 'ancestors[*]',
          })
          .reply(200, {
            key: 'my-cat-key',
            ancestors: [
              { id: 'ancestor-root', obj: { id: 'ancestor-root' } },
              { id: 'grandparent-cat', obj: { id: 'grandparent-cat' } },
              { id: 'parent-cat', obj: { id: 'parent-cat' } },
            ],
          })
        const api = new CommercetoolsApi(defaultConfig)

        const list = await api.getCategoryParents({ key: 'my-cat-key' })

        expect(list).toEqual([
          { id: 'ancestor-root' },
          { id: 'grandparent-cat' },
          { id: 'parent-cat' },
          {
            key: 'my-cat-key',
            ancestors: [{ id: 'ancestor-root' }, { id: 'grandparent-cat' }, { id: 'parent-cat' }],
          },
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
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/products/my-product-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductById({ id: 'my-product-id' })

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
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections/my-prod-guid')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionById({ id: 'my-prod-guid' })

        expect(product).toEqual({ success: true })
      })

      it('should use the `params` parameter to form the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
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
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections/key=my-prod-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionByKey({ key: 'my-prod-key' })

        expect(product).toEqual({ success: true })
      })

      it('should use the `params` parameter to form the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections/key=my-prod-key?staged=true')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionByKey({ key: 'my-prod-key', params: { staged: true } })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getProductProjectionBySlug', () => {
      it('should make a GET request to the correct endpoint when passing a single locale', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections?where=slug(en%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionBySlug({ slug: 'my-slug', languageCode: 'en' })

        expect(product).toEqual(singleResultItem)
      })

      it('should make a GET request to the correct endpoint when passing multiple locales', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections?where=slug(en%3D%22my-slug%22%20or%20en-GB%3D%22my-slug%22)')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductProjectionBySlug({ slug: 'my-slug', languageCodes: ['en', 'en-GB'] })

        expect(product).toEqual(singleResultItem)
      })

      it('should throw an error when neither the `languageCode` or `languageCodes` properties are populated ', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections?where=slug(en%3D%22my-slug%22)')
          .reply(200, zeroItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        await expect(api.getProductProjectionBySlug({ slug: 'my-slug' })).rejects.toMatchError(
          new CommercetoolsError('Either the `languageCode` or `languageCodes` property must be provided'),
        )
      })

      it('should throw an error when no product projection is found', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections?where=slug(en%3D%22my-slug%22)')
          .reply(200, zeroItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        await expect(api.getProductProjectionBySlug({ slug: 'my-slug', languageCode: 'en' })).rejects.toMatchError(
          new CommercetoolsError(
            'No product projection found with slug [my-slug] and language code [en]',
            {
              options: {
                languageCode: 'en',
                slug: 'my-slug',
              },
            },
            404,
          ),
        )
      })
    })

    describe('queryProductProjections', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductProjections()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections?staged=true&where=slug(en%3D%22my-product-slug%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductProjections({
          params: {
            staged: true,
            where: 'slug(en="my-product-slug")',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('searchProductProjections', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections/search')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.searchProductProjections({})

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/product-projections/search?staged=true&where=slug(en%3D%22my-product-slug%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.searchProductProjections({
          params: {
            staged: true,
            where: 'slug(en="my-product-slug")',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('deleteProductById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/my-prod-id')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.deleteProductById({ id: 'my-prod-id', version: 2 })

        expect(product).toEqual({ success: true })
      })
    })

    describe('deleteProductByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/key=my-prod-key')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.deleteProductByKey({ key: 'my-prod-key', version: 3 })

        expect(product).toEqual({ success: true })
      })

      it('should unpublish the product first before attempting to delete it when the `unpublish` option is true', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/key=my-prod-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)
        api.unpublishProductByKey = jest.fn().mockResolvedValue({
          version: 4,
        })

        const product = await api.deleteProductByKey({ key: 'my-prod-key', version: 3, unpublish: true })

        expect(product).toEqual({ success: true })
      })
    })

    describe('unpublishProductById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/my-prod-id', { version: 2, actions: [{ action: 'unpublish' }] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.unpublishProductById({ id: 'my-prod-id', version: 2 })

        expect(product).toEqual({ success: true })
      })

      it('should unpublish the product first before attempting to delete it when the `unpublish` option is true', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/products/my-prod-id')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)
        api.unpublishProductById = jest.fn().mockResolvedValue({
          version: 4,
        })

        const product = await api.deleteProductById({ id: 'my-prod-id', version: 3, unpublish: true })

        expect(product).toEqual({ success: true })
      })
    })

    describe('unpublishProductByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/key=my-prod-key', { version: 3, actions: [{ action: 'unpublish' }] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.unpublishProductByKey({ key: 'my-prod-key', version: 3 })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getProductSelectionById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/product-selections/my-product-selection-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductSelectionById({ id: 'my-product-selection-id' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getProductSelectionByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/product-selections/key=my-product-selection-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getProductSelectionByKey({ key: 'my-product-selection-key' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('queryProductSelections', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/product-selections')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductSelections({})

        expect(product).toEqual({ success: true })
      })
    })

    describe('createProductSelection', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/product-selections', { name: { en: 'finest-products' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createProductSelection({ data: { name: { en: 'finest-products' } } })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateProductSelectionByKey', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/product-selections/key=my-product-selection-key', {
            version: 3,
            actions: [
              {
                action: 'addProduct',
                product: { id: 'prod12345', typeId: 'product' },
              },
            ],
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateProductSelectionByKey({
          key: 'my-product-selection-key',
          version: 3,
          actions: [{ action: 'addProduct', product: { id: 'prod12345', typeId: 'product' } }],
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('deleteProductSelectionByKey', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/product-selections/key=my-product-selection-key&version=5')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.deleteProductSelectionByKey({ key: 'my-product-selection-key', version: 5 })

        expect(product).toEqual({ success: true })
      })
    })

    describe('queryProductsInStore', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/in-store/key=my-store-key/product-selection-assignments')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryProductsInStore({ storeKey: 'my-store-key' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('createProduct', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products', { test: 1 })
          .query({
            testParam: 1,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createProduct({
          data: { test: 1 } as unknown as ProductDraft,
          params: { testParam: 1 },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateProductById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/my-prod-id', { actions: [{ test: 1 }], version: 2 })
          .query({
            testParam: 1,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateProductById({
          id: 'my-prod-id',
          data: {
            actions: [{ test: 1 }] as unknown as ProductUpdateAction[],
            version: 2,
          },
          params: { testParam: 1 },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateProductByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/products/key=my-prod-key', { actions: [{ test: 1 }], version: 3 })
          .query({
            testParam: 1,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateProductByKey({
          key: 'my-prod-key',
          data: { actions: [{ test: 1 }] as unknown as ProductUpdateAction[], version: 3 },
          params: { testParam: 1 },
        })

        expect(product).toEqual({ success: true })
      })
    })
  })

  describe('Customer Groups', () => {
    describe('getCustomerGroupById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/customer-groups/my-customer-group-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.getCustomerGroupById({ id: 'my-customer-group-id' })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('getCustomerGroupByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/customer-groups/key=my-customer-group-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.getCustomerGroupByKey({ key: 'my-customer-group-key' })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('queryCustomerGroups', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/customer-groups')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroups = await api.queryCustomerGroups()

        expect(customerGroups).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/customer-groups?where=key%3D%22my-key%22')
          .reply(200, singleItemResponse)
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroups = await api.queryCustomerGroups({
          params: {
            where: 'key="my-key"',
          },
        })

        expect(customerGroups).toEqual(singleItemResponse)
      })
    })

    describe('createCustomerGroup', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/customer-groups', { groupName: 'Test Group' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.createCustomerGroup({ data: { groupName: 'Test Group' } })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('updateCustomerGroupById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/customer-groups/my-customer-group-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.updateCustomerGroupById({
          id: 'my-customer-group-id',
          data: { version: 1, actions: [] },
        })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('updateCustomerGroupByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/customer-groups/key=my-customer-group-key', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.updateCustomerGroupByKey({
          key: 'my-customer-group-key',
          data: { version: 1, actions: [] },
        })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('deleteCustomerGroupByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/customer-groups/my-customer-group-id')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.deleteCustomerGroupById({ id: 'my-customer-group-id', version: 3 })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('deleteCustomerGroupById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/customer-groups/my-customer-group-id')
          .query({ version: 1 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.deleteCustomerGroupById({ id: 'my-customer-group-id', version: 1 })

        expect(customerGroup).toEqual({ success: true })
      })
    })

    describe('deleteCustomerGroupByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/customer-groups/key=my-customer-group-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const customerGroup = await api.deleteCustomerGroupByKey({ key: 'my-customer-group-key', version: 4 })

        expect(customerGroup).toEqual({ success: true })
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
              authorization: 'Bearer customer-access-token',
            },
          })
            .get('/test-project-key/me/active-cart')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.getMyActiveCart({ accessToken: 'customer-access-token' })

          expect(response).toEqual({ success: true })
        })
      })

      describe('getMyCartById', () => {
        it('should make a GET request to the correct endpoint with the given access token', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token',
            },
          })
            .get('/test-project-key/me/carts/my-cart-id')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.getMyCartById({ accessToken: 'customer-access-token', cartId: 'my-cart-id' })

          expect(response).toEqual({ success: true })
        })
      })

      describe('createMyCart', () => {
        it('should make a POST request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer customer-access-token',
            },
          })
            .post('/test-project-key/me/carts', { currency: 'GBP' })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createMyCart({
            accessToken: 'customer-access-token',
            data: {
              currency: 'GBP',
            },
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('deleteMyActiveCart', () => {
        it('should get the active cart and delete that cart when it exists', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/active-cart')
            .reply(200, { id: '123', version: 2 })
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
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
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/active-cart')
            .reply(404, {})
          const api = new CommercetoolsApi(defaultConfig)

          await expect(api.deleteMyActiveCart({ accessToken: 'my-access-token' })).rejects.toThrow(
            'Request failed with status code 404',
          )
        })
      })

      describe('deleteMyCartById', () => {
        it('should get the cart and delete that cart when it exists', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/carts/my-cart-id')
            .reply(200, { id: '123', version: 2 })
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .delete('/test-project-key/me/carts/my-cart-id')
            .query({ version: 2 })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.deleteMyCartById({ accessToken: 'my-access-token', cartId: 'my-cart-id' })
        })
      })

      describe('updateMyCart', () => {
        it('should call the expected endpoint with the correct parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .post('/test-project-key/me/carts/123', {
              version: 2,
              actions: [{ action: 'setCountry', country: 'GB' }],
            })
            .reply(200, { test: true })
          const api = new CommercetoolsApi(defaultConfig)

          const result = await api.updateMyCart({
            accessToken: 'my-access-token',
            cartId: '123',
            cartVersion: 2,
            actions: [{ action: 'setCountry', country: 'GB' }],
          })

          expect(result).toEqual({ test: true })
        })
      })

      describe('updateMyActiveCart', () => {
        it('should call the expected endpoint with the correct parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/active-cart')
            .reply(200, { id: '123', version: 2 })
          nock('https://api.europe-west1.gcp.commercetools.com', {
            encodedQueryParams: true,
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .post('/test-project-key/me/carts/123', {
              version: 2,
              actions: [{ action: 'setCountry', country: 'GB' }],
            })
            .reply(200, { test: true })
          const api = new CommercetoolsApi(defaultConfig)

          const result = await api.updateMyActiveCart({
            accessToken: 'my-access-token',
            actions: [{ action: 'setCountry', country: 'GB' }],
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
              authorization: 'Bearer test-access-token',
            },
          })
            .post('/test-project-key/carts', { currency: 'GBP' })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          const response = await api.createCart({
            data: {
              currency: 'GBP',
            },
          })

          expect(response).toEqual({ success: true })
        })
      })

      describe('getCartById', () => {
        it('should make a GET request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token',
            },
          })
            .get('/test-project-key/carts/test-cart-id')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.getCartById({ id: 'test-cart-id' })
        })
      })

      describe('queryCarts', () => {
        it('should make a GET request to the correct endpoint with no parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token',
            },
          })
            .get('/test-project-key/carts')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.queryCarts()
        })

        it('should make a GET request to the correct endpoint with expected parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token',
            },
          })
            .get('/test-project-key/carts')
            .query({
              limit: 100,
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.queryCarts({ params: { limit: 100 } })
        })
      })

      describe('queryMyCarts', () => {
        it('should make a GET request to the correct endpoint with no parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/carts')
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.queryMyCarts({ accessToken: 'my-access-token' })
        })

        it('should make a GET request to the correct endpoint with expected parameters', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer my-access-token',
            },
          })
            .get('/test-project-key/me/carts')
            .query({
              limit: 100,
            })
            .reply(200, { success: true })
          const api = new CommercetoolsApi(defaultConfig)

          await api.queryMyCarts({ accessToken: 'my-access-token', params: { limit: 100 } })
        })
      })

      describe('updateCartById', () => {
        it('should make a POST request to the correct endpoint, passing the provided data', async () => {
          nock('https://api.europe-west1.gcp.commercetools.com', {
            reqheaders: {
              authorization: 'Bearer test-access-token',
            },
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
              authorization: 'Bearer test-access-token',
            },
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
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/active-cart')
          .reply(200, { id: '123', version: 2 })
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .post('/test-project-key/me/orders', {
            id: '123',
            version: 2,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyOrderFromActiveCart({ accessToken: 'my-access-token' })

        expect(response).toEqual({ success: true })
      })
    })

    describe('createOrderFromCart', () => {
      it('should make a POST request to the correct endpoint with the given cart data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/carts/123')
          .reply(200, { id: '123', version: 2 })
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/orders', {
            id: '123',
            version: 2,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createOrderFromCart({ id: '123' })

        expect(response).toEqual({ success: true })
      })
    })

    describe('importOrder', () => {
      it('should make a POST request to the correct endpoint with the import order data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/orders/import', {
            orderNumber: '12345',
            customerId: '9999',
            totalPrice: {
              centAmount: 9999,
              currencyCode: 'GBP',
            },
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.importOrder({
          data: {
            orderNumber: '12345',
            customerId: '9999',
            totalPrice: { centAmount: 9999, currencyCode: 'GBP' },
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('getMyOrderById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/orders/my-order-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getMyOrderById({ id: 'my-order-id', accessToken: 'my-access-token' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryMyOrders', () => {
      it('should make a GET request to the correct endpoint when no params are passed in', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/orders')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryMyOrders({ accessToken: 'my-access-token' })

        expect(order).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint when with the given params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/orders')
          .query({ limit: 20 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryMyOrders({ accessToken: 'my-access-token', params: { limit: 20 } })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getOrderById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/orders/test-order-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getOrderById({ id: 'test-order-id' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getOrderByOrderNumber', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/orders/order-number=my-order-number')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getOrderByOrderNumber({ orderNumber: 'my-order-number' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('updateOrderById', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/orders/test-order-id', {
            version: 2,
            actions: [],
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.updateOrderById({ id: 'test-order-id', data: { version: 2, actions: [] } })

        expect(order).toEqual({ success: true })
      })
    })

    describe('updateOrderByOrderNumber', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/orders/order-number=test-order-num', {
            version: 2,
            actions: [],
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.updateOrderByOrderNumber({
          orderNumber: 'test-order-num',
          data: { version: 2, actions: [] },
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('deleteOrderById', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/orders')
          .query({
            where: 'orderNumber="1234"',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryOrders({
          params: {
            where: 'orderNumber="1234"',
          },
        })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Payment', () => {
    describe('createPayment', () => {
      it('should make a POST request to the correct endpoint with the given payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/payments', { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createPayment({
          data: { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('deletePaymentById', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .delete('/test-project-key/payments/payment-id')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.deletePaymentById({ id: 'payment-id', version: 4 })

        expect(response).toEqual({ success: true })
      })
    })

    describe('updatePayment', () => {
      it('should make a POST request to the correct endpoint with the given access token and payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/payments/payment-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.updatePaymentById({
          id: 'payment-id',
          data: { version: 1, actions: [] },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('getPaymentById', () => {
      it('should make a GET request to the correct endpoint with the given access token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/payments/payment-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.getPaymentById({
          id: 'payment-id',
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('queryPayments', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/payments')
          .query({ where: 'test=1' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.queryPayments({
          params: {
            where: 'test=1',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('createMyPayment', () => {
      it('should make a POST request to the correct endpoint with the given access token and payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .post('/test-project-key/me/payments', { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyPayment({
          accessToken: 'my-access-token',
          data: { amountPlanned: { centAmount: 2000, currencyCode: 'GBP' } },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('updateMyPayment', () => {
      it('should make a POST request to the correct endpoint with the given access token and payment data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .post('/test-project-key/me/payments/my-payment-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.updateMyPaymentById({
          accessToken: 'my-access-token',
          id: 'my-payment-id',
          data: { version: 1, actions: [] },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('getMyPaymentById', () => {
      it('should make a GET request to the correct endpoint with the given access token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/payments/my-payment-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.getMyPaymentById({
          accessToken: 'my-access-token',
          id: 'my-payment-id',
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('queryMyPayments', () => {
      it('should make a GET request to the correct endpoint with the given access token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/me/payments')
          .query({ where: 'test=1' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.queryMyPayments({
          accessToken: 'my-access-token',
          params: {
            where: 'test=1',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('deleteMyPaymentById', () => {
      it('should make a DELETE request to the correct endpoint with the given access token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .delete('/test-project-key/me/payments/my-payment-id?version=1')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.deleteMyPaymentById({
          accessToken: 'my-access-token',
          id: 'my-payment-id',
          version: 1,
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
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/customers')
          .query({
            where: 'email="jimmy@gradientedge.com"',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryCustomers({
          params: {
            where: 'email="jimmy@gradientedge.com"',
          },
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('createAccount', () => {
      it('should make a POST request to the correct endpoint with the expected data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/customers', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createAccount({
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('createMyAccount', () => {
      it('should make a POST request to the correct endpoint with the expected data when an access token is passed in', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer customer-access-token',
          },
        })
          .post('/test-project-key/me/signup', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyAccount({
          accessToken: 'customer-access-token',
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })

      it('should make a POST request to the correct endpoint with the expected data when an access token is not passed in', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/me/signup', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.createMyAccount({
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('loginMyAccount', () => {
      it('should make a POST request to the correct endpoint with the expected data when an access token is passed in', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer customer-access-token',
          },
        })
          .post('/test-project-key/me/login', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.loginMyAccount({
          accessToken: 'customer-access-token',
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })

      it('should make a POST request to the correct endpoint with the expected data when an access token is not passed in', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/me/login', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.loginMyAccount({
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('updateCustomerById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/customers/my-customer-id', { actions: [{ test: 1 }], version: 2 })
          .query({
            testParam: 1,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateCustomerById({
          id: 'my-customer-id',
          data: {
            actions: [{ test: 1 }] as unknown as CustomerUpdateAction[],
            version: 2,
          },
          params: { testParam: 1 },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateCustomerByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/customers/key=my-customer-key', { actions: [{ test: 1 }], version: 3 })
          .query({
            testParam: 1,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateCustomerByKey({
          key: 'my-customer-key',
          data: { actions: [{ test: 1 }] as unknown as CustomerUpdateAction[], version: 3 },
          params: { testParam: 1 },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('deleteCustomerById', () => {
      it('should make a DELETE request to the correct endpoint with the expected data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .delete('/test-project-key/customers/customer-id')
          .query({ version: 2 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.deleteCustomerById({
          id: 'customer-id',
          version: 2,
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('deleteCustomerByKey', () => {
      it('should make a DELETE request to the correct endpoint with the expected data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .delete('/test-project-key/customers/key=customer-key')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.deleteCustomerByKey({
          key: 'customer-key',
          version: 3,
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('login', () => {
      it('should make a POST request to the correct endpoint with the expected data', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/login', {
            email: 'test@test.com',
            password: 'testing',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const response = await api.login({
          data: {
            email: 'test@test.com',
            password: 'testing',
          },
        })

        expect(response).toEqual({ success: true })
      })
    })

    describe('getMyAccount', () => {
      it('should make a GET request to the correct endpoint using the customer token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer customer-access-token',
          },
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
            authorization: 'Bearer customer-access-token',
          },
        })
          .post('/test-project-key/me', {
            version: 4,
            actions: [],
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.updateMyAccount({
          accessToken: 'customer-access-token',
          data: {
            version: 4,
            actions: [],
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getPasswordResetToken', () => {
      it('should make a POST request to the correct endpoint using the customer token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/customers/password-token', {
            email: 'jimmy@gradientedge.com',
            ttlMinutes: 60,
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getPasswordResetToken({
          data: {
            email: 'jimmy@gradientedge.com',
            ttlMinutes: 60,
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('resetMyPassword', () => {
      it('should make a POST request to the correct endpoint using the customer token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .post('/test-project-key/me/password/reset', {
            tokenValue: 'test-token',
            newPassword: 'test123',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.resetMyPassword({
          accessToken: 'my-access-token',
          data: {
            tokenValue: 'test-token',
            newPassword: 'test123',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('changeMyPassword', () => {
      it('should make a POST request to the correct endpoint using the customer token', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .post('/test-project-key/me/password', {
            version: 1,
            currentPassword: 'myOldPassword',
            newPassword: 'myNewPassword',
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.changeMyPassword({
          accessToken: 'my-access-token',
          data: {
            version: 1,
            currentPassword: 'myOldPassword',
            newPassword: 'myNewPassword',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })
  })

  describe('Product Types', () => {
    describe('getProductTypeById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/product-types/key=my-product-type-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getProductTypeByKey({ key: 'my-product-type-key ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryProductTypes', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/product-types')
          .query({ where: 'name="test"' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryProductTypes({ params: { where: 'name="test"' } })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Types', () => {
    describe('getTypeById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
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
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/types/key=my-type-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getTypeByKey({ key: 'my-type-key ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryTypes', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/types')
          .query({ limit: 10 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryTypes({ params: { limit: 10 } })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Discount Codes', () => {
    describe('getDiscountCodeById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/discount-codes/my-discount-code-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getDiscountCodeById({ id: 'my-discount-code-id ' })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Cart Discounts', () => {
    describe('getCartDiscountById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/cart-discounts/my-cart-discount-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCartDiscountById({ id: 'my-cart-discount-id ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getCartDiscountByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/cart-discounts/key=my-cart-discount-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCartDiscountByKey({ key: 'my-cart-discount-key ' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryCartDiscounts', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/cart-discounts')
          .query({ limit: 10 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryCartDiscounts({ params: { limit: 10 } })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Custom Objects', () => {
    describe('getCustomObject', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/custom-objects/my-container/my-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomObject({ container: 'my-container', key: 'my-key' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getCustomObjectById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/custom-objects/my-custom-object-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getCustomObjectById({ id: 'my-custom-object-id' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('saveCustomObject', () => {
      it('should make a POST request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .post('/test-project-key/custom-objects', { container: 'my-container', key: 'my-key', value: { test: 1 } })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.saveCustomObject({
          data: { container: 'my-container', key: 'my-key', value: { test: 1 } },
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('deleteCustomObject', () => {
      it('should make a DELETE request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .delete('/test-project-key/custom-objects/my-container/my-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.deleteCustomObject({ container: 'my-container', key: 'my-key' })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('Shipping Methods', () => {
    describe('getShippingMethodById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/my-shipping-method-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodById({ id: 'my-shipping-method-id' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getShippingMethodByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/key=my-shipping-method-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodByKey({ key: 'my-shipping-method-key' })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getShippingMethodsForLocation', () => {
      it('should make a GET request to the correct endpoint when only sending through a country', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/matching-location')
          .query({ country: 'GB' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodsForLocation({ country: 'GB' })

        expect(order).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/matching-location')
          .query({ limit: 10, country: 'GB', currency: 'GBP', state: 'Norfolk' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodsForLocation({
          country: 'GB',
          currency: 'GBP',
          state: 'Norfolk',
          params: { limit: 10 },
        })

        expect(order).toEqual({ success: true })
      })

      it('should send through the customer access token when supplied', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/matching-location')
          .query({ limit: 10, country: 'GB', currency: 'GBP', state: 'Norfolk' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodsForLocation({
          accessToken: 'my-access-token',
          country: 'GB',
          currency: 'GBP',
          state: 'Norfolk',
          params: { limit: 10 },
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('getShippingMethodsForCart', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/matching-cart')
          .query({ limit: 10, cartId: 'my-cart-id' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodsForCart({ cartId: 'my-cart-id', params: { limit: 10 } })

        expect(order).toEqual({ success: true })
      })

      it('should use the customer token when supplied', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer my-access-token',
          },
        })
          .get('/test-project-key/shipping-methods/matching-cart')
          .query({ limit: 10, cartId: 'my-cart-id' })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.getShippingMethodsForCart({
          accessToken: 'my-access-token',
          cartId: 'my-cart-id',
          params: { limit: 10 },
        })

        expect(order).toEqual({ success: true })
      })
    })

    describe('queryShippingMethods', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          reqheaders: {
            authorization: 'Bearer test-access-token',
          },
        })
          .get('/test-project-key/shipping-methods')
          .query({ limit: 10 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const order = await api.queryShippingMethods({ params: { limit: 10 } })

        expect(order).toEqual({ success: true })
      })
    })
  })

  describe('States', () => {
    describe('getStateById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/states/my-state-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStateById({ id: 'my-state-id' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getStateByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/states/key=my-state-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStateByKey({ key: 'my-state-key' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('queryStates', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/states')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStates()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/states?where=name(en%3D%22test%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStates({
          params: {
            where: 'name(en="test")',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })
  })

  describe('Standalone prices', () => {
    describe('getStandalonePriceById', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/standalone-prices/my-standalone-price-id')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStandalonePriceById({ id: 'my-standalone-price-id' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('getStandalonePriceByKey', () => {
      it('should make a GET request to the correct endpoint', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .get('/test-project-key/standalone-prices/key=my-standalone-price-key')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.getStandalonePriceByKey({ key: 'my-standalone-price-key' })

        expect(product).toEqual({ success: true })
      })
    })

    describe('queryStandalonePrices', () => {
      it('should make a GET request to the correct endpoint when no parameters are passed', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/standalone-prices')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStandalonePrices()

        expect(product).toEqual({ success: true })
      })

      it('should make a GET request to the correct endpoint with the passed in parameters in the querystring', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com', {
          encodedQueryParams: true,
        })
          .get('/test-project-key/standalone-prices?where=name(en%3D%22test%22)')
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.queryStandalonePrices({
          params: {
            where: 'name(en="test")',
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('createStandalonePrice', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/standalone-prices', {
            key: 'test',
            sku: 'test-sku',
            value: {
              centAmount: 1000,
              currencyCode: 'GBP',
            },
          })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const product = await api.createStandalonePrice({
          data: {
            key: 'test',
            sku: 'test-sku',
            value: {
              centAmount: 1000,
              currencyCode: 'GBP',
            },
          },
        })

        expect(product).toEqual({ success: true })
      })
    })

    describe('updateStandalonePriceById', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/standalone-prices/my-standalone-price-id', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateStandalonePriceById({
          id: 'my-standalone-price-id',
          data: { version: 1, actions: [] },
        })

        expect(category).toEqual({ success: true })
      })
    })

    describe('updateStandalonePriceByKey', () => {
      it('should make a POST request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .post('/test-project-key/standalone-prices/key=my-standalone-price-key', { version: 1, actions: [] })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.updateStandalonePriceByKey({
          key: 'my-standalone-price-key',
          data: { version: 1, actions: [] },
        })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteStandalonePriceById', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/standalone-prices/my-standalone-price-id')
          .query({ version: 3 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteStandalonePriceById({ id: 'my-standalone-price-id', version: 3 })

        expect(category).toEqual({ success: true })
      })
    })

    describe('deleteStandalonePriceByKey', () => {
      it('should make a DELETE request to the correct endpoint with all expected data and params', async () => {
        nock('https://api.europe-west1.gcp.commercetools.com')
          .delete('/test-project-key/standalone-prices/key=my-standalone-price-key')
          .query({ version: 4 })
          .reply(200, { success: true })
        const api = new CommercetoolsApi(defaultConfig)

        const category = await api.deleteStandalonePriceByKey({ key: 'my-standalone-price-key', version: 4 })

        expect(category).toEqual({ success: true })
      })
    })
  })

  describe('graphql', () => {
    it('should call the /graphql endpoint with the data passed in, using the client access token', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        reqheaders: {
          authorization: 'Bearer test-access-token',
        },
      })
        .post('/test-project-key/graphql', {
          query: 'products { results { id } }',
        })
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.graphql({
        data: {
          query: 'products { results { id } }',
        },
      })

      expect(response).toEqual({ success: true })
    })

    it('should call the /graphql endpoint with the data passed in, using the passed in access token', async () => {
      nock('https://api.europe-west1.gcp.commercetools.com', {
        reqheaders: {
          authorization: 'Bearer customer-access-token',
        },
      })
        .post('/test-project-key/graphql', {
          query: 'products { results { id } }',
        })
        .reply(200, { success: true })
      const api = new CommercetoolsApi(defaultConfig)

      const response = await api.graphql({
        data: {
          query: 'products { results { id } }',
        },
        accessToken: 'customer-access-token',
      })

      expect(response).toEqual({ success: true })
    })
  })

  describe('getRequestOptions', () => {
    it('should return an `X-Correlation-ID` HTTP header when sent in the via a request option', async () => {
      const api = new CommercetoolsApi(defaultConfig)

      const result = await api.getRequestOptions({
        path: '/test',
        method: 'GET',
        headers: {},
        correlationId: 'my-correlation-id',
        accessToken: 'mock-access-token',
      })

      expect(result).toEqual({
        headers: {
          Authorization: 'Bearer mock-access-token',
          'X-Correlation-ID': 'my-correlation-id',
        },
        method: 'GET',
        url: 'https://api.europe-west1.gcp.commercetools.com/test-project-key/test',
      })
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

  describe('validateConfig', () => {
    it('should throw an error if the `projectKey` property is falsy', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, projectKey: null })).toThrowError()
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, projectKey: '' })).toThrowError()
    })

    it('should throw an error if the `projectKey` property is not a string', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, projectKey: 123 })).toThrowError()
    })

    it('should throw an error if the `clientId` property is falsy', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientId: null })).toThrowError()
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientId: '' })).toThrowError()
    })

    it('should throw an error if the `clientId` property is not a string', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientId: 123 })).toThrowError()
    })

    it('should throw an error if the `clientSecret` property is falsy', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientSecret: null })).toThrowError()
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientSecret: '' })).toThrowError()
    })

    it('should throw an error if the `clientSecret` property is not a string', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientSecret: 123 })).toThrowError()
    })

    it('should throw an error if the `clientScopes` property is not an array', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientScopes: 'test' })).toThrowError()
    })

    it('should throw an error if the `clientScopes` array does not contain at least one item', () => {
      expect(() => CommercetoolsApi.validateConfig({ ...defaultConfig, clientScopes: [] })).toThrowError()
    })

    it('should not throw an error if all required properties are populated', () => {
      expect(() =>
        CommercetoolsApi.validateConfig({
          clientId: 'test',
          clientSecret: 'test',
          clientScopes: ['manage_project'],
          projectKey: 'test',
        }),
      ).not.toThrowError()
    })
  })
})
