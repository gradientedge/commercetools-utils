import { CommercetoolsRetryConfig } from './api/index.js'

/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
export enum Region {
  NORTH_AMERICA_GCP = 'north_america_gcp',
  NORTH_AMERICA_AWS = 'north_america_aws',
  EUROPE_GCP = 'europe_gcp',
  EUROPE_AWS = 'europe_aws',
  AUSTRALIA_GCP = 'australia_gcp',
}

/**
 * The Authentication and API endpoints for a particular region
 */
export interface RegionEndpoints {
  /**
   * The url to the commercetools auth endpoint for the region
   */
  auth: string
  /**
   * The url to the commercetools API endpoint for the region
   */
  api: string
}

/**
 * Provides a base configuration definition from which other class
 * specific configurations can be extended.
 */
export interface CommercetoolsBaseConfig extends CommercetoolsHooks {
  projectKey: string
  storeKey?: string
  clientId: string
  clientSecret: string
  region: Region
  timeoutMs?: number
  retry?: Partial<CommercetoolsRetryConfig>

  /**
   * If provided, will be passed across to commercetools in the
   * 'User-Agent' HTTP header, in order to help commercetools
   * identify the source of incoming requests.
   */
  systemIdentifier?: string
}

export interface CommercetoolsHooks {
  /**
   * If passed in, will be called before sending a request to commercetools.
   * The {@see requestConfig} parameter can be manipulated if you wish to
   * modify/add headers or any other request data.
   */
  onBeforeRequest?: (requestConfig: CommercetoolsRequest) => Promise<CommercetoolsRequest> | CommercetoolsRequest

  /**
   * If passed in, will be called once a request has been made and the
   * response received (or error thrown).
   */
  onAfterResponse?: (response: CommercetoolsRequestResponse) => void
}

/**
 * Represents a request about to be made to commercetools
 */
export interface CommercetoolsRequest {
  url: string
  method: string
  params?: Record<string, string | number | boolean>
  headers: Record<string, string>
  data?: any
}

/**
 * Represents the request and response for a request made to commercetools
 */
export interface CommercetoolsRequestResponse {
  request: {
    url: string
    method: string
    params?: Record<string, string | number | boolean> | undefined
    headers?: Record<string, string> | undefined
    data?: any
  }
  response: {
    code?: string | undefined
    message?: string | undefined
    status?: number
    headers?: Record<string, string> | undefined
    data?: any
  }
  stats: CommercetoolsRequestResponseStats
}

export interface CommercetoolsRequestResponseStats {
  accumulativeDurationMs: number
  durationMs: number
  retries: number
}

export interface RequestExecutor<T = any> {
  (options: CommercetoolsRequest): Promise<T>
}

export type {
  Address,
  AddressDraft,
  Attribute,
  AttributePlainEnumValue,
  AssetSource,
  BaseResource,
  Cart,
  CartAddLineItemAction,
  CartSetCustomerEmailAction,
  CartDiscount,
  CartDiscountPagedQueryResponse,
  CartDraft,
  CartPagedQueryResponse,
  CartSetCustomShippingMethodAction,
  CartUpdateAction,
  Category,
  CategoryDraft,
  CategoryPagedQueryResponse,
  CategoryUpdate,
  CentPrecisionMoney,
  Channel,
  ChannelPagedQueryResponse,
  ChannelReference,
  ChannelResourceIdentifier,
  Customer,
  CustomerCreatePasswordResetToken,
  CustomerDraft,
  CustomFieldsDraft,
  CustomerGroup,
  CustomerGroupDraft,
  CustomerGroupReference,
  CustomerGroupPagedQueryResponse,
  CustomerGroupUpdate,
  CustomerPagedQueryResponse,
  CustomerResetPassword,
  CustomerSignin,
  CustomerSignInResult,
  CustomerToken,
  CustomerUpdate,
  CustomObject,
  CustomObjectDraft,
  CustomerUpdateAction,
  Delivery,
  DiscountCode,
  ExternalTaxRateDraft,
  GraphQLRequest,
  GraphQLResponse,
  FieldContainer,
  Image,
  InventoryEntry,
  InventoryEntryDraft,
  InventoryEntryUpdateAction,
  InventoryPagedQueryResponse,
  LineItem,
  LocalizedString,
  MyCartDraft,
  MyCartSetShippingMethodAction,
  MyCartUpdateAction,
  MyCustomerDraft,
  MyOrderFromCartDraft,
  MyPayment,
  MyPaymentDraft,
  MyPaymentPagedQueryResponse,
  MyPaymentUpdate,
  Money,
  Order,
  OrderFromCartDraft,
  OrderImportDraft,
  OrderPagedQueryResponse,
  OrderUpdate,
  OrderUpdateAction,
  PagedQueryResponse,
  Parcel,
  Payment,
  PaymentDraft,
  PaymentPagedQueryResponse,
  PaymentReference,
  PaymentUpdate,
  PaymentUpdateAction,
  Price,
  Product,
  ProductDraft,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductSelection,
  ProductSelectionDraft,
  ProductSelectionPagedQueryResponse,
  ProductSelectionUpdateAction,
  ProductsInStorePagedQueryResponse,
  ProductVariant,
  ProductType,
  ProductCatalogData,
  ProductTypePagedQueryResponse,
  ProductUpdate,
  ReplicaCartDraft,
  ResourceCreatedDeliveryPayload,
  ResourceDeletedDeliveryPayload,
  ResourceUpdatedDeliveryPayload,
  ShippingInfo,
  ShippingMethod,
  ShippingMethodPagedQueryResponse,
  ShippingMethodResourceIdentifier,
  StandalonePrice,
  StandalonePriceDraft,
  StandalonePricePagedQueryResponse,
  StandalonePriceUpdate,
  State,
  StateReference,
  StatePagedQueryResponse,
  Store,
  StoreDraft,
  StorePagedQueryResponse,
  StoreUpdate,
  TaxCategory,
  TaxCategoryPagedQueryResponse,
  TaxedItemPrice,
  TaxRate,
  Transaction,
  Type,
  TypedMoney,
  TypePagedQueryResponse,
  TypeReference,
  ZoneRate,
} from '@commercetools/platform-sdk'
