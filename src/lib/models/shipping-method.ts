/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString, Money, TypedMoney } from './common'
import { TaxCategoryReference, TaxCategoryResourceIdentifier } from './tax-category'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
import { ZoneReference, ZoneResourceIdentifier } from './zone'

export interface PriceFunction {
  /**
   *	The currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   *
   */
  readonly currencyCode: string
  /**
   *
   */
  readonly function: string
}
export interface ShippingMethod extends BaseResource {
  /**
   *	Platform-generated unique identifier of the ShippingMethod.
   *
   */
  readonly id: string
  /**
   *	The current version of the shipping method.
   *
   */
  readonly version: number
  /**
   *
   */
  readonly createdAt: string
  /**
   *
   */
  readonly lastModifiedAt: string
  /**
   *	Present on resources created after 1 February 2019 except for [events not tracked](/client-logging#events-tracked).
   *
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1 February 2019 except for [events not tracked](/client-logging#events-tracked).
   *
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	User-defined unique identifier of the ShippingMethod.
   *
   */
  readonly key?: string
  /**
   *
   */
  readonly name: string
  /**
   *
   */
  readonly localizedName?: LocalizedString
  /**
   *
   */
  readonly description?: string
  /**
   *
   */
  readonly localizedDescription?: LocalizedString
  /**
   *
   */
  readonly taxCategory: TaxCategoryReference
  /**
   *
   */
  readonly zoneRates: ZoneRate[]
  /**
   *	One shipping method in a project can be default.
   *
   */
  readonly isDefault: boolean
  /**
   *	A Cart predicate which can be used to more precisely select a shipping method for a cart.
   *
   */
  readonly predicate?: string
  /**
   *
   */
  readonly custom?: CustomFields
}
export interface ShippingMethodDraft {
  /**
   *	User-defined unique identifier for the ShippingMethod.
   *
   *
   */
  readonly key?: string
  /**
   *
   */
  readonly name: string
  /**
   *
   */
  readonly localizedName?: LocalizedString
  /**
   *
   */
  readonly description?: string
  /**
   *
   */
  readonly localizedDescription?: LocalizedString
  /**
   *
   */
  readonly taxCategory: TaxCategoryResourceIdentifier
  /**
   *
   */
  readonly zoneRates: ZoneRateDraft[]
  /**
   *	If `true` the shipping method will be the default one in a project.
   *
   */
  readonly isDefault: boolean
  /**
   *	A Cart predicate which can be used to more precisely select a shipping method for a cart.
   *
   */
  readonly predicate?: string
  /**
   *
   */
  readonly custom?: CustomFieldsDraft
}
export interface ShippingMethodPagedQueryResponse {
  /**
   *
   */
  readonly limit?: number
  /**
   *
   */
  readonly count: number
  /**
   *
   */
  readonly total?: number
  /**
   *
   */
  readonly offset?: number
  /**
   *
   */
  readonly results: ShippingMethod[]
}
/**
 *	[Reference](/../api/types#reference) to a [ShippingMethod](ctp:api:type:ShippingMethod).
 *
 */
export interface ShippingMethodReference {
  readonly typeId: 'shipping-method'
  /**
   *	Platform-generated unique identifier of the referenced [ShippingMethod](ctp:api:type:ShippingMethod).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded Review. Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for ShippingMethods.
   *
   *
   */
  readonly obj?: ShippingMethod
}
/**
 *	[ResourceIdentifier](/../api/types#resourceidentifier) to a [ShippingMethod](ctp:api:type:ShippingMethod).
 *
 */
export interface ShippingMethodResourceIdentifier {
  readonly typeId: 'shipping-method'
  /**
   *	Platform-generated unique identifier of the referenced [ShippingMethod](ctp:api:type:ShippingMethod). Either `id` or `key` is required.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced [ShippingMethod](ctp:api:type:ShippingMethod). Either `id` or `key` is required.
   *
   *
   */
  readonly key?: string
}
export interface ShippingMethodUpdate {
  /**
   *
   */
  readonly version: number
  /**
   *
   */
  readonly actions: ShippingMethodUpdateAction[]
}
export type ShippingMethodUpdateAction =
  | ShippingMethodAddShippingRateAction
  | ShippingMethodAddZoneAction
  | ShippingMethodChangeIsDefaultAction
  | ShippingMethodChangeNameAction
  | ShippingMethodChangeTaxCategoryAction
  | ShippingMethodRemoveShippingRateAction
  | ShippingMethodRemoveZoneAction
  | ShippingMethodSetCustomFieldAction
  | ShippingMethodSetCustomTypeAction
  | ShippingMethodSetDescriptionAction
  | ShippingMethodSetKeyAction
  | ShippingMethodSetLocalizedDescriptionAction
  | ShippingMethodSetLocalizedNameAction
  | ShippingMethodSetPredicateAction
export interface ShippingRate {
  /**
   *
   */
  readonly price: TypedMoney
  /**
   *	The shipping is free if the order total (the sum of line item prices) exceeds the `freeAbove` value.
   *	Note: `freeAbove` applies before any Cart or Product discounts, and can cause discounts to apply in invalid scenarios.
   *	Use a Cart Discount to set the shipping price to 0 to avoid providing free shipping in invalid discount scenarios.
   *
   */
  readonly freeAbove?: TypedMoney
  /**
   *	Only appears in response to requests for shipping methods by cart or location to mark this shipping rate as one that matches the cart or location.
   *
   */
  readonly isMatching?: boolean
  /**
   *	A list of shipping rate price tiers.
   *
   */
  readonly tiers: ShippingRatePriceTier[]
}
export interface ShippingRateDraft {
  /**
   *
   */
  readonly price: Money
  /**
   *	The shipping is free if the order total (the sum of line item prices) exceeds the freeAbove value.
   *	Note: `freeAbove` applies before any Cart or Product discounts, and can cause discounts to apply in invalid scenarios.
   *	Use a Cart Discount to set the shipping price to 0 to avoid providing free shipping in invalid discount scenarios.
   *
   */
  readonly freeAbove?: Money
  /**
   *	A list of shipping rate price tiers.
   *
   */
  readonly tiers?: ShippingRatePriceTier[]
}
export type ShippingRatePriceTier = CartClassificationTier | CartScoreTier | CartValueTier
export interface CartClassificationTier {
  readonly type: 'CartClassification'
  /**
   *
   */
  readonly value: string
  /**
   *	Draft type that stores amounts in cent precision for the specified currency.
   *	For storing money values in fractions of the minor unit in a currency, use [HighPrecisionMoneyDraft](ctp:api:type:HighPrecisionMoneyDraft) instead.
   *
   *
   */
  readonly price: Money
  /**
   *
   */
  readonly isMatching?: boolean
}
export interface CartScoreTier {
  readonly type: 'CartScore'
  /**
   *
   */
  readonly score: number
  /**
   *	Draft type that stores amounts in cent precision for the specified currency.
   *	For storing money values in fractions of the minor unit in a currency, use [HighPrecisionMoneyDraft](ctp:api:type:HighPrecisionMoneyDraft) instead.
   *
   *
   */
  readonly price?: Money
  /**
   *
   */
  readonly priceFunction?: PriceFunction
  /**
   *
   */
  readonly isMatching?: boolean
}
export interface CartValueTier {
  readonly type: 'CartValue'
  /**
   *
   */
  readonly minimumCentAmount: number
  /**
   *	Draft type that stores amounts in cent precision for the specified currency.
   *	For storing money values in fractions of the minor unit in a currency, use [HighPrecisionMoneyDraft](ctp:api:type:HighPrecisionMoneyDraft) instead.
   *
   *
   */
  readonly price: Money
  /**
   *
   */
  readonly isMatching?: boolean
}
/**
 *	Can be one of the following or absent.
 */
export type ShippingRateTierType = 'CartClassification' | 'CartScore' | 'CartValue'
export interface ZoneRate {
  /**
   *
   */
  readonly zone: ZoneReference
  /**
   *	The array does not contain two shipping rates with the same currency.
   *
   */
  readonly shippingRates: ShippingRate[]
}
export interface ZoneRateDraft {
  /**
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *	The array must not contain two shipping rates with the same currency.
   *
   */
  readonly shippingRates: ShippingRateDraft[]
}
export interface ShippingMethodAddShippingRateAction {
  readonly action: 'addShippingRate'
  /**
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *
   */
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodAddZoneAction {
  readonly action: 'addZone'
  /**
   *
   */
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodChangeIsDefaultAction {
  readonly action: 'changeIsDefault'
  /**
   *	Only one ShippingMethod in a project can be default.
   *
   */
  readonly isDefault: boolean
}
export interface ShippingMethodChangeNameAction {
  readonly action: 'changeName'
  /**
   *
   */
  readonly name: string
}
export interface ShippingMethodChangeTaxCategoryAction {
  readonly action: 'changeTaxCategory'
  /**
   *
   */
  readonly taxCategory: TaxCategoryResourceIdentifier
}
export interface ShippingMethodRemoveShippingRateAction {
  readonly action: 'removeShippingRate'
  /**
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *
   */
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodRemoveZoneAction {
  readonly action: 'removeZone'
  /**
   *
   */
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodSetCustomFieldAction {
  readonly action: 'setCustomField'
  /**
   *	Name of the [Custom Field](/../api/projects/custom-fields).
   *
   *
   */
  readonly name: string
  /**
   *	If `value` is absent or `null`, this field will be removed if it exists.
   *	Trying to remove a field that does not exist will fail with an [InvalidOperation](/../api/errors#general-400-invalid-operation) error.
   *	If `value` is provided, it is set for the field defined by `name`.
   *
   *
   */
  readonly value?: any
}
export interface ShippingMethodSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the ShippingMethod with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the ShippingMethod.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the ShippingMethod.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface ShippingMethodSetDescriptionAction {
  readonly action: 'setDescription'
  /**
   *
   */
  readonly description?: string
}
export interface ShippingMethodSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, it is removed if it exists.
   *
   */
  readonly key?: string
}
export interface ShippingMethodSetLocalizedDescriptionAction {
  readonly action: 'setLocalizedDescription'
  /**
   *
   */
  readonly localizedDescription?: LocalizedString
}
export interface ShippingMethodSetLocalizedNameAction {
  readonly action: 'setLocalizedName'
  /**
   *
   */
  readonly localizedName?: LocalizedString
}
export interface ShippingMethodSetPredicateAction {
  readonly action: 'setPredicate'
  /**
   *	A valid Cart predicate.
   *	If `predicate` is absent or `null`, it is removed if it exists.
   *
   */
  readonly predicate?: string
}