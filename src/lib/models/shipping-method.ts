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
   *	Currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   *
   */
  readonly currencyCode: string
  /**
   *	To calculate a Price based on the score, use `+`, `-`, `*` and parentheses. The score is inserted with `x`. The function returns the cent amount.
   *
   *	For example, to charge $1.99 for a score of `1`, $3.99 for a score of `2`, \$5.99 for a score of `3` and onwards, the function is: `(200 * x) - 1)`. To charge $4.50, $6.00, and \$7.50 for express shipping, the function is: `(150 * x) + 300`.
   *
   *
   */
  readonly function: string
}
export interface ShippingMethod extends BaseResource {
  /**
   *	Unique identifier of the ShippingMethod.
   *
   */
  readonly id: string
  /**
   *	Current version of the ShippingMethod.
   *
   */
  readonly version: number
  /**
   *	Date and time (UTC) the ShippingMethod was initially created.
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) the ShippingMethod was last updated.
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
   *	Name of the ShippingMethod.
   *
   */
  readonly name: string
  /**
   *	Localized name of the ShippingMethod.
   *
   */
  readonly localizedName?: LocalizedString
  /**
   *	Description of the ShippingMethod.
   *	@deprecated
   */
  readonly description?: string
  /**
   *	Localized description of the ShippingMethod.
   *
   */
  readonly localizedDescription?: LocalizedString
  /**
   *	[TaxCategory](ctp:api:type:TaxCategory) of all ZoneRates of the ShippingMethod.
   *
   *
   */
  readonly taxCategory: TaxCategoryReference
  /**
   *	Defines [ShippingRates](ctp:api:type:ShippingRate) (prices) for specific Zones.
   *
   */
  readonly zoneRates: ZoneRate[]
  /**
   *	If `true` this ShippingMethod is the [Project](ctp:api:type:Project)'s default ShippingMethod.
   *
   */
  readonly isDefault: boolean
  /**
   *	Valid [Cart predicate](/projects/predicates#cart-predicates) to select a ShippingMethod for a Cart.
   *
   *
   */
  readonly predicate?: string
  /**
   *	Custom Fields of the ShippingMethod.
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
   *	Name of the ShippingMethod.
   *
   */
  readonly name: string
  /**
   *	Localized name of the ShippingMethod.
   *
   */
  readonly localizedName?: LocalizedString
  /**
   *	Description of the ShippingMethod.
   *	@deprecated
   */
  readonly description?: string
  /**
   *	Localized description of the ShippingMethod.
   *
   */
  readonly localizedDescription?: LocalizedString
  /**
   *	[TaxCategory](ctp:api:type:TaxCategory) for all ZoneRates of the ShippingMethod.
   *
   *
   */
  readonly taxCategory: TaxCategoryResourceIdentifier
  /**
   *	Defines [ShippingRates](ctp:api:type:ShippingRate) (prices) for specific zones.
   *
   */
  readonly zoneRates: ZoneRateDraft[]
  /**
   *	If `true` the ShippingMethod will be the [Project](ctp:api:type:Project)'s default ShippingMethod.
   *
   */
  readonly isDefault: boolean
  /**
   *	Valid [Cart predicate](/projects/predicates#cart-predicates) to select a ShippingMethod for a Cart.
   *
   *
   */
  readonly predicate?: string
  /**
   *	Custom Fields for the ShippingMethod.
   *
   */
  readonly custom?: CustomFieldsDraft
}
/**
 *	[PagedQueryResult](/general-concepts#pagedqueryresult) with `results` containing an array of [ShippingMethod](ctp:api:type:ShippingMethod).
 *
 */
export interface ShippingMethodPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit?: number
  /**
   *	Actual number of results returned.
   *
   *
   */
  readonly count: number
  /**
   *	Total number of results matching the query.
   *	This number is an estimation that is not [strongly consistent](/../api/general-concepts#strong-consistency).
   *	This field is returned by default.
   *	For improved performance, calculating this field can be deactivated by using the query parameter `withTotal=false`.
   *	When the results are filtered with a [Query Predicate](/../api/predicates/query), `total` is subject to a [limit](/../api/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	Number of [elements skipped](/../api/general-concepts#offset).
   *
   *
   */
  readonly offset?: number
  /**
   *	[Shipping Methods](ctp:api:type:ShippingMethod) matching the query.
   *
   *
   */
  readonly results: ShippingMethod[]
}
/**
 *	[Reference](ctp:api:type:Reference) to a [ShippingMethod](ctp:api:type:ShippingMethod).
 *
 */
export interface ShippingMethodReference {
  readonly typeId: 'shipping-method'
  /**
   *	Unique identifier of the referenced [ShippingMethod](ctp:api:type:ShippingMethod).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded ShippingMethod. Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for ShippingMethods.
   *
   *
   */
  readonly obj?: ShippingMethod
}
/**
 *	[ResourceIdentifier](ctp:api:type:ResourceIdentifier) to a [ShippingMethod](ctp:api:type:ShippingMethod).
 *
 */
export interface ShippingMethodResourceIdentifier {
  readonly typeId: 'shipping-method'
  /**
   *	Unique identifier of the referenced [ShippingMethod](ctp:api:type:ShippingMethod). Either `id` or `key` is required.
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
   *	Expected version of the ShippingMethod on which the changes should be applied. If the expected version does not match the actual version, a 409 Conflict will be returned.
   *
   *
   */
  readonly version: number
  /**
   *	Update actions to be performed on the [ShippingMethod](/projects/shippingMethods#shippingmethod).
   *
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
   *	Currency amount of the ShippingRate.
   *
   */
  readonly price: TypedMoney
  /**
   *	Shipping is free if the sum of the (Custom) Line Item Prices reaches the specified value.
   *
   */
  readonly freeAbove?: TypedMoney
  /**
   *	`true` if the ShippingRate matches given [Cart](ctp:api:type:Cart) or [Location](ctp:api:type:Location).
   *	Only appears in response to requests for [Get ShippingMethods for a Cart](#get-shippingmethods-for-a-cart) or
   *	[Get ShippingMethods for a Location](#get-shippingmethods-for-a-location).
   *
   *
   */
  readonly isMatching?: boolean
  /**
   *	Price tiers for the ShippingRate.
   *
   */
  readonly tiers: ShippingRatePriceTier[]
}
export interface ShippingRateDraft {
  /**
   *	Money value of the ShippingRate.
   *
   */
  readonly price: Money
  /**
   *	Shipping is free if the sum of the (Custom) Line Item Prices reaches the specified value.
   *
   */
  readonly freeAbove?: Money
  /**
   *	Price tiers for the ShippingRate.
   *
   */
  readonly tiers?: ShippingRatePriceTier[]
}
export type ShippingRatePriceTier = CartClassificationTier | CartScoreTier | CartValueTier
/**
 *	Used when the ShippingRate maps to an abstract Cart categorization expressed by strings (for example, `Light`, `Medium`, or `Heavy`).
 *
 */
export interface CartClassificationTier {
  readonly type: 'CartClassification'
  /**
   *	`key` selected from the `values` of the [CartClassificationType](/projects/project#cartclassificationtype) configured in the Project.
   *
   *
   */
  readonly value: string
  /**
   *	Fixed shipping rate for the selected classification.
   *
   *
   */
  readonly price: Money
  /**
   *	Appears in response to [Get ShippingMethods for a Cart](#get-shippingmethods-for-a-cart) if the shipping rate matches the search query.
   *
   *
   */
  readonly isMatching?: boolean
}
/**
 *	Used when the ShippingRate maps to an abstract Cart categorization expressed by integers (such as shipping scores or weight ranges).
 *	Either `price` or `priceFunction` is required.
 *
 */
export interface CartScoreTier {
  readonly type: 'CartScore'
  /**
   *	Abstract value for categorizing a Cart. The range starts at `0`. The default price covers `0`, tiers start at `1`. See [Using Tiered Shipping Rates](/../tutorials/shipping-rate) for details and examples.
   *
   *
   */
  readonly score: number
  /**
   *	Defines a fixed price for the `score`.
   *
   *
   */
  readonly price?: Money
  /**
   *	Dynamically calculates a Price for a range of scores.
   *
   *
   */
  readonly priceFunction?: PriceFunction
  /**
   *	Appears in response to [Get ShippingMethods for a Cart](#get-shippingmethods-for-a-cart) if the shipping rate matches the search query.
   *
   *
   */
  readonly isMatching?: boolean
}
/**
 *	Used when the ShippingRate maps to the sum of [LineItem](ctp:api:type:LineItem) Prices.
 *	The value of the Cart is used to select a tier.
 *	If chosen, it is not possible to set a value for the `shippingRateInput` on the [Cart](ctp:api:type:Cart).
 *	Tiers contain the `centAmount` (a value of `100` in the currency `USD` corresponds to `$ 1.00`), and start at `1`.'
 *
 */
export interface CartValueTier {
  readonly type: 'CartValue'
  /**
   *	Minimum total price of a Cart for which a shipping rate applies.
   *
   *
   */
  readonly minimumCentAmount: number
  /**
   *	Fixed shipping rate Price for a CartValue.
   *
   *
   */
  readonly price: Money
  /**
   *	Appears in response to [Get ShippingMethods for a Cart](#get-shippingmethods-for-a-cart) if the shipping rate matches the search query.
   *
   *
   */
  readonly isMatching?: boolean
}
export type ShippingRateTierType = 'CartClassification' | 'CartScore' | 'CartValue'
/**
 *	Defines shipping rates in different currencies for a specific [Zone](ctp:api:type:Zone).
 *
 */
export interface ZoneRate {
  /**
   *	[Zone](ctp:api:type:Zone) for which the shipping rates are valid.
   *
   *
   */
  readonly zone: ZoneReference
  /**
   *	Shipping rates defined per currency.
   *
   *
   */
  readonly shippingRates: ShippingRate[]
}
export interface ZoneRateDraft {
  /**
   *	Sets the [Zone](ctp:api:type:Zone) for which the shippng rates are valid.
   *
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *	Shipping rates for the `currencies` configured in the [Project](ctp:api:type:Project). The array must not contain two ShippingRates with the same [CurrencyCode](ctp:api:type:CurrencyCode).
   *
   *
   */
  readonly shippingRates: ShippingRateDraft[]
}
export interface ShippingMethodAddShippingRateAction {
  readonly action: 'addShippingRate'
  /**
   *	[Zone](ctp:api:type:Zone) to which the ShippingRate should be added.
   *
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *	Value to add to `shippingRates`.
   *
   */
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodAddZoneAction {
  readonly action: 'addZone'
  /**
   *	Value to add to `zoneRates`.
   *
   *
   */
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodChangeIsDefaultAction {
  readonly action: 'changeIsDefault'
  /**
   *	Value to set. Only one ShippingMethod can be default in a [Project](ctp:api:type:Project).
   *
   *
   */
  readonly isDefault: boolean
}
export interface ShippingMethodChangeNameAction {
  readonly action: 'changeName'
  /**
   *	Value to set. Must not be empty.
   *
   */
  readonly name: string
}
export interface ShippingMethodChangeTaxCategoryAction {
  readonly action: 'changeTaxCategory'
  /**
   *	Value to set.
   *
   */
  readonly taxCategory: TaxCategoryResourceIdentifier
}
export interface ShippingMethodRemoveShippingRateAction {
  readonly action: 'removeShippingRate'
  /**
   *	[Zone](ctp:api:type:Zone) from which the ShippingRate should be removed.
   *
   *
   */
  readonly zone: ZoneResourceIdentifier
  /**
   *	Value to remove from `shippingRates`.
   *
   */
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodRemoveZoneAction {
  readonly action: 'removeZone'
  /**
   *	Value to remove from `zoneRates`.
   *
   *
   */
  readonly zone: ZoneResourceIdentifier
}
/**
 *	This action sets, overwrites, or removes any existing [Custom Field](/projects/custom-fields) for an existing ShippingMethod.
 *
 */
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
   *	Value to set. If empty, any existing value will be removed.
   *
   */
  readonly description?: string
}
export interface ShippingMethodSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, the existing key, if any, will be removed.
   *
   */
  readonly key?: string
}
export interface ShippingMethodSetLocalizedDescriptionAction {
  readonly action: 'setLocalizedDescription'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   */
  readonly localizedDescription?: LocalizedString
}
export interface ShippingMethodSetLocalizedNameAction {
  readonly action: 'setLocalizedName'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   */
  readonly localizedName?: LocalizedString
}
export interface ShippingMethodSetPredicateAction {
  readonly action: 'setPredicate'
  /**
   *	A valid [Cart predicate](/projects/predicates#cart-predicates). If `predicate` is absent or `null`, it is removed if it exists.
   *
   */
  readonly predicate?: string
}