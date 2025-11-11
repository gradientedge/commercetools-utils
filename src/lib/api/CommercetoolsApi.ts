import { CommercetoolsApiConfig, CommercetoolsRetryConfig } from './types.js'
import {
  CommercetoolsAuth,
  DiscountCodeDraft,
  DiscountCodePagedQueryResponse,
  DiscountCodeUpdate,
  RecurrencePolicy,
  RecurrencePolicyPagedQueryResponse,
  RecurrencePolicyUpdateAction,
  RecurringOrder,
  RecurringOrderDraft,
  RecurringOrderPagedQueryResponse,
  RecurringOrderUpdateAction,
} from '../index.js'
import { CommercetoolsError } from '../error/index.js'
import { REGION_URLS } from '../auth/constants.js'
import { CommercetoolsRequest, RegionEndpoints, RequestExecutor } from '../types.js'
import { ensureNonEmptyString } from '../utils/index.js'
import { v4 as uuid } from 'uuid'

import type {
  Cart,
  CartDiscount,
  CartDiscountPagedQueryResponse,
  CartDraft,
  CartPagedQueryResponse,
  Category,
  CategoryDraft,
  CategoryPagedQueryResponse,
  CategoryUpdate,
  Channel,
  ChannelPagedQueryResponse,
  Customer,
  CustomerCreatePasswordResetToken,
  CustomerDraft,
  CustomerGroup,
  CustomerGroupDraft,
  CustomerGroupPagedQueryResponse,
  CustomerGroupUpdate,
  CustomerPagedQueryResponse,
  CustomerPagedSearchResponse,
  CustomerResetPassword,
  CustomerSearchRequest,
  CustomerSignin,
  CustomerSignInResult,
  CustomerToken,
  CustomerUpdate,
  CustomObject,
  CustomObjectDraft,
  DiscountCode,
  GraphQLRequest,
  GraphQLResponse,
  InventoryEntry,
  InventoryEntryDraft,
  InventoryEntryUpdateAction,
  InventoryPagedQueryResponse,
  MyCartDraft,
  MyCartUpdateAction,
  MyCustomerDraft,
  MyOrderFromCartDraft,
  MyPayment,
  MyPaymentDraft,
  MyPaymentPagedQueryResponse,
  MyPaymentUpdate,
  Order,
  OrderEdit,
  OrderEditDraft,
  OrderEditPagedQueryResponse,
  OrderEditUpdate,
  OrderFromCartDraft,
  OrderImportDraft,
  OrderPagedQueryResponse,
  OrderPagedSearchResponse,
  OrderSearchRequest,
  OrderUpdate,
  Payment,
  PaymentDraft,
  PaymentPagedQueryResponse,
  PaymentUpdate,
  Product,
  ProductDraft,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductSelection,
  ProductSelectionDraft,
  ProductSelectionPagedQueryResponse,
  ProductSelectionUpdateAction,
  ProductsInStorePagedQueryResponse,
  ProductType,
  ProductTypePagedQueryResponse,
  ProductUpdate,
  ReplicaCartDraft,
  ShippingMethod,
  ShippingMethodPagedQueryResponse,
  StandalonePrice,
  StandalonePriceDraft,
  StandalonePricePagedQueryResponse,
  StandalonePriceUpdate,
  State,
  StatePagedQueryResponse,
  Store,
  StoreDraft,
  StorePagedQueryResponse,
  StoreUpdate,
  TaxCategory,
  TaxCategoryPagedQueryResponse,
  Type,
  TypePagedQueryResponse,
} from '../types/models/index.js'

import { getRequestExecutor } from '../request/request-executor.js'
import { CartUpdateAction } from '../types/models/cart.js'

export interface FetchOptions<T = any> {
  /**
   * Path of the REST endpoint
   *
   * This is the absolute path, without the host/schema/port etc.
   * You should not include your project key, as this will be
   * automatically prepended.
   *
   * Example: `/product-projections`
   *
   * Note that if you want to create a path that takes into account
   * the store key that you defined in {@see CommercetoolsApiConfig}
   * then you should use the {@see CommercetoolsApi.applyStore} method.
   */
  path: string

  /**
   * Key/value pairs representing the HTTP headers to send
   *
   * You can pass in any headers you like using this property, however
   * this is generally not necessary, as the {@see CommercetoolsApi.request}
   * method applies all necessary headers.
   *
   * You should specifically avoid setting values for the following headers:
   *
   *  - `Authorization`
   *  - `Content-Type`
   *  - `X-Correlation-ID`
   *  - `User-Agent`
   *
   * All of the above are set by the `CommercetoolsApi` class.
   *
   * Example value:
   *
   * ```
   * {
   *   ...
   *   headers: {
   *     'X-My-Special-Header': 'MyCustomValue'
   *   }
   *   ...
   * }
   * ```
   */
  headers?: Record<string, string>

  /**
   * HTTP method to use when sending the request
   */
  method: 'GET' | 'POST' | 'DELETE' | 'HEAD'

  /**
   * Querystring parameters to send with the request
   *
   * Key/value pairs that are then converted in to a querystring
   * using the `qs` npm package. See the `paramSerializer` option
   * in {@see CommercetoolsApi.createAxiosInstance} for
   * implementation details.
   */
  params?: Record<string, any>

  /**
   * Plain JavaScript object containing the payload to send as JSON
   *
   * This object will be converted to a JSON string and sent as the body
   * of a `POST` or `DELETE` request.
   */
  data?: T

  /**
   * Access token to use as the value for the `Authorization` bearer token
   *
   * Typically, this would be the access token that belongs to a customer.
   * This must be passed in when using one of the `me` endpoints.
   *
   * If this property is not passed in, we fall back to using the client
   * access token.
   */
  accessToken?: string

  /**
   * Value to be passed in the `X-Correlation-ID` HTTP header
   */
  correlationId?: string

  /**
   * An optional identifier used to identify the id of an external user making the request:
   * https://docs.commercetools.com/api/general-concepts#external-user-ids
   */
  externalUserId?: string

  /**
   * The aggregate timeout in milliseconds (aggregate time spent across the original request and retries)
   */
  aggregateTimeoutMs?: number

  /**
   * The request timeout in milliseconds
   */
  timeoutMs?: number

  /**
   * Request retry configuration
   *
   * The request retry configuration can be set on the `CommercetoolsApi`
   * instance or on a request by request basis. If no value is passed in
   * here, we fall back to using the configuration provided when constructing
   * the `CommercetoolsApi` instance. If no value was passed in to the
   * constructor configuration, then no retries will take place.
   */
  retry?: CommercetoolsRetryConfig

  /**
   * An optional AbortController that can be used to abort the request
   */
  abortController?: AbortController
}

/**
 * Options that are available to all requests.
 */
export interface CommonRequestOptions {
  /**
   * A unique id used to track the source of a request.
   */
  correlationId?: string

  /**
   * An optional identifier used to identify the id of an external user making the request:
   * https://docs.commercetools.com/api/general-concepts#external-user-ids
   */
  externalUserId?: string

  /**
   * Query string parameters. For repeated param=value in the query string, define an array with values
   */
  params?: Record<string, undefined | string | boolean | number | (string | boolean | number)[]>

  /**
   * The aggregate timeout in milliseconds (aggregate time spent across the original request and retries)
   */
  aggregateTimeoutMs?: number

  /**
   * The request timeout in milliseconds
   */
  timeoutMs?: number

  /**
   * Retry configuration
   */
  retry?: CommercetoolsRetryConfig

  /**
   * An optional AbortController that can be used to abort the request
   */
  abortController?: AbortController
}

/**
 * Options that are available to all requests that support specifying a store
 */
export interface CommonStoreEnabledRequestOptions extends CommonRequestOptions {
  /**
   * The key of the store that you want this call to apply to
   */
  storeKey?: string
}

/**
 * A collection of convenience methods for interacting with the
 * commercetools API.
 */
export class CommercetoolsApi {
  /**
   * This is the instance of the {@see CommercetoolsAuth} class that
   * this class uses internally. It's exposed publicly so that it can
   * be used by consumer's of this class in order to access authorization
   * API related functionality.
   */
  public readonly auth: CommercetoolsAuth

  /**
   * The configuration passed in to the constructor.
   */
  public readonly config: CommercetoolsApiConfig

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  public readonly endpoints: RegionEndpoints

  /**
   * The request executor that's responsible for making the request to commercetools
   */
  private readonly requestExecutor: RequestExecutor

  constructor(config: CommercetoolsApiConfig) {
    CommercetoolsApi.validateConfig(config)
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
    this.requestExecutor = getRequestExecutor({
      timeoutMs: config.timeoutMs,
      httpsAgent: config.httpsAgent,
      systemIdentifier: config.systemIdentifier,
      onBeforeRequest: config.onBeforeRequest,
      onAfterResponse: config.onAfterResponse,
      retry: config.retry,
    })
  }

  /**
   * Get a store given its id
   * https://docs.commercetools.com/api/projects/stores#get-a-store-by-id
   */
  getStoreById(options: CommonRequestOptions & { id: string }): Promise<Store> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a store given its key
   * https://docs.commercetools.com/api/projects/stores#get-a-store-by-key
   */
  getStoreByKey(options: CommonRequestOptions & { key: string }): Promise<Store> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query stores
   * https://docs.commercetools.com/api/projects/stores#get-a-store-by-key
   */
  queryStores(options?: CommonRequestOptions): Promise<StorePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/stores',
      method: 'GET',
    })
  }

  /**
   * Create a store:
   * https://docs.commercetools.com/api/projects/stores#create-a-store
   */
  createStore(options: CommonRequestOptions & { data: StoreDraft }): Promise<Store> {
    return this.request({
      path: `/stores`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a store by id:
   * https://docs.commercetools.com/api/projects/stores#update-store-by-id
   */
  updateStoreById(options: CommonRequestOptions & { id: string; data: StoreUpdate }): Promise<Store> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a store by key:
   * https://docs.commercetools.com/api/projects/stores#update-store-by-key
   */
  updateStoreByKey(options: CommonRequestOptions & { key: string; data: StoreUpdate }): Promise<Store> {
    return this.request({
      path: `/stores/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a store by id:
   * https://docs.commercetools.com/api/projects/stores#delete-store-by-id
   */
  deleteStoreById(options: CommonRequestOptions & { id: string; version: number }): Promise<Store> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a store by key:
   * https://docs.commercetools.com/api/projects/stores#delete-store-by-key
   */
  deleteStoreByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<Store> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Get an individual category by id:
   * https://docs.commercetools.com/api/projects/categories#get-category-by-id
   */
  getCategoryById(options: CommonRequestOptions & { id: string }): Promise<Category> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get an individual category by key:
   * https://docs.commercetools.com/api/projects/categories#get-category-by-key
   */
  getCategoryByKey(options: CommonRequestOptions & { key: string }): Promise<Category> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query channels:
   * https://docs.commercetools.com/api/projects/channels#query-channels
   */
  queryChannels(options?: CommonRequestOptions): Promise<ChannelPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/channels`,
      method: 'GET',
    })
  }

  /**
   * Import an order.
   * https://docs.commercetools.com/api/projects/orders-import#orderimportdraft
   */
  async importOrder(options: CommonRequestOptions & { data: OrderImportDraft }): Promise<Order> {
    return this.request<OrderImportDraft, Order>({
      ...this.extractCommonRequestOptions(options),
      path: '/orders/import',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get channel by id:
   * https://docs.commercetools.com/api/projects/channels#get-channel-by-id
   */
  getChannelById(options: CommonRequestOptions & { id: string }): Promise<Channel> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/channels/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get channel by key:
   * https://docs.commercetools.com/api/projects/channels#get-channel-by-key
   */
  async getChannelByKey(options: CommonRequestOptions & { key: string }): Promise<Channel> {
    const response = await this.request<any, ChannelPagedQueryResponse>({
      ...this.extractCommonRequestOptions(options),
      path: `/channels`,
      method: 'GET',
      params: {
        where: `key="${encodeURIComponent(options.key)}"`,
        limit: 1,
      },
    })
    if (!response?.count) {
      throw new CommercetoolsError(`No channel found with key [${options.key}]`, null, 404)
    }
    return response.results[0]
  }

  /**
   * Get a category by id or key. Either the id or the key must be provided.
   */
  getCategory(options: CommonRequestOptions & { id?: string; key?: string }): Promise<Category> {
    if (!options.id && !options.key) {
      throw new CommercetoolsError('Either an id, key or slug must be provided')
    }
    if (options.id) {
      ensureNonEmptyString({ value: options.id, name: 'id' })

      return this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/categories/${encodeURIComponent(options.id)}`,
        method: 'GET',
      })
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/key=${encodeURIComponent(options.key ?? '')}`,
      method: 'GET',
    })
  }

  /**
   * Get a category projection by slug and locale
   * Queries the categories for the given slug + locale using:
   * https://docs.commercetools.com/api/projects/categories#query-categories
   */
  async getCategoryBySlug(
    options: CommonRequestOptions & { slug: string; languageCode?: string; languageCodes?: string[] },
  ): Promise<Category> {
    if (!options.languageCode && !options.languageCodes) {
      throw new CommercetoolsError('Either the `languageCode` or `languageCodes` property must be provided')
    }
    const languageCodes: string[] = []
    if (options.languageCodes) {
      languageCodes.push(...options.languageCodes)
    } else if (options.languageCode) {
      languageCodes.push(options.languageCode)
    }
    const data = await this.request({
      ...this.extractCommonRequestOptions({
        ...options,
        params: {
          ...options?.params,
          where: `slug(${languageCodes.map((code) => `${code}="${options.slug}"`).join(' or ')})`,
        },
      }),
      path: `/categories`,
      method: 'GET',
    })
    if (!data.count) {
      throw new CommercetoolsError(
        `No category found with slug [${options.slug}] and language code [${options.languageCode}]`,
        { options },
        404,
      )
    }
    return data.results[0]
  }

  /**
   * Query categories
   * https://docs.commercetools.com/api/projects/categories#query-categories
   */
  queryCategories(options?: CommonRequestOptions): Promise<CategoryPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories`,
      method: 'GET',
    })
  }

  /**
   * Get the parent categories of a given category. This method returns an array
   * of {@see Category} items representing the ancestry of categories for the given
   * category id. The list is ordered from top down. In other words, the root
   * category is always the first item in the list.
   */
  async getCategoryParents(options: CommonRequestOptions & { id?: string; key?: string }): Promise<Array<Category>> {
    const category = await this.getCategory({
      ...options,
      params: {
        ...options.params,
        expand: 'ancestors[*]',
      },
    })
    const ancestors = category.ancestors.map((ref) => ref.obj as Category)
    ancestors.push({
      ...category,
      ancestors: category.ancestors.map((ancestor) => ({ id: ancestor.id, typeId: ancestor.typeId })),
    })
    return ancestors
  }

  /**
   * Get an individual product by id:
   * https://docs.commercetools.com/api/projects/products#get-product-by-id
   */
  getProductById(options: CommonRequestOptions & { id: string }): Promise<Product> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get an individual product by key:
   * https://docs.commercetools.com/api/projects/products#get-product-by-key
   */
  getProductByKey(options: CommonRequestOptions & { key: string }): Promise<Product> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Get a product projection by id
   * https://docs.commercetools.com/api/projects/productProjections#get-productprojection-by-id
   */
  getProductProjectionById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<ProductProjection> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/product-projections/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a product projection by key
   * https://docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key
   */
  getProductProjectionByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<ProductProjection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/product-projections/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a product projection by searching the slug with a given locale or array of locales
   *
   * Utilises the product projection query endpoint:
   * https://docs.commercetools.com/api/projects/productProjections#query-productprojections
   *
   * You must pass either the {@see options.languageCode} or {@see options.languageCodes}
   * property in the {@see options} parameter. If both are provided, only the {@see options.languageCodes}
   * is actually used.
   */
  async getProductProjectionBySlug(
    options: CommonRequestOptions & { slug: string; languageCode?: string; languageCodes?: string[] },
  ): Promise<ProductProjection> {
    if (!options.languageCode && !options.languageCodes) {
      throw new CommercetoolsError('Either the `languageCode` or `languageCodes` property must be provided')
    }
    const languageCodes: string[] = []
    if (options.languageCodes) {
      languageCodes.push(...options.languageCodes)
    } else if (options.languageCode) {
      languageCodes.push(options.languageCode)
    }
    const data = await this.request({
      ...this.extractCommonRequestOptions({
        ...options,
        params: {
          ...options?.params,
          where: `slug(${languageCodes.map((code) => `${code}="${options.slug}"`).join(' or ')})`,
        },
      }),
      path: `/product-projections`,
      method: 'GET',
    })
    if (!data.count) {
      throw new CommercetoolsError(
        `No product projection found with slug [${options.slug}] and language code [${options.languageCode}]`,
        { options },
        404,
      )
    }
    return data.results[0]
  }

  /**
   * Query product projections
   * https://docs.commercetools.com/api/projects/productProjections#query-productprojections
   */
  queryProductProjections(options?: CommonRequestOptions): Promise<ProductProjectionPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-projections`,
      method: 'GET',
    })
  }

  /**
   * Search product projections
   * https://docs.commercetools.com/api/projects/products-search#search-productprojections
   */
  searchProductProjections(options: CommonStoreEnabledRequestOptions): Promise<ProductProjectionPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-projections/search`,
      method: 'GET',
    })
  }

  /**
   * Get a product selection by id
   * https://docs.commercetools.com/api/projects/product-selections#get-product-selection
   */
  getProductSelectionById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<ProductSelection> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/product-selections/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a product selection by key
   * https://docs.commercetools.com/api/projects/product-selections#get-product-selection-by-key
   */
  getProductSelectionByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<ProductSelection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/product-selections/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Query product selections
   * https://docs.commercetools.com/api/projects/product-selections#query-product-selections
   */
  queryProductSelections(options?: CommonStoreEnabledRequestOptions): Promise<ProductSelectionPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-selections`,
      method: 'GET',
    })
  }

  /**
   * Create a product selection
   * https://docs.commercetools.com/api/projects/product-selections#create-product-selection
   */
  createProductSelection(
    options: CommonStoreEnabledRequestOptions & { data: ProductSelectionDraft },
  ): Promise<ProductSelection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-selections`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a product selection by key
   * https://docs.commercetools.com/api/projects/product-selections#update-product-selection-by-key
   */
  updateProductSelectionByKey(
    options: CommonStoreEnabledRequestOptions & {
      key: string
      version: number
      actions: ProductSelectionUpdateAction[]
    },
  ): Promise<ProductSelection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-selections/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: { version: options.version, actions: options.actions },
    })
  }

  /**
   * Delete a product selection by key
   * https://docs.commercetools.com/api/projects/product-selections#delete-product-selection-by-key
   */
  deleteProductSelectionByKey(
    options: CommonStoreEnabledRequestOptions & {
      key: string
      version: number
    },
  ): Promise<ProductSelection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-selections/key=${encodeURIComponent(options.key)}&version=${encodeURIComponent(options.version)}`,
      method: 'DELETE',
    })
  }

  /**
   * Query the products available in a store through active Product Selections
   * https://docs.commercetools.com/api/projects/product-selections#query-products-available-in-a-store-through-active-product-selections
   */
  queryProductsInStore(options: CommonStoreEnabledRequestOptions): Promise<ProductsInStorePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/in-store/key=${encodeURIComponent(options.storeKey ?? '')}/product-selection-assignments`,
      method: `GET`,
    })
  }

  /**
   * Get an InventoryEntry by id
   * https://docs.commercetools.com/api/projects/inventory#get-inventoryentry-by-id
   */
  getInventoryEntryById(options: CommonRequestOptions & { id: string }): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/${options.id}`,
      method: 'GET',
    })
  }

  /**
   * Get an InventoryEntry by key
   * https://docs.commercetools.com/api/projects/inventory#get-inventoryentry-by-key
   */
  getInventoryEntryByKey(options: CommonRequestOptions & { key: string }): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query the inventory of Skus
   * https://docs.commercetools.com/api/projects/inventory#query-inventory
   */
  queryInventory(options?: CommonRequestOptions): Promise<InventoryPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory`,
      method: 'GET',
    })
  }

  /**
   * Create InventoryEntry
   * https://docs.commercetools.com/api/projects/inventory#create-inventoryentry
   */
  createInventoryEntry(options: CommonRequestOptions & { data: InventoryEntryDraft }): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.data.sku, name: 'sku' })

    return this.request<InventoryEntryDraft, InventoryEntry>({
      ...this.extractCommonRequestOptions(options),
      path: '/inventory',
      data: options.data,
      method: 'POST',
    })
  }

  /**
   * Update InventoryEntry by id
   * https://docs.commercetools.com/api/projects/inventory#update-inventoryentry-by-id
   */
  updateInventoryEntryById(
    options: CommonRequestOptions & { id: string; data: { version: number; actions: InventoryEntryUpdateAction[] } },
  ): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/${options.id}`,
      method: 'POST',
      data: {
        ...options.data,
      },
    })
  }

  /**
   * Update InventoryEntry by key
   * https://docs.commercetools.com/api/projects/inventory#update-inventoryentry-by-key
   */
  updateInventoryEntryByKey(
    options: CommonRequestOptions & { key: string; data: { version: number; actions: InventoryEntryUpdateAction[] } },
  ): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/key=${options.key}`,
      method: 'POST',
      data: {
        ...options.data,
      },
    })
  }

  /**
   * Delete InventoryEntry by id
   * https://docs.commercetools.com/api/projects/inventory#delete-inventoryentry-by-id
   */
  deleteInventoryEntryById(options: CommonRequestOptions & { id: string; version: number }): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/${options.id}`,
      params: {
        ...options.params,
        version: options.version,
      },
      method: 'DELETE',
    })
  }

  /**
   * Delete InventoryEntry by key
   * https://docs.commercetools.com/api/projects/inventory#delete-inventoryentry-by-key
   */
  deleteInventoryEntryByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<InventoryEntry> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/inventory/key=${options.key}`,
      params: {
        ...options.params,
        version: options.version,
      },
      method: 'DELETE',
    })
  }

  /**
   * Check if a cart exists by id
   * https://docs.commercetools.com/api/projects/carts#check-if-cart-exists-by-id
   */
  async checkCartExistsById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: this.applyStore(`/carts/${encodeURIComponent(options.id)}`, options.storeKey),
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if a cart exists by key
   * https://docs.commercetools.com/api/projects/carts#check-if-cart-exists-by-id
   */
  async checkCartExistsByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: this.applyStore(`/carts/key=${encodeURIComponent(options.key)}`, options.storeKey),
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Get a cart by id
   * https://docs.commercetools.com/api/projects/carts#get-a-cart-by-id
   */
  getCartById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Cart> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a cart by key
   * https://docs.commercetools.com/api/projects/carts#get-a-cart-by-key
   */
  getCartByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<Cart> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Query carts
   * https://docs.commercetools.com/api/projects/carts#query-carts-1
   */
  async queryCarts(options?: CommonStoreEnabledRequestOptions): Promise<CartPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts`, options?.storeKey),
      method: 'GET',
    })
  }

  /**
   * Query my carts
   * https://docs.commercetools.com/api/projects/me-carts#query-carts-1
   */
  async queryMyCarts(
    options: CommonStoreEnabledRequestOptions & { accessToken: string },
  ): Promise<CartPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Create a new cart:
   * https://docs.commercetools.com/api/projects/carts#create-a-cart-1
   */
  async createCart(options: CommonStoreEnabledRequestOptions & { data: CartDraft }): Promise<Cart> {
    return this.request<CartDraft, Cart>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Replicate an existing cart from a Cart or Order
   * https://docs.commercetools.com/api/projects/carts#replicate-cart
   */
  async replicate(options: CommonRequestOptions & { data: ReplicaCartDraft }): Promise<Cart> {
    return this.request<ReplicaCartDraft, Cart>({
      ...this.extractCommonRequestOptions(options),
      path: '/carts/replicate',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a cart by id
   * https://docs.commercetools.com/api/projects/carts#update-a-cart-by-id
   */
  async updateCartById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; actions: CartUpdateAction[] },
  ): Promise<Cart> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'POST',
      data: {
        version: options.version,
        actions: options.actions,
      },
    })
  }

  /**
   * Get the active cart. Requires a logged in or anonymous customer access token:
   * https://docs.commercetools.com/api/projects/me-carts#get-active-cart
   */
  async getMyActiveCart(options: CommonStoreEnabledRequestOptions & { accessToken: string }): Promise<Cart> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/active-cart`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Get my cart. Requires a logged in or anonymous customer access token:
   * https://docs.commercetools.com/api/projects/me-carts#get-cart-by-id
   */
  async getMyCartById(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; cartId: string },
  ): Promise<Cart> {
    ensureNonEmptyString({ value: options.cartId, name: 'cartId' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${encodeURIComponent(options.cartId)}`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Create a new cart for the customer associated with the given `accessToken` parameter:
   * https://docs.commercetools.com/api/projects/me-carts#create-a-cart-1
   */
  async createMyCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: MyCartDraft },
  ): Promise<Cart> {
    return this.request<MyCartDraft, Cart>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts`, options.storeKey),
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Update a customer's cart with the given actions:
   * https://docs.commercetools.com/api/projects/me-carts#update-cart
   * https://docs.commercetools.com/api/projects/me-carts#update-actions
   */
  async updateMyCart(
    options: CommonStoreEnabledRequestOptions & {
      accessToken: string
      cartId: string
      cartVersion: number
      actions: MyCartUpdateAction[]
    },
  ): Promise<Cart> {
    ensureNonEmptyString({ value: options.cartId, name: 'cartId' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${encodeURIComponent(options.cartId)}`, options.storeKey),
      method: 'POST',
      data: {
        version: options.cartVersion,
        actions: options.actions,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Delete the active cart This method uses {@see getMyActiveCart} to first
   * get the active cart, in order to find the cart id and version:
   * https://docs.commercetools.com/api/projects/me-carts#delete-a-cart
   */
  async deleteMyActiveCart(options: CommonStoreEnabledRequestOptions & { accessToken: string }): Promise<Cart> {
    const cart = await this.getMyActiveCart(options)
    return await this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${encodeURIComponent(cart.id)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: cart.version,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Delete my cart by id
   * https://docs.commercetools.com/api/projects/me-carts#delete-a-cart
   */
  async deleteMyCartById(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; cartId: string },
  ): Promise<Cart> {
    ensureNonEmptyString({ value: options.cartId, name: 'cartId' })

    const cart = await this.getMyCartById(options)
    return await this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${encodeURIComponent(options.cartId)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: cart.version,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Update a customer's cart with the given actions. Note that we automatically
   * retrieve the customer's active cart using the given access token:
   * https://docs.commercetools.com/api/projects/me-carts#update-cart
   * https://docs.commercetools.com/api/projects/me-carts#update-actions
   */
  async updateMyActiveCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; actions: MyCartUpdateAction[] },
  ): Promise<Cart> {
    const cart = await this.getMyActiveCart(options)
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${encodeURIComponent(cart.id)}`, options.storeKey),
      method: 'POST',
      data: {
        version: cart.version,
        actions: options.actions,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Create an order from the given cart id. The cart id and version are automatically
   * retrieved by looking up the customers active cart:
   * https://docs.commercetools.com/api/projects/me-orders#create-order-from-a-cart
   */
  async createMyOrderFromActiveCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string },
  ): Promise<Order> {
    const cart = await this.getMyActiveCart(options)
    return this.request<MyOrderFromCartDraft, Order>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore('/me/orders', options.storeKey),
      method: 'POST',
      data: {
        version: cart.version,
        id: cart.id,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Create an order from the given OrderFromCartDraft:
   * https://docs.commercetools.com/api/projects/orders#create-order
   */
  async createOrderFromCart(options: CommonStoreEnabledRequestOptions & { data: OrderFromCartDraft }): Promise<Order> {
    return this.request<OrderFromCartDraft, Order>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore('/orders', options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a cart by the given id:
   * https://docs.commercetools.com/api/projects/carts#delete-a-cart-by-id
   */
  async deleteCartById(options: CommonStoreEnabledRequestOptions & { id: string; version: number }): Promise<Cart> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return await this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Create a payment object:
   * https://docs.commercetools.com/api/projects/payments#create-a-payment
   */
  createPayment(options: CommonRequestOptions & { data: PaymentDraft }): Promise<Payment> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/payments',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a payment object by id:
   * https://docs.commercetools.com/api/projects/payments#delete-payment-by-id
   */
  deletePaymentById(options: CommonRequestOptions & { id: string; version: number }): Promise<Payment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/payments/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Update a payment object by id:
   * https://docs.commercetools.com/api/projects/payments#update-payment-by-id
   */
  updatePaymentById(options: CommonRequestOptions & { id: string; data: PaymentUpdate }): Promise<Payment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/payments/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get a payment object by id:
   * https://docs.commercetools.com/api/projects/payments#get-payment-by-id
   */
  getPaymentById(options: CommonRequestOptions & { id: string }): Promise<Payment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/payments/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Query payment objects:
   * https://docs.commercetools.com/api/projects/payments#query-payments
   */
  queryPayments(options: CommonRequestOptions): Promise<PaymentPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/payments',
      method: 'GET',
    })
  }

  /**
   * Create a payment object using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-payments#create-mypayment
   */
  createMyPayment(options: CommonRequestOptions & { data: MyPaymentDraft; accessToken: string }): Promise<MyPayment> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/me/payments',
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Update a payment object using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-payments#update-mypayment
   */
  updateMyPaymentById(
    options: CommonRequestOptions & { id: string; data: MyPaymentUpdate; accessToken: string },
  ): Promise<MyPayment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/me/payments/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Get a payment object by id using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-payments#get-mypayment-by-id
   */
  getMyPaymentById(options: CommonRequestOptions & { id: string; accessToken: string }): Promise<MyPayment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/me/payments/${encodeURIComponent(options.id)}`,
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Query payment objects using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-payments#query-mypayments
   */
  queryMyPayments(options: CommonRequestOptions & { accessToken: string }): Promise<MyPaymentPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/me/payments',
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Delete payment object using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-payments#delete-mypayment
   */
  deleteMyPaymentById(
    options: CommonRequestOptions & { id: string; version: number; accessToken: string },
  ): Promise<MyPayment> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/me/payments/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        version: options.version,
      },
      accessToken: options.accessToken,
    })
  }

  /**
   * Get an order by id using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-orders#get-order-by-id
   */
  getMyOrderById(options: CommonStoreEnabledRequestOptions & { id: string; accessToken: string }): Promise<Order> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/orders/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Query my orders:
   * https://docs.commercetools.com/api/projects/me-orders#query-orders-1
   */
  queryMyOrders(options: CommonStoreEnabledRequestOptions & { accessToken: string }): Promise<OrderPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/orders`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Update an order by id:
   * https://docs.commercetools.com/api/projects/orders#update-order-by-id
   */
  updateOrderById(options: CommonStoreEnabledRequestOptions & { id: string; data: OrderUpdate }): Promise<Order> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update an order by order number:
   * https://docs.commercetools.com/api/projects/orders#update-order-by-ordernumber
   */
  updateOrderByOrderNumber(
    options: CommonStoreEnabledRequestOptions & { orderNumber: string; data: OrderUpdate },
  ): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/order-number=${encodeURIComponent(options.orderNumber)}`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get an order by id:
   * https://docs.commercetools.com/api/projects/orders#get-order-by-id
   */
  getOrderById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Order> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get an order by order number:
   * https://docs.commercetools.com/api/projects/orders#get-order-by-ordernumber
   */
  getOrderByOrderNumber(options: CommonStoreEnabledRequestOptions & { orderNumber: string }): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/order-number=${encodeURIComponent(options.orderNumber)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Delete an order by id:
   * https://docs.commercetools.com/api/projects/orders#delete-order-by-id
   */
  deleteOrderById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; dataErasure?: boolean },
  ): Promise<Order> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure,
      },
    })
  }

  /**
   * Delete an order by order number:
   * https://docs.commercetools.com/api/projects/orders#delete-order-by-ordernumber
   */
  deleteOrderByOrderNumber(
    options: CommonStoreEnabledRequestOptions & { orderNo: string; version: number; dataErasure?: boolean },
  ): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/order-number=${encodeURIComponent(options.orderNo)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure,
      },
    })
  }

  /**
   * Query orders:
   * https://docs.commercetools.com/api/projects/orders#query-orders-1
   */
  queryOrders(options: CommonStoreEnabledRequestOptions): Promise<OrderPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Search orders:
   * https://docs.commercetools.com/api/projects/order-search#search-orders
   */
  searchOrders(options: CommonRequestOptions & { data: OrderSearchRequest }): Promise<OrderPagedSearchResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/orders/search',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Create a product:
   * https://docs.commercetools.com/api/projects/products#create-a-product
   */
  createProduct(options: CommonRequestOptions & { data: ProductDraft }): Promise<Product> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a product by key:
   * https://docs.commercetools.com/api/projects/products#update-product-by-key
   */
  updateProductByKey(options: CommonRequestOptions & { key: string; data: ProductUpdate }): Promise<Product> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a product by id:
   * https://docs.commercetools.com/api/projects/products#update-product-by-id
   */
  updateProductById(options: CommonRequestOptions & { id: string; data: ProductUpdate }): Promise<Product> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a product by id:
   * https://docs.commercetools.com/api/projects/products#delete-product-by-id
   *
   * @param {object} options Request options
   * @param {boolean} options.unpublish If true, the product will be unpublished before being deleted
   */
  async deleteProductById(
    options: CommonRequestOptions & { id: string; version: number; unpublish?: boolean },
  ): Promise<Product> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    let version = options.version
    if (options.unpublish) {
      const product = await this.unpublishProductById({
        id: options.id,
        version: options.version,
      })
      version = product.version
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version,
      },
    })
  }

  /**
   * Delete a product by key:
   * https://docs.commercetools.com/api/projects/products#delete-product-by-key
   *
   * @param {object} options Request options
   * @param {boolean} options.unpublish If true, the product will be unpublished before being deleted
   */
  async deleteProductByKey(
    options: CommonRequestOptions & { key: string; version: number; unpublish?: boolean },
  ): Promise<Product> {
    let version = options.version
    if (options.unpublish) {
      const product = await this.unpublishProductByKey({
        key: options.key,
        version: options.version,
      })
      version = product.version
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version,
      },
    })
  }

  /**
   * Unpublish a product by key
   *
   * Issues an 'unpublish' action for the given product:
   * https://docs.commercetools.com/api/projects/products#unpublish
   */
  unpublishProductByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<Product> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      params: options.params,
      data: {
        version: options.version,
        actions: [{ action: 'unpublish' }],
      },
    })
  }

  /**
   * Unpublish a product by id
   *
   * Issues an 'unpublish' action for the given product:
   * https://docs.commercetools.com/api/projects/products#unpublish
   */
  unpublishProductById(options: CommonRequestOptions & { id: string; version: number }): Promise<Product> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${encodeURIComponent(options.id)}`,
      method: 'POST',
      params: options.params,
      data: {
        version: options.version,
        actions: [{ action: 'unpublish' }],
      },
    })
  }

  /**
   * Create a category:
   * https://docs.commercetools.com/api/projects/categories#create-a-category
   */
  createCategory(options: CommonRequestOptions & { data: CategoryDraft }): Promise<Category> {
    return this.request({
      path: `/categories`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a category by key:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-key
   */
  updateCategoryByKey(options: CommonRequestOptions & { key: string; data: CategoryUpdate }): Promise<Category> {
    return this.request({
      path: `/categories/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a category by id:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-id
   */
  updateCategoryById(options: CommonRequestOptions & { id: string; data: CategoryUpdate }): Promise<Category> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a category by id:
   * https://docs.commercetools.com/api/projects/categories#delete-category-by-id
   */
  deleteCategoryById(options: CommonRequestOptions & { id: string; version: number }): Promise<Category> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a category by key:
   * https://docs.commercetools.com/api/projects/categories#delete-category-by-key
   */
  deleteCategoryByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<Category> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Create a customer account:
   * https://docs.commercetools.com/api/projects/customers#create-customer-sign-up
   */
  createAccount(options: CommonStoreEnabledRequestOptions & { data: CustomerDraft }): Promise<CustomerSignInResult> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a customer account by id
   * https://docs.commercetools.com/api/projects/customers#delete-customer-by-id
   */
  deleteCustomerById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; dataErasure?: boolean },
  ): Promise<Customer> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure,
      },
    })
  }

  /**
   * Delete a customer account by key
   * https://docs.commercetools.com/api/projects/customers#delete-customer-by-key
   */
  deleteCustomerByKey(
    options: CommonStoreEnabledRequestOptions & { key: string; version: number; dataErasure?: boolean },
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure,
      },
    })
  }

  /**
   * Create a customer account given an (optional) anonymous access token:
   * https://docs.commercetools.com/api/projects/me-profile#create-customer-sign-up
   */
  createMyAccount(
    options: CommonStoreEnabledRequestOptions & { accessToken?: string; data: MyCustomerDraft },
  ): Promise<CustomerSignInResult> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/signup`, options.storeKey),
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Login to customer's account given an (optional) anonymous access token:
   * https://docs.commercetools.com/api/projects/me-profile#authenticate-customer-sign-in
   */
  loginMyAccount(
    options: CommonStoreEnabledRequestOptions & { accessToken?: string; data: CustomerSignin },
  ): Promise<CustomerSignInResult> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/login`, options.storeKey),
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Login to customer's account:
   * https://docs.commercetools.com/api/projects/customers#authenticate-customer-sign-in
   */
  login(options: CommonStoreEnabledRequestOptions & { data: CustomerSignin }): Promise<CustomerSignInResult> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/login`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get a customer's account/profile:
   * https://docs.commercetools.com/api/projects/me-profile#get-customer
   */
  getMyAccount(options: CommonStoreEnabledRequestOptions & { accessToken: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken,
    })
  }

  /**
   * Update a customer's account/profile:
   * https://docs.commercetools.com/api/projects/me-profile#update-customer
   */
  updateMyAccount(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: CustomerUpdate },
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data,
    })
  }

  /**
   * Change the customer's password:
   * https://docs.commercetools.com/api/projects/me-profile#change-customers-password
   */
  changeMyPassword(
    options: CommonStoreEnabledRequestOptions & {
      accessToken: string
      data: { version: number; currentPassword: string; newPassword: string }
    },
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/password`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data,
    })
  }

  /**
   * Reset the customer's password:
   * https://docs.commercetools.com/api/projects/me-profile#reset-customers-password
   */
  resetMyPassword(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: CustomerResetPassword },
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/password/reset`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data,
    })
  }

  /**
   * Get a password reset token
   * https://docs.commercetools.com/api/projects/customers#create-a-token-for-resetting-the-customers-password
   */
  getPasswordResetToken(
    options: CommonStoreEnabledRequestOptions & { data: CustomerCreatePasswordResetToken },
  ): Promise<CustomerToken> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/password-token`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get a customer by id:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-id
   */
  getCustomerById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Customer> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a customer by key:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-key
   */
  getCustomerByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get a customer by password token:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-password-token
   */
  getCustomerByPasswordToken(options: CommonStoreEnabledRequestOptions & { token: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/password-token=${encodeURIComponent(options.token)}`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Query customers:
   * https://docs.commercetools.com/api/projects/customers#query-customers
   */
  queryCustomers(options: CommonStoreEnabledRequestOptions): Promise<CustomerPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Search customers:
   * https://docs.commercetools.com/api/projects/customer-search#search-customers
   */
  searchCustomers(
    options: CommonRequestOptions & { data: CustomerSearchRequest },
  ): Promise<CustomerPagedSearchResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/customers/search',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a customer by id:
   * https://docs.commercetools.com/api/projects/customers#update-customer-by-id
   */
  updateCustomerById(
    options: CommonStoreEnabledRequestOptions & { id: string; data: CustomerUpdate },
  ): Promise<Customer> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/${encodeURIComponent(options.id)}`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a customer by key:
   * https://docs.commercetools.com/api/projects/customers#update-customer-by-key
   */
  updateCustomerByKey(
    options: CommonStoreEnabledRequestOptions & { key: string; data: CustomerUpdate },
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/key=${encodeURIComponent(options.key)}`, options.storeKey),
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get a product type by id:
   * https://docs.commercetools.com/api/projects/productTypes#get-a-producttype-by-id
   */
  getProductTypeById(options: CommonRequestOptions & { id: string }): Promise<ProductType> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-types/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a product type by key:
   * https://docs.commercetools.com/api/projects/productTypes#get-a-producttype-by-key
   */
  getProductTypeByKey(options: CommonRequestOptions & { key: string }): Promise<ProductType> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-types/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query product types:
   * https://docs.commercetools.com/api/projects/productTypes#query-producttypes
   */
  queryProductTypes(options: CommonRequestOptions): Promise<ProductTypePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-types`,
      method: 'GET',
    })
  }

  /**
   * Get a type by id:
   * https://docs.commercetools.com/api/projects/types#get-type-by-id
   */
  getTypeById(options: CommonRequestOptions & { id: string }): Promise<Type> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/types/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a type by key:
   * https://docs.commercetools.com/api/projects/types#get-type-by-key
   */
  getTypeByKey(options: CommonRequestOptions & { key: string }): Promise<Type> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/types/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query types:
   * https://docs.commercetools.com/api/projects/types#query-types
   */
  queryTypes(options: CommonRequestOptions): Promise<TypePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/types`,
      method: 'GET',
    })
  }

  /**
   * Create a discount code:
   * https://docs.commercetools.com/api/projects/discountCodes#create-discountcode
   */
  createDiscountCode(options: CommonRequestOptions & { data: DiscountCodeDraft }): Promise<DiscountCode> {
    return this.request({
      path: `/discount-codes`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Get a discount code by id:
   * https://docs.commercetools.com/api/projects/discountCodes#get-discountcode-by-id
   */
  getDiscountCodeById(options: CommonRequestOptions & { id: string }): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a discount code by key:
   * https://docs.commercetools.com/api/projects/discountCodes#get-discountcode-by-key
   */
  getDiscountCodeByKey(options: CommonRequestOptions & { key: string }): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Update a discount code by id:
   * https://docs.commercetools.com/api/projects/discountCodes#update-discountcode-by-id
   */
  updateDiscountCodeById(
    options: CommonRequestOptions & { id: string; data: DiscountCodeUpdate },
  ): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a discount code by key:
   * https://docs.commercetools.com/api/projects/discountCodes#update-discountcode-by-key
   */
  updateDiscountCodeByKey(
    options: CommonRequestOptions & { key: string; data: DiscountCodeUpdate },
  ): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Query discount codes:
   * https://docs.commercetools.com/api/projects/discountCodes#query-discountcodes
   */
  queryDiscountCodes(options?: CommonRequestOptions): Promise<DiscountCodePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes`,
      method: 'GET',
    })
  }

  /**
   * Delete a discount code by id:
   * https://docs.commercetools.com/api/projects/discountCodes#delete-discountcode-by-id
   */
  deleteDiscountCodeById(options: CommonRequestOptions & { id: string; version: number }): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a discount code by key:
   * https://docs.commercetools.com/api/projects/discountCodes#delete-discountcode-by-key
   */
  deleteDiscountCodeByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<DiscountCode> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/discount-codes/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Check if a discount code exists by id:
   * https://docs.commercetools.com/api/projects/discountCodes#check-if-discountcode-exists-by-id
   */
  async checkDiscountCodeExistsById(options: CommonRequestOptions & { id: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/discount-codes/${encodeURIComponent(options.id)}`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if a discount code exists by key:
   * https://docs.commercetools.com/api/projects/discountCodes#check-if-discountcode-exists-by-key
   */
  async checkDiscountCodeExistsByKey(options: CommonRequestOptions & { key: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/discount-codes/key=${encodeURIComponent(options.key)}`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if a discount code exists by query predicate
   * https://docs.commercetools.com/api/projects/discountCodes#check-if-discountcode-exists-by-query-predicate
   */
  async checkDiscountCodeExists(options?: CommonRequestOptions): Promise<boolean> {
    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/discount-codes`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Get a cart discount code by id:
   * https://docs.commercetools.com/api/projects/cartDiscounts#get-cartdiscount-by-id
   */
  getCartDiscountById(options: CommonRequestOptions & { id: string }): Promise<CartDiscount> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/cart-discounts/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a cart discount by key:
   * https://docs.commercetools.com/api/projects/cartDiscounts#get-cartdiscount-by-key
   */
  getCartDiscountByKey(options: CommonRequestOptions & { key: string }): Promise<CartDiscount> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/cart-discounts/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query cart discounts:
   * https://docs.commercetools.com/api/projects/cartDiscounts#query-cartdiscounts
   */
  queryCartDiscounts(options?: CommonRequestOptions): Promise<CartDiscountPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/cart-discounts`,
      method: 'GET',
    })
  }

  /**
   * Get a custom object
   * https://docs.commercetools.com/api/projects/custom-objects#get-customobject-by-container-and-key
   */
  getCustomObject(options: CommonRequestOptions & { container: string; key: string }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${encodeURIComponent(options.container)}/${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Get a custom object by id
   * https://docs.commercetools.com/api/projects/custom-objects#get-customobject
   */
  getCustomObjectById(options: CommonRequestOptions & { id: string }): Promise<CustomObject> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Save a custom object
   * https://docs.commercetools.com/api/projects/custom-objects#create-or-update-a-customobject
   */
  saveCustomObject(options: CommonRequestOptions & { data: CustomObjectDraft }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a custom object
   * https://docs.commercetools.com/api/projects/custom-objects#delete-customobject-by-container-and-key
   */
  deleteCustomObject(options: CommonRequestOptions & { container: string; key: string }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${encodeURIComponent(options.container)}/${encodeURIComponent(options.key)}`,
      method: 'DELETE',
    })
  }

  /**
   * Get a shipping method by id:
   * https://docs.commercetools.com/api/projects/shippingMethods#get-shippingmethod-by-id
   */
  getShippingMethodById(options: CommonRequestOptions & { id: string }): Promise<ShippingMethod> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/shipping-methods/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a shipping method by key:
   * https://docs.commercetools.com/api/projects/shippingMethods#get-shippingmethod-by-key
   */
  getShippingMethodByKey(options: CommonRequestOptions & { key: string }): Promise<ShippingMethod> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/shipping-methods/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Get shipping method by location:
   * https://docs.commercetools.com/api/projects/shippingMethods#get-shippingmethods-for-a-location
   */
  getShippingMethodsForLocation(
    options: CommonRequestOptions & { country: string; state?: string; currency?: string },
  ): Promise<ShippingMethodPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions({
        ...options,
        params: {
          ...options?.params,
          country: options.country,
          state: options.state,
          currency: options.currency,
        },
      }),
      path: `/shipping-methods/matching-location`,
      method: 'GET',
    })
  }

  /**
   * Get shipping methods applicable to a given cart id:
   * https://docs.commercetools.com/api/projects/shippingMethods#get-shippingmethods-for-a-cart
   */
  getShippingMethodsForCart(
    options: CommonStoreEnabledRequestOptions & { cartId: string },
  ): Promise<ShippingMethodPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions({
        ...options,
        params: {
          ...options?.params,
          cartId: options.cartId,
        },
      }),
      path: this.applyStore(`/shipping-methods/matching-cart`, options.storeKey),
      method: 'GET',
    })
  }

  /**
   * Get shipping methods applicable for a Cart and Location:
   * https://docs.commercetools.com/api/projects/shippingMethods#for-a-cart-and-location
   */
  getShippingMethodsForCartAndLocation(
    options: CommonStoreEnabledRequestOptions & {
      cartId: string
      country: string
      state?: string
    },
  ): Promise<ShippingMethodPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions({
        ...options,
        params: {
          ...options?.params,
          cartId: options.cartId,
          country: options.country,
          state: options.state,
        },
      }),
      path: `/shipping-methods/matching-cart-location`,
      method: 'GET',
    })
  }

  /**
   * Query shipping methods:
   * https://docs.commercetools.com/api/projects/shippingMethods#query-shippingmethods
   */
  queryShippingMethods(options?: CommonRequestOptions): Promise<ShippingMethodPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/shipping-methods`,
      method: 'GET',
    })
  }

  /**
   * Get an individual customer group by id:
   * https://docs.commercetools.com/api/projects/customerGroups#get-customergroup-by-id
   */
  getCustomerGroupById(options: CommonRequestOptions & { id: string }): Promise<CustomerGroup> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get an individual customer group by key:
   * https://docs.commercetools.com/api/projects/customerGroups#get-customergroup-by-key
   */
  getCustomerGroupByKey(options: CommonRequestOptions & { key: string }): Promise<CustomerGroup> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query customer groups:
   * https://docs.commercetools.com/api/projects/customerGroups#query-customergroups
   */
  queryCustomerGroups(options?: CommonRequestOptions): Promise<CustomerGroupPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups`,
      method: 'GET',
    })
  }

  /**
   * Create a customer group:
   * https://docs.commercetools.com/api/projects/customerGroups#create-a-customergroup
   */
  createCustomerGroup(options: CommonRequestOptions & { data: CustomerGroupDraft }): Promise<CustomerGroup> {
    return this.request({
      path: `/customer-groups`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a customer group by key:
   * https://docs.commercetools.com/api/projects/customerGroups#update-customergroup-by-key
   */
  updateCustomerGroupByKey(
    options: CommonRequestOptions & { key: string; data: CustomerGroupUpdate },
  ): Promise<CustomerGroup> {
    return this.request({
      path: `/customer-groups/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a customer group by id:
   * https://docs.commercetools.com/api/projects/customerGroups#update-customergroup-by-id
   */
  updateCustomerGroupById(
    options: CommonRequestOptions & { id: string; data: CustomerGroupUpdate },
  ): Promise<CustomerGroup> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a customer group by id:
   * https://docs.commercetools.com/api/projects/customerGroups#delete-customergroup-by-id
   */
  deleteCustomerGroupById(options: CommonRequestOptions & { id: string; version: number }): Promise<CustomerGroup> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a customer group by key:
   * https://docs.commercetools.com/api/projects/customerGroups#delete-customergroup-by-key
   */
  deleteCustomerGroupByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<CustomerGroup> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/customer-groups/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Get a state given its id
   * https://docs.commercetools.com/api/projects/states#get-state-by-id
   */
  getStateById(options: CommonRequestOptions & { id: string }): Promise<State> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/states/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a state given its key
   * https://docs.commercetools.com/api/projects/states#get-state-by-key
   */
  getStateByKey(options: CommonRequestOptions & { key: string }): Promise<State> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/states/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query state
   * https://docs.commercetools.com/api/projects/states#query-states
   */
  queryStates(options?: CommonRequestOptions): Promise<StatePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/states',
      method: 'GET',
    })
  }

  /**
   * Get a standalone price given its id
   * https://docs.commercetools.com/api/projects/standalone-prices#get-standaloneprice-by-id
   */
  getStandalonePriceById(options: CommonRequestOptions & { id: string }): Promise<StandalonePrice> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a standalone price given its key
   * https://docs.commercetools.com/api/projects/standalone-prices#get-standaloneprice-by-key
   */
  getStandalonePriceByKey(options: CommonRequestOptions & { key: string }): Promise<StandalonePrice> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query standalone prices
   * https://docs.commercetools.com/api/projects/standalone-prices#query-standaloneprices
   */
  queryStandalonePrices(options?: CommonRequestOptions): Promise<StandalonePricePagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/standalone-prices',
      method: 'GET',
    })
  }

  /**
   * Create a standalone price object:
   * https://docs.commercetools.com/api/projects/standalone-prices#create-standaloneprice
   */
  createStandalonePrice(options: CommonRequestOptions & { data: StandalonePriceDraft }): Promise<StandalonePrice> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/standalone-prices',
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a standalone price object by id:
   * https://docs.commercetools.com/api/projects/standalone-prices#update-standaloneprice-by-id
   */
  updateStandalonePriceById(
    options: CommonRequestOptions & { id: string; data: StandalonePriceUpdate },
  ): Promise<StandalonePrice> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a standalone price object by key:
   * https://docs.commercetools.com/api/projects/standalone-prices#update-standaloneprice-by-key
   */
  updateStandalonePriceByKey(
    options: CommonRequestOptions & { key: string; data: StandalonePriceUpdate },
  ): Promise<StandalonePrice> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a standalone price object by id:
   * https://docs.commercetools.com/api/projects/standalone-prices#delete-standaloneprice-by-id
   */
  deleteStandalonePriceById(options: CommonRequestOptions & { id: string; version: number }): Promise<StandalonePrice> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a standalone price object by key:
   * https://docs.commercetools.com/api/projects/standalone-prices#delete-standaloneprice-by-key
   */
  deleteStandalonePriceByKey(
    options: CommonRequestOptions & { key: string; version: number },
  ): Promise<StandalonePrice> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/standalone-prices/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Get a tax category given its id
   * https://docs.commercetools.com/api/projects/taxCategories#get-taxcategory-by-id
   */
  getTaxCategoryById(options: CommonRequestOptions & { id: string }): Promise<TaxCategory> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/tax-categories/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Get a tax category given its key
   * https://docs.commercetools.com/api/projects/taxCategories#get-taxcategory-by-key
   */
  getTaxCategoryByKey(options: CommonRequestOptions & { key: string }): Promise<TaxCategory> {
    ensureNonEmptyString({ value: options.key, name: 'key' })
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/tax-categories/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query tax categories
   * https://docs.commercetools.com/api/projects/taxCategories#query-taxcategories
   */
  queryTaxCategories(options?: CommonRequestOptions): Promise<TaxCategoryPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/tax-categories`,
      method: 'GET',
    })
  }

  /**
   * Execute a GraphQL statement:
   * https://docs.commercetools.com/api/graphql
   */
  graphql(options: CommonRequestOptions & { accessToken?: string; data: GraphQLRequest }): Promise<GraphQLResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/graphql`,
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken,
    })
  }

  /**
   * Make the request to the commercetools REST API.
   */
  async request<T = any, R = any>(options: FetchOptions<T>): Promise<R> {
    const requestOptions = await this.getRequestOptions(options)
    return await this.requestExecutor(requestOptions)
  }

  /**
   * Generate request options. These are then fed in to axios when
   * making the request to commercetools.
   */
  async getRequestOptions(options: FetchOptions): Promise<CommercetoolsRequest> {
    let params: Record<string, any> | undefined
    let accessToken = options.accessToken
    const url = `${this.endpoints.api}/${this.config.projectKey}${options.path}`

    if (!accessToken) {
      const grant = await this.auth.getClientGrant()
      accessToken = grant.accessToken
    }

    const headers: Record<string, string> = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    }

    if (options.externalUserId) {
      headers['X-External-User-ID'] = options.externalUserId
    }

    if (typeof options.correlationId === 'string' && options.correlationId !== '') {
      headers['X-Correlation-ID'] = options.correlationId
      delete options.correlationId
    } else {
      headers['X-Correlation-ID'] = uuid()
    }

    if (options.params && Object.keys(options.params).length) {
      params = options.params
    }

    return {
      method: options.method,
      data: options.data,
      url,
      headers,
      params,
    }
  }

  /**
   * Type-guard against any additional unexpected properties being passed in.
   */
  extractCommonRequestOptions(options?: CommonRequestOptions): CommonRequestOptions {
    if (!options) {
      return {}
    }
    return {
      correlationId: options.correlationId,
      params: options.params,
      retry: options.retry,
      aggregateTimeoutMs: options.aggregateTimeoutMs,
      timeoutMs: options.timeoutMs,
      abortController: options.abortController,
    }
  }

  /**
   * Applies the store key to a given path
   */
  applyStore(path: string, storeKey: string | undefined | null): string {
    if (typeof storeKey === 'string' && storeKey !== '') {
      return `/in-store/key=${storeKey}${path}`
    } else if (this.config.storeKey) {
      return `/in-store/key=${this.config.storeKey}${path}`
    }
    return path
  }

  /**
   * Ensure that all required properties on the {@see CommercetoolsApiConfig}
   * object have been populated. These are currently:
   *
   *   projectKey: string
   *   clientId: string
   *   clientSecret: string
   *   region: Region
   *   clientScopes: string[]
   */
  public static validateConfig(config: any): void {
    const errors: string[] = []
    if (!config) {
      errors.push('The config object missing or empty')
    } else {
      if (!config.projectKey) {
        errors.push('The `projectKey` property is empty')
      } else if (typeof config.projectKey !== 'string') {
        errors.push('The `projectKey` property must be a string')
      }
      if (!config.clientId) {
        errors.push('The `clientId` property is empty')
      } else if (typeof config.clientId !== 'string') {
        errors.push('The `clientId` property must be a string')
      }
      if (!config.clientSecret) {
        errors.push('The `clientSecret` property is empty')
      } else if (typeof config.clientSecret !== 'string') {
        errors.push('The `clientSecret` property must be a string')
      }
      if (!Array.isArray(config.clientScopes)) {
        errors.push('The `clientScopes` property must be an array')
      } else if (config.clientScopes.length === 0) {
        errors.push('The `clientScopes` property must have at least 1 scope defined')
      }
      if (!config.region) {
        errors.push('The `region` property is empty')
      } else if (typeof config.region !== 'string') {
        errors.push('The `region` property must be a string')
      } else if (!Object.prototype.hasOwnProperty.call(REGION_URLS, config.region)) {
        errors.push(
          `The \`region\` property value is not valid: ${config.region}. Must be one of: ${Object.keys(
            REGION_URLS,
          ).join(', ')}`,
        )
      }
    }

    if (errors.length) {
      throw new CommercetoolsError(
        'The configuration object passed in to the `CommercetoolsApi` constructor is not valid: \n' +
          errors.map((error) => `• ${error}`).join('\n'),
      )
    }
  }

  /**
   * Get a recurrence policy by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurrence-policies#recurrencepolicy
   */
  getRecurrencePolicyById(options: CommonRequestOptions & { id: string }): Promise<RecurrencePolicy> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurrence-policies/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Query recurrence policies
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurrence-policies#recurrencepolicy
   */
  queryRecurrencePolicies(options?: CommonRequestOptions): Promise<RecurrencePolicyPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/recurrence-policies',
      method: 'GET',
    })
  }

  /**
   * Check if a recurrence policy exists by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurrence-policies#recurrencepolicy
   */
  async checkRecurrencePolicyExistsById(options: CommonRequestOptions & { id: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/recurrence-policies/${encodeURIComponent(options.id)}`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if recurrence policies exist by query predicate
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurrence-policies#recurrencepolicy
   */
  async checkRecurrencePolicyExists(options?: CommonRequestOptions): Promise<boolean> {
    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/recurrence-policies`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Update a recurrence policy by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurrence-policies#recurrencepolicy
   */
  updateRecurrencePolicyById(
    options: CommonRequestOptions & { id: string; data: { version: number; actions: RecurrencePolicyUpdateAction[] } },
  ): Promise<RecurrencePolicy> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurrence-policies/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a recurrence policy by id
   * https://docs.commercetools.com/api/projects/recurrence-policies#delete-recurrencepolicy-by-id
   */
  deleteRecurrencePolicyById(
    options: CommonRequestOptions & { id: string; version: number },
  ): Promise<RecurrencePolicy> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurrence-policies/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete a recurrence policy by key
   * https://docs.commercetools.com/api/projects/recurrence-policies#delete-recurrencepolicy-by-key
   */
  deleteRecurrencePolicyByKey(
    options: CommonRequestOptions & { key: string; version: number },
  ): Promise<RecurrencePolicy> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurrence-policies/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Get a recurring order by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  getRecurringOrderById(options: CommonRequestOptions & { id: string }): Promise<RecurringOrder> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurring-orders/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Query recurring orders
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  queryRecurringOrders(options?: CommonRequestOptions): Promise<RecurringOrderPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/recurring-orders',
      method: 'GET',
    })
  }

  /**
   * Check if a recurring order exists by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  async checkRecurringOrderExistsById(options: CommonRequestOptions & { id: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/recurring-orders/${encodeURIComponent(options.id)}`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if recurring orders exist by query predicate
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  async checkRecurringOrderExists(options?: CommonRequestOptions): Promise<boolean> {
    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/recurring-orders`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Create a recurring order
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  createRecurringOrder(options: CommonRequestOptions & { data: RecurringOrderDraft }): Promise<RecurringOrder> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurring-orders`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update a recurring order by id
   * https://next-docs-subscriptions-docs.commercetools.vercel.app/api/projects/recurring-orders
   */
  updateRecurringOrderById(
    options: CommonRequestOptions & { id: string; data: { version: number; actions: RecurringOrderUpdateAction[] } },
  ): Promise<RecurringOrder> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurring-orders/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Delete a recurring order by id
   * https://docs.commercetools.com/api/projects/recurring-orders#delete-recurringorder-by-id
   */
  deleteRecurringOrderById(options: CommonRequestOptions & { id: string; version: number }): Promise<RecurringOrder> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/recurring-orders/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Retrieves an OrderEdit with the provided id.
   * https://docs.commercetools.com/api/projects/order-edits#get-orderedit-by-id
   */
  getOrderEditById(options: CommonRequestOptions & { id: string }): Promise<OrderEdit> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/${encodeURIComponent(options.id)}`,
      method: 'GET',
    })
  }

  /**
   * Retrieves an OrderEdit with the provided key.
   * https://docs.commercetools.com/api/projects/order-edits#get-orderedit-by-key
   */
  getOrderEditByKey(options: CommonRequestOptions & { key: string }): Promise<OrderEdit> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/key=${encodeURIComponent(options.key)}`,
      method: 'GET',
    })
  }

  /**
   * Query OrderEdits.
   * Retrieves OrderEdits in the Project.
   * https://docs.commercetools.com/api/projects/order-edits#query-orderedits
   */
  queryOrderEdits(options?: CommonRequestOptions): Promise<OrderEditPagedQueryResponse> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: '/orders/edits',
      method: 'GET',
    })
  }

  /**
   * Check if an order edit exists by id
   * https://docs.commercetools.com/api/projects/order-edits#check-if-orderedit-exists-by-id
   */
  async checkOrderEditExistsById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: this.applyStore(`/orders/edits/${encodeURIComponent(options.id)}`, options.storeKey),
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if an order edit exists by key
   * https://docs.commercetools.com/api/projects/order-edits#check-if-orderedit-exists-by-key
   */
  async checkOrderEditExistsByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<boolean> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: this.applyStore(`/orders/edits/key=${encodeURIComponent(options.key)}`, options.storeKey),
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Check if an order edit code exists by query predicate
   * https://docs.commercetools.com/api/projects/order-edits#check-if-orderedit-exists-by-query-predicate
   */
  async checkOrderEditExists(options?: CommonRequestOptions): Promise<boolean> {
    try {
      await this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/orders/edits`,
        method: 'HEAD',
      })
      return true
    } catch (error) {
      if (CommercetoolsError.isInstance(error) && error.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Create an OrderEdit.
   * https://docs.commercetools.com/api/projects/order-edits#create-orderedit
   */
  createOrderEdit(options: CommonRequestOptions & { data: OrderEditDraft }): Promise<OrderEdit> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update an OrderEdit by id:
   * https://docs.commercetools.com/api/projects/order-edits#update-orderedit-by-id
   */
  updateOrderEditById(options: CommonRequestOptions & { id: string; data: OrderEditUpdate }): Promise<OrderEdit> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/${encodeURIComponent(options.id)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Update an OrderEdit by key:
   * https://docs.commercetools.com/api/projects/order-edits#update-orderedit-by-key
   */
  updateOrderEditByKey(options: CommonRequestOptions & { key: string; data: OrderEditUpdate }): Promise<OrderEdit> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      path: `/orders/edits/key=${encodeURIComponent(options.key)}`,
      method: 'POST',
      data: options.data,
    })
  }

  /**
   * Apply actions from an OrderEdit to the Order by id:
   * https://docs.commercetools.com/api/projects/order-edits#apply-orderedit-by-id
   */
  applyOrderEditById(
    options: CommonRequestOptions & {
      id: string
      version: number
      editVersion: number
    },
  ): Promise<Order> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/${encodeURIComponent(options.id)}/apply`,
      method: 'POST',
      data: {
        editVersion: options.editVersion,
        resourceVersion: options.version,
      },
    })
  }

  /**
   * Delete an OrderEdit by id
   * https://docs.commercetools.com/api/projects/order-edits#delete-orderedit-by-id
   */
  deleteOrderEditById(options: CommonRequestOptions & { id: string; version: number }): Promise<OrderEdit> {
    ensureNonEmptyString({ value: options.id, name: 'id' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/${encodeURIComponent(options.id)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }

  /**
   * Delete an OrderEdit by key
   * https://docs.commercetools.com/api/projects/order-edits#delete-orderedit-by-key
   */
  deleteOrderEditByKey(options: CommonRequestOptions & { key: string; version: number }): Promise<OrderEdit> {
    ensureNonEmptyString({ value: options.key, name: 'key' })

    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/orders/edits/key=${encodeURIComponent(options.key)}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
      },
    })
  }
}
