import { CartReference, CartResourceIdentifier } from './cart'
import { CartDiscountReference, CartDiscountResourceIdentifier } from './cart-discount'
import { CategoryReference, CategoryResourceIdentifier } from './category'
import { ChannelReference, ChannelResourceIdentifier } from './channel'
import { CustomObjectReference } from './custom-object'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { CustomerGroupReference, CustomerGroupResourceIdentifier } from './customer-group'
import { DiscountCodeReference, DiscountCodeResourceIdentifier } from './discount-code'
import { InventoryEntryReference, InventoryEntryResourceIdentifier } from './inventory'
import { OrderReference, OrderResourceIdentifier } from './order'
import { OrderEditReference, OrderEditResourceIdentifier } from './order-edit'
import { PaymentReference, PaymentResourceIdentifier } from './payment'
import { ProductReference, ProductResourceIdentifier } from './product'
import { ProductDiscountReference, ProductDiscountResourceIdentifier } from './product-discount'
import { ProductSelectionReference, ProductSelectionResourceIdentifier } from './product-selection'
import { ProductTypeReference, ProductTypeResourceIdentifier } from './product-type'
import { ReviewReference, ReviewResourceIdentifier } from './review'
import { ShippingMethodReference, ShippingMethodResourceIdentifier } from './shipping-method'
import { ShoppingListReference, ShoppingListResourceIdentifier } from './shopping-list'
import { StateReference, StateResourceIdentifier } from './state'
import { StoreKeyReference, StoreReference, StoreResourceIdentifier } from './store'
import { TaxCategoryReference, TaxCategoryResourceIdentifier } from './tax-category'
import { CustomFields, CustomFieldsDraft, TypeReference, TypeResourceIdentifier } from './type'
import { ZoneReference, ZoneResourceIdentifier } from './zone'
export interface PagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: BaseResource[]
  readonly meta?: any
}
export interface Update {
  readonly version: number
  readonly actions: UpdateAction[]
}
export interface UpdateAction {
  readonly action: string
}
export interface Asset {
  readonly id: string
  readonly sources: AssetSource[]
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly tags?: string[]
  readonly custom?: CustomFields
  readonly key?: string
}
export interface AssetDimensions {
  readonly w: number
  readonly h: number
}
export interface AssetDraft {
  readonly sources: AssetSource[]
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly tags?: string[]
  readonly custom?: CustomFieldsDraft
  readonly key?: string
}
export interface AssetSource {
  readonly uri: string
  readonly key?: string
  readonly dimensions?: AssetDimensions
  readonly contentType?: string
}
export interface BaseAddress {
  readonly id?: string
  readonly key?: string
  readonly title?: string
  readonly salutation?: string
  readonly firstName?: string
  readonly lastName?: string
  readonly streetName?: string
  readonly streetNumber?: string
  readonly additionalStreetInfo?: string
  readonly postalCode?: string
  readonly city?: string
  readonly region?: string
  readonly state?: string
  readonly country: string
  readonly company?: string
  readonly department?: string
  readonly building?: string
  readonly apartment?: string
  readonly pOBox?: string
  readonly phone?: string
  readonly mobile?: string
  readonly email?: string
  readonly fax?: string
  readonly additionalAddressInfo?: string
  readonly externalId?: string
}
export interface Address extends BaseAddress {
  readonly custom?: CustomFields
}
export interface AddressDraft extends BaseAddress {
  readonly custom?: CustomFieldsDraft
}
export interface BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
}
export interface ClientLogging {
  readonly clientId?: string
  readonly externalUserId?: string
  readonly customer?: CustomerReference
  readonly anonymousId?: string
}
export interface CreatedBy extends ClientLogging {}
export interface DiscountedPrice {
  readonly value: TypedMoney
  readonly discount: ProductDiscountReference
}
export interface DiscountedPriceDraft {
  readonly value: Money
  readonly discount: ProductDiscountReference
}
export declare type GeoJson = GeoJsonPoint
export interface GeoJsonPoint {
  readonly type: 'Point'
  readonly coordinates: number[]
}
export interface Image {
  readonly url: string
  readonly dimensions: ImageDimensions
  readonly label?: string
}
export interface ImageDimensions {
  readonly w: number
  readonly h: number
}
export declare type KeyReference = StoreKeyReference
export interface LastModifiedBy extends ClientLogging {}
export interface LocalizedString {
  [key: string]: string
}
export interface Money {
  readonly centAmount: number
  readonly currencyCode: string
}
export declare type MoneyType = 'centPrecision' | 'highPrecision'
export interface Price {
  readonly id: string
  readonly value: TypedMoney
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPrice
  readonly custom?: CustomFields
  readonly tiers?: PriceTier[]
}
export interface PriceDraft {
  readonly value: Money
  readonly country?: string
  readonly customerGroup?: CustomerGroupResourceIdentifier
  readonly channel?: ChannelResourceIdentifier
  readonly validFrom?: string
  readonly validUntil?: string
  readonly custom?: CustomFieldsDraft
  readonly tiers?: PriceTierDraft[]
  readonly discounted?: DiscountedPriceDraft
}
export interface PriceTier {
  readonly minimumQuantity: number
  readonly value: TypedMoney
}
export interface PriceTierDraft {
  readonly minimumQuantity: number
  readonly value: Money
}
export interface QueryPrice {
  readonly id: string
  readonly value: Money
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPriceDraft
  readonly custom?: CustomFields
  readonly tiers?: PriceTierDraft[]
}
export declare type Reference =
  | CartDiscountReference
  | CartReference
  | CategoryReference
  | ChannelReference
  | CustomObjectReference
  | CustomerGroupReference
  | CustomerReference
  | DiscountCodeReference
  | InventoryEntryReference
  | OrderEditReference
  | OrderReference
  | PaymentReference
  | ProductDiscountReference
  | ProductReference
  | ProductSelectionReference
  | ProductTypeReference
  | ReviewReference
  | ShippingMethodReference
  | ShoppingListReference
  | StateReference
  | StoreReference
  | TaxCategoryReference
  | TypeReference
  | ZoneReference
export declare type ReferenceTypeId =
  | 'cart'
  | 'cart-discount'
  | 'category'
  | 'channel'
  | 'customer'
  | 'customer-email-token'
  | 'customer-group'
  | 'customer-password-token'
  | 'discount-code'
  | 'extension'
  | 'inventory-entry'
  | 'key-value-document'
  | 'order'
  | 'order-edit'
  | 'payment'
  | 'product'
  | 'product-discount'
  | 'product-selection'
  | 'product-type'
  | 'review'
  | 'shipping-method'
  | 'shopping-list'
  | 'state'
  | 'store'
  | 'subscription'
  | 'tax-category'
  | 'type'
  | 'zone'
export declare type ResourceIdentifier =
  | CartDiscountResourceIdentifier
  | CartResourceIdentifier
  | CategoryResourceIdentifier
  | ChannelResourceIdentifier
  | CustomerGroupResourceIdentifier
  | CustomerResourceIdentifier
  | DiscountCodeResourceIdentifier
  | InventoryEntryResourceIdentifier
  | OrderEditResourceIdentifier
  | OrderResourceIdentifier
  | PaymentResourceIdentifier
  | ProductDiscountResourceIdentifier
  | ProductResourceIdentifier
  | ProductSelectionResourceIdentifier
  | ProductTypeResourceIdentifier
  | ReviewResourceIdentifier
  | ShippingMethodResourceIdentifier
  | ShoppingListResourceIdentifier
  | StateResourceIdentifier
  | StoreResourceIdentifier
  | TaxCategoryResourceIdentifier
  | TypeResourceIdentifier
  | ZoneResourceIdentifier
export interface ScopedPrice {
  readonly id: string
  readonly value: TypedMoney
  readonly currentValue: TypedMoney
  readonly country?: string
  readonly customerGroup?: CustomerGroupReference
  readonly channel?: ChannelReference
  readonly validFrom?: string
  readonly validUntil?: string
  readonly discounted?: DiscountedPrice
  readonly custom?: CustomFields
}
export declare type TypedMoney = CentPrecisionMoney | HighPrecisionMoney
export interface CentPrecisionMoney {
  readonly type: 'centPrecision'
  readonly currencyCode: string
  readonly centAmount: number
  readonly fractionDigits: number
}
export interface HighPrecisionMoney {
  readonly type: 'highPrecision'
  readonly currencyCode: string
  readonly centAmount: number
  readonly fractionDigits: number
  readonly preciseAmount: number
}
export declare type TypedMoneyDraft = CentPrecisionMoneyDraft | HighPrecisionMoneyDraft
export interface CentPrecisionMoneyDraft {
  readonly type: 'centPrecision'
  readonly centAmount: number
  readonly currencyCode: string
  readonly fractionDigits?: number
}
export interface HighPrecisionMoneyDraft {
  readonly type: 'highPrecision'
  readonly centAmount: number
  readonly currencyCode: string
  readonly fractionDigits?: number
  readonly preciseAmount: number
}
//# sourceMappingURL=common.d.ts.map
