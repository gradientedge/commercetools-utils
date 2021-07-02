import axios from 'axios'
import qs from 'qs'
import { CommercetoolsApiConfig } from './types'
import { CommercetoolsAuth } from '../'
import { CommercetoolsError } from '../error'
import { REGION_URLS } from '../auth/constants'
import { RegionEndpoints } from '../types'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants'
import { buildUserAgent } from '../utils'
import {
  Cart,
  CartDraft,
  CartUpdateAction,
  Category,
  CategoryDraft,
  CategoryUpdate,
  Customer,
  CustomerCreatePasswordResetToken,
  CustomerDraft,
  CustomerPagedQueryResponse,
  CustomerResetPassword,
  CustomerSignin,
  CustomerSignInResult,
  CustomerToken,
  CustomerUpdate,
  CustomObject,
  CustomObjectDraft,
  GraphQLRequest,
  GraphQLResponse,
  MyCartDraft,
  MyCustomerDraft,
  MyOrderFromCartDraft,
  MyPayment,
  MyPaymentDraft,
  Order,
  OrderPagedQueryResponse,
  OrderUpdate,
  Product,
  ProductDraft,
  ProductProjection,
  ProductType,
  ProductUpdate,
  Store,
  Type
} from '@commercetools/platform-sdk'

interface FetchOptions<T = Record<string, any>> {
  path: string
  headers?: Record<string, string>
  method: 'GET' | 'POST' | 'DELETE'
  params?: Record<string, any>
  data?: T
  accessToken?: string
  correlationId?: string
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
   * Query string parameters.
   */
  params?: Record<string, any>
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
  private readonly config: CommercetoolsApiConfig

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  private readonly endpoints: RegionEndpoints

  /**
   * The string that's sent over in the `User-Agent` header
   * when a request is made to commercetools.
   */
  private readonly userAgent: string

  constructor(config: CommercetoolsApiConfig) {
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
    this.userAgent = buildUserAgent(this.config.systemIdentifier)
  }

  /**
   * Get a store given it's id
   * https://docs.commercetools.com/api/projects/stores#get-a-store-by-id
   */
  getStoreById(options: CommonRequestOptions & { id: string }): Promise<Store> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/${options.id}`,
      method: 'GET'
    })
  }

  /**
   * Get a store given it's key
   * https://docs.commercetools.com/api/projects/stores#get-a-store-by-key
   */
  getStoreByKey(options: CommonRequestOptions & { key: string }): Promise<Store> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/stores/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get an individual category by id:
   * https://docs.commercetools.com/api/projects/categories#get-category-by-id
   */
  getCategoryById(id: string, params = {}): Promise<any> {
    return this.request({
      path: `/categories/${id}`,
      method: 'GET',
      params
    })
  }

  /**
   * Get an category by id or key. Either the id or the key must be provided.
   */
  getCategory(options: CommonRequestOptions & { id?: string; key?: string }): Promise<Category> {
    if (!options.id && !options.key) {
      throw new CommercetoolsError('Either an id, key or slug must be provided')
    }
    if (options.id) {
      return this.request({
        ...this.extractCommonRequestOptions(options),
        path: `/categories/${options.id}`,
        method: 'GET'
      })
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a category projection by slug and locale
   */
  async getCategoryBySlug(slug: string, languageCode: string, params = {}): Promise<any> {
    const data = await this.request({
      path: `/categories`,
      method: 'GET',
      params: {
        ...params,
        where: `slug(${languageCode}="${slug}")`
      }
    })
    return data.count ? data.results[0] : null
  }

  /**
   * Query categories
   * https://docs.commercetools.com/api/projects/categories#query-categories
   */
  queryCategories(params = {}): Promise<any> {
    return this.request({
      path: `/categories`,
      method: 'GET',
      params
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
        expand: 'ancestors[*]'
      }
    })
    const ancestors = category.ancestors.map((ref) => ref.obj as Category)
    ancestors.push({
      ...category,
      ancestors: category.ancestors.map((ancestor) => ({ id: ancestor.id, typeId: ancestor.typeId }))
    })
    return ancestors
  }

  /**
   * Get an individual product by id:
   * https://docs.commercetools.com/api/projects/products#get-product-by-id
   */
  getProductById(id: string, params = {}): Promise<any> {
    return this.request({
      path: `/products/${id}`,
      method: 'GET',
      params
    })
  }

  /**
   * Get an individual product by key:
   * https://docs.commercetools.com/api/projects/products#get-product-by-key
   */
  getProductByKey(options: CommonRequestOptions & { key: string }): Promise<Product> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a product projection by id
   * https://docs.commercetools.com/api/projects/productProjections#get-productprojection-by-id
   */
  getProductProjectionById(options: CommonRequestOptions & { id: string }): Promise<ProductProjection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-projections/${options.id}`,
      method: 'GET'
    })
  }

  /**
   * Get a product projection by key
   * https://docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key
   */
  getProductProjectionByKey(options: CommonRequestOptions & { key: string }): Promise<ProductProjection> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-projections/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a product projection by slug and locale
   */
  async getProductProjectionBySlug(slug: string, languageCode: string, params = {}): Promise<ProductProjection> {
    const data = await this.request({
      path: `/product-projections`,
      method: 'GET',
      params: {
        ...params,
        where: `slug(${languageCode}="${slug}")`
      }
    })
    return data.count ? data.results[0] : null
  }

  /**
   * Query product projections
   * https://docs.commercetools.com/api/projects/productProjections#query-productprojections
   */
  queryProductProjections(params = {}): Promise<any> {
    return this.request({
      path: `/product-projections`,
      method: 'GET',
      params
    })
  }

  /**
   * Query product projections
   * https://docs.commercetools.com/api/projects/products-search#search-productprojections
   */
  searchProductProjections(params = {}): Promise<any> {
    return this.request({
      path: `/product-projections/search`,
      method: 'GET',
      params
    })
  }

  /**
   * Get a cart by id
   * https://docs.commercetools.com/api/projects/carts#update-a-cart-by-id
   */
  async getCartById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Cart> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${options.id}`, options.storeKey),
      method: 'GET'
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
      data: options.data
    })
  }

  /**
   * Update a cart by id
   * https://docs.commercetools.com/api/projects/carts#update-a-cart-by-id
   */
  async updateCartById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; actions: CartUpdateAction[] }
  ): Promise<Cart> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${options.id}`, options.storeKey),
      method: 'POST',
      data: {
        version: options.version,
        actions: options.actions
      }
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
      accessToken: options.accessToken
    })
  }

  /**
   * Create a new cart for the customer associated with the given `accessToken` parameter:
   * https://docs.commercetools.com/api/projects/me-carts#create-a-cart-1
   */
  async createMyCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: MyCartDraft }
  ): Promise<Cart> {
    return this.request<MyCartDraft, Cart>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts`, options.storeKey),
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken
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
      path: this.applyStore(`/me/carts/${cart.id}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: cart.version
      },
      accessToken: options.accessToken
    })
  }

  /**
   * Update a customer's cart with the given actions. Note that we automatically
   * retrieve the customer's active cart using the given access token:
   * https://docs.commercetools.com/api/projects/me-carts#update-cart
   * https://docs.commercetools.com/api/projects/me-carts#update-actions
   */
  async updateMyActiveCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; actions: CartUpdateAction[] }
  ): Promise<Cart> {
    const cart = await this.getMyActiveCart(options)
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/carts/${cart.id}`, options.storeKey),
      method: 'POST',
      data: {
        version: cart.version,
        actions: options.actions
      },
      accessToken: options.accessToken
    })
  }

  /**
   * Create an order from the given cart id. The cart id and version are automatically
   * retrieved by looking up the customers active cart:
   * https://docs.commercetools.com/api/projects/me-orders#create-order-from-a-cart
   */
  async createMyOrderFromActiveCart(
    options: CommonStoreEnabledRequestOptions & { accessToken: string }
  ): Promise<Order> {
    const cart = await this.getMyActiveCart(options)
    return this.request<MyOrderFromCartDraft, Order>({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore('/me/orders', options.storeKey),
      method: 'POST',
      data: {
        version: cart.version,
        id: cart.id
      },
      accessToken: options.accessToken
    })
  }

  /**
   * Delete a cart by the given id:
   * https://docs.commercetools.com/api/projects/carts#delete-a-cart-by-id
   */
  async deleteCartById(options: CommonStoreEnabledRequestOptions & { id: string; version: number }): Promise<Cart> {
    return await this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/carts/${options.id}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version
      }
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
      accessToken: options.accessToken
    })
  }

  /**
   * Get an order by id using the customer's access token:
   * https://docs.commercetools.com/api/projects/me-orders#get-order-by-id
   */
  getMyOrderById(options: CommonStoreEnabledRequestOptions & { id: string; accessToken: string }): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/orders/${options.id}`, options.storeKey),
      method: 'GET',
      accessToken: options.accessToken
    })
  }

  /**
   * Update an order by id:
   * https://docs.commercetools.com/api/projects/orders#update-order-by-id
   */
  updateOrderById(options: CommonStoreEnabledRequestOptions & { id: string; data: OrderUpdate }): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${options.id}`, options.storeKey),
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Get an order by id:
   * https://docs.commercetools.com/api/projects/orders#get-order-by-id
   */
  getOrderById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${options.id}`, options.storeKey),
      method: 'GET'
    })
  }

  /**
   * Delete an order by id:
   * https://docs.commercetools.com/api/projects/orders#delete-order-by-id
   */
  deleteOrderById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; dataErasure?: boolean }
  ): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/${options.id}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure
      }
    })
  }

  /**
   * Delete an order by order number:
   * https://docs.commercetools.com/api/projects/orders#delete-order-by-ordernumber
   */
  deleteOrderByOrderNumber(
    options: CommonStoreEnabledRequestOptions & { orderNo: string; version: number; dataErasure?: boolean }
  ): Promise<Order> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/orders/order-number=${options.orderNo}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure
      }
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
      method: 'GET'
    })
  }

  /**
   * Create a product:
   * https://docs.commercetools.com/api/projects/products#create-a-product
   */
  createProduct(options: CommonRequestOptions & { data: ProductDraft }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a product by key:
   * https://docs.commercetools.com/api/projects/products#update-product-by-key
   */
  updateProductByKey(options: CommonRequestOptions & { key: string; data: ProductUpdate }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${options.key}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a product by id:
   * https://docs.commercetools.com/api/projects/products#update-product-by-id
   */
  updateProductById(options: CommonRequestOptions & { id: string; data: ProductUpdate }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${options.id}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Delete a product by id:
   * https://docs.commercetools.com/api/projects/products#delete-product-by-id
   *
   * @param {object} options Request options
   * @param {boolean} options.unpublish If true, the product will be unpublished before being deleted
   */
  async deleteProductById(options: CommonRequestOptions & { id: string; version: number; unpublish?: boolean }) {
    let version = options.version
    if (options.unpublish) {
      const product = await this.unpublishProductById({
        id: options.id,
        version: options.version
      })
      version = product.version
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${options.id}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version
      }
    })
  }

  /**
   * Delete a product by key:
   * https://docs.commercetools.com/api/projects/products#delete-product-by-key
   *
   * @param {object} options Request options
   * @param {boolean} options.unpublish If true, the product will be unpublished before being deleted
   */
  async deleteProductByKey(options: CommonRequestOptions & { key: string; version: number; unpublish?: boolean }) {
    let version = options.version
    if (options.unpublish) {
      const product = await this.unpublishProductByKey({
        key: options.key,
        version: options.version
      })
      version = product.version
    }
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${options.key}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version
      }
    })
  }

  /**
   * Unpublish a product by key
   *
   * Issues an 'unpublish' action for the given product:
   * https://docs.commercetools.com/api/projects/products#unpublish
   */
  unpublishProductByKey(options: CommonRequestOptions & { key: string; version: number }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${options.key}`,
      method: 'POST',
      params: options.params,
      data: {
        version: options.version,
        actions: [{ action: 'unpublish' }]
      }
    })
  }

  /**
   * Unpublish a product by id
   *
   * Issues an 'unpublish' action for the given product:
   * https://docs.commercetools.com/api/projects/products#unpublish
   */
  unpublishProductById(options: CommonRequestOptions & { id: string; version: number }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${options.id}`,
      method: 'POST',
      params: options.params,
      data: {
        version: options.version,
        actions: [{ action: 'unpublish' }]
      }
    })
  }

  /**
   * Create a category:
   * https://docs.commercetools.com/api/projects/categories#create-a-category
   */
  createCategory(options: CommonRequestOptions & { data: CategoryDraft }) {
    return this.request({
      path: `/categories`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a category by key:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-key
   */
  updateCategoryByKey(options: CommonRequestOptions & { key: string; data: CategoryUpdate }) {
    return this.request({
      path: `/categories/key=${options.key}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a category by id:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-id
   */
  updateCategoryById(options: CommonRequestOptions & { id: string; data: CategoryUpdate }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/${options.id}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Delete a category by id:
   * https://docs.commercetools.com/api/projects/categories#delete-category-by-id
   */
  deleteCategoryById(options: CommonRequestOptions & { id: string; version: number }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/${options.id}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version
      }
    })
  }

  /**
   * Delete a category by key:
   * https://docs.commercetools.com/api/projects/categories#delete-category-by-key
   */
  deleteCategoryByKey(options: CommonRequestOptions & { key: string; version: number }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/categories/key=${options.key}`,
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version
      }
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
      data: options.data
    })
  }

  /**
   * Delete a customer account by id
   * https://docs.commercetools.com/api/projects/customers#delete-customer-by-id
   */
  deleteCustomerById(
    options: CommonStoreEnabledRequestOptions & { id: string; version: number; dataErasure?: boolean }
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/${options.id}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure
      }
    })
  }

  /**
   * Delete a customer account by key
   * https://docs.commercetools.com/api/projects/customers#delete-customer-by-key
   */
  deleteCustomerByKey(
    options: CommonStoreEnabledRequestOptions & { key: string; version: number; dataErasure?: boolean }
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/key=${options.key}`, options.storeKey),
      method: 'DELETE',
      params: {
        ...options.params,
        version: options.version,
        dataErasure: options.dataErasure
      }
    })
  }

  /**
   * Create a customer account given an anonymous access token:
   * https://docs.commercetools.com/api/projects/me-profile#create-customer-sign-up
   */
  createMyAccount(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: MyCustomerDraft }
  ): Promise<CustomerSignInResult> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/signup`, options.storeKey),
      method: 'POST',
      data: options.data,
      accessToken: options.accessToken
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
      data: options.data
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
      accessToken: options.accessToken
    })
  }

  /**
   * Update a customer's account/profile:
   * https://docs.commercetools.com/api/projects/me-profile#update-customer
   */
  updateMyAccount(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: CustomerUpdate }
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data
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
    }
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/password`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data
    })
  }

  /**
   * Reset the customer's password:
   * https://docs.commercetools.com/api/projects/me-profile#reset-customers-password
   */
  resetMyPassword(
    options: CommonStoreEnabledRequestOptions & { accessToken: string; data: CustomerResetPassword }
  ): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/me/password/reset`, options.storeKey),
      method: 'POST',
      accessToken: options.accessToken,
      data: options.data
    })
  }

  /**
   * Get a password reset token
   * https://docs.commercetools.com/api/projects/customers#create-a-token-for-resetting-the-customers-password
   */
  getPasswordResetToken(
    options: CommonStoreEnabledRequestOptions & { data: CustomerCreatePasswordResetToken }
  ): Promise<CustomerToken> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/password-token`, options.storeKey),
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Get a customer by id:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-id
   */
  getCustomerById(options: CommonStoreEnabledRequestOptions & { id: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/${options.id}`, options.storeKey),
      method: 'GET'
    })
  }

  /**
   * Get a customer by key:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-key
   */
  getCustomerByKey(options: CommonStoreEnabledRequestOptions & { key: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/key=${options.key}`, options.storeKey),
      method: 'GET'
    })
  }

  /**
   * Get a customer by password token:
   * https://docs.commercetools.com/api/projects/customers#get-customer-by-password-token
   */
  getCustomerByPasswordToken(options: CommonStoreEnabledRequestOptions & { token: string }): Promise<Customer> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: this.applyStore(`/customers/password-token=${options.token}`, options.storeKey),
      method: 'GET'
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
      method: 'GET'
    })
  }

  /**
   * Get a product type by id:
   * https://docs.commercetools.com/api/projects/productTypes#get-a-producttype-by-id
   */
  getProductTypeById(options: CommonRequestOptions & { id: string }): Promise<ProductType> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-types/${options.id}`,
      method: 'GET'
    })
  }

  /**
   * Get a product type by key:
   * https://docs.commercetools.com/api/projects/productTypes#get-a-producttype-by-key
   */
  getProductTypeByKey(options: CommonRequestOptions & { key: string }): Promise<ProductType> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/product-types/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a type by id:
   * https://docs.commercetools.com/api/projects/types#get-type-by-id
   */
  getTypeById(options: CommonRequestOptions & { id: string }): Promise<Type> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/types/${options.id}`,
      method: 'GET'
    })
  }

  /**
   * Get a type by key:
   * https://docs.commercetools.com/api/projects/types#get-type-by-key
   */
  getTypeByKey(options: CommonRequestOptions & { key: string }): Promise<Type> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/types/key=${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a custom object
   * https://docs.commercetools.com/api/projects/custom-objects#get-customobject-by-container-and-key
   */
  getCustomObject(options: CommonRequestOptions & { container: string; key: string }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${options.container}/${options.key}`,
      method: 'GET'
    })
  }

  /**
   * Get a custom object by id
   * https://docs.commercetools.com/api/projects/custom-objects#get-customobject
   */
  getCustomObjectById(options: CommonRequestOptions & { id: string }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${options.id}`,
      method: 'GET'
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
      data: options.data
    })
  }

  /**
   * Delete a custom object
   * https://docs.commercetools.com/api/projects/custom-objects#delete-customobject-by-container-and-key
   */
  deleteCustomObject(options: CommonRequestOptions & { container: string; key: string }): Promise<CustomObject> {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/custom-objects/${options.container}/${options.key}`,
      method: 'DELETE'
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
      accessToken: options.accessToken
    })
  }

  /**
   * Make the request to the commercetools REST API.
   */
  async request<T = any, R = any>(options: FetchOptions<T>): Promise<R> {
    let accessToken = options.accessToken
    const url = `${this.endpoints.api}/${this.config.projectKey}${options.path}`
    const opts: any = { ...options }
    opts.path && delete opts.path
    opts.accessToken && delete opts.accessToken

    if (!accessToken) {
      const grant = await this.auth.getClientGrant()
      accessToken = grant.accessToken
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      ...opts.headers
    }
    if (process?.release?.name) {
      headers['User-Agent'] = this.userAgent
    }
    if (typeof options.correlationId === 'string' && options.correlationId !== '') {
      headers['X-Correlation-ID'] = options.correlationId
      delete options.correlationId
    }
    try {
      const response = await axios({
        ...opts,
        url,
        headers,
        timeout: this.config.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
      return response.data
    } catch (error) {
      if (error.isAxiosError) {
        throw CommercetoolsError.fromAxiosError(error)
      }
      throw error
    }
  }

  /**
   * Type-guard against any additional unexpected properties being passed in.
   */
  private extractCommonRequestOptions(options: CommonRequestOptions): CommonRequestOptions {
    return {
      correlationId: options.correlationId,
      params: options.params
    }
  }

  /**
   * Applies the store key to a given path
   */
  applyStore(path: string, storeKey: string | undefined | null) {
    if (typeof storeKey === 'string' && storeKey !== '') {
      return `/in-store/key=${storeKey}${path}`
    } else if (this.config.storeKey) {
      return `/in-store/key=${this.config.storeKey}${path}`
    }
    return path
  }
}
