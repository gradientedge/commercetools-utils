/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  BaseResource,
  CentPrecisionMoney,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  Money,
  Reference,
} from './common'
import { ProductReference, ProductResourceIdentifier } from './product'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'

export interface CartDiscount extends BaseResource {
  /**
   *	Unique identifier of the CartDiscount.
   *
   */
  readonly id: string
  /**
   *	Current version of the CartDiscount.
   *
   *
   */
  readonly version: number
  /**
   *	Date and time (UTC) for the CartDiscount was initially created.
   *
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) for the CartDiscount was last updated.
   *
   *
   */
  readonly lastModifiedAt: string
  /**
   *	Present on resources updated after 1 February 2019 except for [events not tracked](/../api/client-logging#events-tracked).
   *
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1 February 2019 except for [events not tracked](/../api/client-logging#events-tracked).
   *
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	Name of the CartDiscount.
   *
   *
   */
  readonly name: LocalizedString
  /**
   *	User-defined unique identifier of the CartDiscount.
   *
   *
   */
  readonly key?: string
  /**
   *	Description of the CartDiscount.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Effect of the CartDiscount.
   *
   *
   */
  readonly value: CartDiscountValue
  /**
   *	Valid [Cart Predicate](/../api/projects/predicates#cart-predicates).
   *
   *
   */
  readonly cartPredicate: string
  /**
   *	Sets a [CartDiscountTarget](ctp:api:type:CartDiscountTarget). Empty if `value` has type `giftLineItem`.
   *
   *
   */
  readonly target?: CartDiscountTarget
  /**
   *	Value between `0` and `1`.
   *	All matching CartDiscounts are applied to a Cart in the order defined by this field.
   *	A Discount with a higher sortOrder is prioritized.
   *	The sort order is unambiguous among all CartDiscounts.
   *
   *
   */
  readonly sortOrder: string
  /**
   *	Indicates if the CartDiscount is active and can be applied to the Cart.
   *
   *
   */
  readonly isActive: boolean
  /**
   *	Date and time (UTC) from which the Discount is effective.
   *
   *
   */
  readonly validFrom?: string
  /**
   *	Date and time (UTC) until which the Discount is effective.
   *
   *
   */
  readonly validUntil?: string
  /**
   *	Indicates if the Discount can be used in connection with a [DiscountCode](ctp:api:type:DiscountCode).
   *
   *
   */
  readonly requiresDiscountCode: boolean
  /**
   *	References of all resources that are addressed in the predicate.
   *	The API generates this array from the predicate.
   *
   *
   */
  readonly references: Reference[]
  /**
   *	Indicates whether the application of the CartDiscount causes other discounts to be ignored.
   *
   *
   */
  readonly stackingMode: StackingMode
  /**
   *	Custom Fields of the CartDiscount.
   *
   *
   */
  readonly custom?: CustomFields
}
export interface CartDiscountDraft {
  /**
   *	Name of the CartDiscount.
   *
   *
   */
  readonly name: LocalizedString
  /**
   *	User-defined unique identifier for the CartDiscount.
   *
   *
   */
  readonly key?: string
  /**
   *	Description of the CartDiscount.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Effect of the CartDiscount.
   *	For a target, relative or absolute discount values, or a fixed item price value can be specified. If no target is specified, a gift line item can be added to the cart.
   *
   *
   */
  readonly value: CartDiscountValueDraft
  /**
   *	Valid [Cart Predicate](/../api/projects/predicates#cart-predicates).
   *
   *
   */
  readonly cartPredicate: string
  /**
   *	Must not be set when the `value` has type `giftLineItem`, otherwise a [CartDiscountTarget](ctp:api:type:CartDiscountTarget) must be set.
   *
   *
   */
  readonly target?: CartDiscountTarget
  /**
   *	Value between `0` and `1`.
   *	A Discount with a higher sortOrder is prioritized.
   *	The sort order must be unambiguous among all CartDiscounts.
   *
   *
   */
  readonly sortOrder: string
  /**
   *	Only active Discounts can be applied to the Cart.
   *
   *
   */
  readonly isActive?: boolean
  /**
   *	Date and time (UTC) from which the Discount is effective.
   *
   *
   */
  readonly validFrom?: string
  /**
   *	Date and time (UTC) until which the Discount is effective.
   *
   *
   */
  readonly validUntil?: string
  /**
   *	States whether the Discount can only be used in a connection with a [DiscountCode](ctp:api:type:DiscountCode).
   *
   *
   */
  readonly requiresDiscountCode?: boolean
  /**
   *	Specifies whether the application of this discount causes the following discounts to be ignored.
   *
   *
   */
  readonly stackingMode?: StackingMode
  /**
   *	Custom Fields of the CartDiscount.
   *
   *
   */
  readonly custom?: CustomFieldsDraft
}
/**
 *	[PagedQueryResult](/../api/general-concepts#pagedqueryresult) with `results` containing an array of [CartDiscount](ctp:api:type:CartDiscount).
 *
 */
export interface CartDiscountPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Number of [elements skipped](/../api/general-concepts#offset).
   *
   *
   */
  readonly offset: number
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
   *	[CartDiscounts](ctp:api:type:CartDiscount) matching the query.
   *
   *
   */
  readonly results: CartDiscount[]
}
/**
 *	[Reference](ctp:api:type:Reference) to a [CartDiscount](ctp:api:type:CartDiscount).
 *
 */
export interface CartDiscountReference {
  readonly typeId: 'cart-discount'
  /**
   *	Unique identifier of the referenced [CartDiscount](ctp:api:type:CartDiscount).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded CartDiscount. Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for CartDiscounts.
   *
   *
   */
  readonly obj?: CartDiscount
}
/**
 *	[ResourceIdentifier](ctp:api:type:ResourceIdentifier) to a [CartDiscount](ctp:api:type:CartDiscount).
 *
 */
export interface CartDiscountResourceIdentifier {
  readonly typeId: 'cart-discount'
  /**
   *	Unique identifier of the referenced [CartDiscount](ctp:api:type:CartDiscount). Either `id` or `key` is required.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced [CartDiscount](ctp:api:type:CartDiscount). Either `id` or `key` is required.
   *
   *
   */
  readonly key?: string
}
export type CartDiscountTarget =
  | CartDiscountCustomLineItemsTarget
  | CartDiscountLineItemsTarget
  | CartDiscountShippingCostTarget
  | MultiBuyCustomLineItemsTarget
  | MultiBuyLineItemsTarget
/**
 *	Discount is applied to [CustomLineItems](ctp:api:type:CustomLineItem) matching the `predicate`.
 *
 */
export interface CartDiscountCustomLineItemsTarget {
  readonly type: 'customLineItems'
  /**
   *	Valid [CustomLineItem target predicate](/../api/projects/predicates#customlineitem-field-identifiers).
   *
   *
   */
  readonly predicate: string
}
/**
 *	Discount is applied to [LineItems](ctp:api:type:LineItem) matching the `predicate`.
 *
 */
export interface CartDiscountLineItemsTarget {
  readonly type: 'lineItems'
  /**
   *	Valid [LineItem target predicate](/../api/projects/predicates#lineitem-field-identifiers).
   *
   *
   */
  readonly predicate: string
}
/**
 *	Discount is applied to the shipping costs of the [Cart](ctp:api:type:Cart).
 *
 */
export interface CartDiscountShippingCostTarget {
  readonly type: 'shipping'
}
export interface CartDiscountUpdate {
  /**
   *	Expected version of the CartDiscount on which the changes should be applied. If the expected version does not match the actual version, a [409 Conflict](/../api/errors#409-conflict) will be returned.
   *
   *
   */
  readonly version: number
  /**
   *	Update actions to be performed on the CartDiscount.
   *
   *
   */
  readonly actions: CartDiscountUpdateAction[]
}
export type CartDiscountUpdateAction =
  | CartDiscountChangeCartPredicateAction
  | CartDiscountChangeIsActiveAction
  | CartDiscountChangeNameAction
  | CartDiscountChangeRequiresDiscountCodeAction
  | CartDiscountChangeSortOrderAction
  | CartDiscountChangeStackingModeAction
  | CartDiscountChangeTargetAction
  | CartDiscountChangeValueAction
  | CartDiscountSetCustomFieldAction
  | CartDiscountSetCustomTypeAction
  | CartDiscountSetDescriptionAction
  | CartDiscountSetKeyAction
  | CartDiscountSetValidFromAction
  | CartDiscountSetValidFromAndUntilAction
  | CartDiscountSetValidUntilAction
export type CartDiscountValue =
  | CartDiscountValueAbsolute
  | CartDiscountValueFixed
  | CartDiscountValueGiftLineItem
  | CartDiscountValueRelative
/**
 *	Discounts the [CartDiscountTarget](ctp:api:type:CartDiscountTarget) by an absolute amount (not allowed for [MultiBuyLineItemsTarget](ctp:api:type:MultiBuyLineItemsTarget) and [MultiBuyCustomLineItemsTarget](ctp:api:type:MultiBuyCustomLineItemsTarget)).
 *
 */
export interface CartDiscountValueAbsolute {
  readonly type: 'absolute'
  /**
   *	Cent precision money values in different currencies.
   *
   *
   */
  readonly money: CentPrecisionMoney[]
}
export type CartDiscountValueDraft =
  | CartDiscountValueAbsoluteDraft
  | CartDiscountValueFixedDraft
  | CartDiscountValueGiftLineItemDraft
  | CartDiscountValueRelativeDraft
export interface CartDiscountValueAbsoluteDraft {
  readonly type: 'absolute'
  /**
   *	Money values in different currencies.
   *	An absolute Cart Discount will only match a price if this array contains a value with the same currency. If it contains 10€ and 15$, the matching € price will be decreased by 10€ and the matching $ price will be decreased by 15$.
   *
   *
   */
  readonly money: Money[]
}
/**
 *	Sets the [DiscountedLineItemPrice](ctp:api:type:DiscountedLineItemPrice) of the [CartDiscountLineItemsTarget](ctp:api:type:CartDiscountLineItemsTarget) or [CartDiscountCustomLineItemsTarget](ctp:api:type:CartDiscountCustomLineItemsTarget) to the value specified in the `money` field, if it is lower than the current Line Item price for the same currency. If the Line Item price is already discounted to a price equal to or lower than the respective price in the `money` field, this Discount is not applied.
 *
 */
export interface CartDiscountValueFixed {
  readonly type: 'fixed'
  /**
   *	Cent precision money values in different currencies.
   *
   *
   */
  readonly money: CentPrecisionMoney[]
}
/**
 *	Sets the [DiscountedLineItemPrice](ctp:api:type:DiscountedLineItemPrice) of the [CartDiscountLineItemsTarget](ctp:api:type:CartDiscountLineItemsTarget) or [CartDiscountCustomLineItemsTarget](ctp:api:type:CartDiscountCustomLineItemsTarget) to the value specified in the `money` field, if it is lower than the current Line Item price for the same currency. If the Line Item price is already discounted to a price equal to or lower than the respective price in the `money` field, this Discount is not applied.
 *
 */
export interface CartDiscountValueFixedDraft {
  readonly type: 'fixed'
  /**
   *	Money values in different currencies.
   *	A fixed Cart Discount will only match a price if this array contains a value with the same currency. If it contains 10€ and 15$, the matching € price will be discounted by 10€ and the matching $ price will be discounted to 15$.
   *
   *
   */
  readonly money: Money[]
}
export interface CartDiscountValueGiftLineItem {
  readonly type: 'giftLineItem'
  /**
   *	Reference to a Product.
   *
   *
   */
  readonly product: ProductReference
  /**
   *	[ProductVariant](ctp:api:type:ProductVariant) of the Product.
   *
   *
   */
  readonly variantId: number
  /**
   *	Channel must have the [ChannelRoleEnum](ctp:api:type:ChannelRoleEnum) `InventorySupply`.
   *
   *
   */
  readonly supplyChannel?: ChannelReference
  /**
   *	Channel must have the [ChannelRoleEnum](ctp:api:type:ChannelRoleEnum) `ProductDistribution`.
   *
   *
   */
  readonly distributionChannel?: ChannelReference
}
export interface CartDiscountValueGiftLineItemDraft {
  readonly type: 'giftLineItem'
  /**
   *	ResourceIdentifier of a Product.
   *
   *
   */
  readonly product: ProductResourceIdentifier
  /**
   *	[ProductVariant](ctp:api:type:ProductVariant) of the Product.
   *
   *
   */
  readonly variantId: number
  /**
   *	Channel must have the role `InventorySupply`.
   *
   *
   */
  readonly supplyChannel?: ChannelResourceIdentifier
  /**
   *	Channel must have the role `ProductDistribution`.
   *
   *
   */
  readonly distributionChannel?: ChannelResourceIdentifier
}
/**
 *	Discounts the [CartDiscountTarget](ctp:api:type:CartDiscountTarget) relative to its price.
 *
 */
export interface CartDiscountValueRelative {
  readonly type: 'relative'
  /**
   *	Fraction (per ten thousand) the price is reduced by. For example, `1000` will result in a 10% price reduction.
   *
   *
   */
  readonly permyriad: number
}
export interface CartDiscountValueRelativeDraft {
  readonly type: 'relative'
  /**
   *	Fraction (per ten thousand) the price is reduced by. For example, `1000` will result in a 10% price reduction.
   *
   *
   */
  readonly permyriad: number
}
/**
 *	This Discount target is similar to `MultiBuyLineItems`, but is applied on Custom Line Items instead of Line Items.
 *
 */
export interface MultiBuyCustomLineItemsTarget {
  readonly type: 'multiBuyCustomLineItems'
  /**
   *	Valid [CustomLineItems target predicate](/../api/projects/predicates#customlineitem-field-identifiers). The Discount will be applied to Custom Line Items that are matched by the predicate.
   *
   *
   */
  readonly predicate: string
  /**
   *	Number of Custom Line Items to be present in order to trigger an application of this Discount.
   *
   *
   */
  readonly triggerQuantity: number
  /**
   *	Number of Custom Line Items that are discounted per application of this Discount.
   *
   *
   */
  readonly discountedQuantity: number
  /**
   *	Maximum number of times this Discount can be applied.
   *
   *
   */
  readonly maxOccurrence?: number
  /**
   *	Discounts particular Line Items only according to the SelectionMode.
   *
   *
   */
  readonly selectionMode: SelectionMode
}
export interface MultiBuyLineItemsTarget {
  readonly type: 'multiBuyLineItems'
  /**
   *	Valid [LineItem target predicate](/../api/projects/predicates#lineitem-field-identifiers). The Discount will be applied to Line Items that are matched by the predicate.
   *
   *
   */
  readonly predicate: string
  /**
   *	Number of Line Items to be present in order to trigger an application of this Discount.
   *
   *
   */
  readonly triggerQuantity: number
  /**
   *	Number of Line Items that are discounted per application of this Discount.
   *
   *
   */
  readonly discountedQuantity: number
  /**
   *	Maximum number of times this Discount can be applied.
   *
   *
   */
  readonly maxOccurrence?: number
  /**
   *	Discounts particular Line Items only according to the SelectionMode.
   *
   *
   */
  readonly selectionMode: SelectionMode
}
/**
 *	Defines which matching items are to be discounted.
 *
 */
export type SelectionMode = 'Cheapest' | 'MostExpensive'
/**
 *	Describes how the Cart Discount interacts with other Discounts.
 *
 */
export type StackingMode = 'Stacking' | 'StopAfterThisDiscount'
export interface CartDiscountChangeCartPredicateAction {
  readonly action: 'changeCartPredicate'
  /**
   *	New value to set.
   *
   *
   */
  readonly cartPredicate: string
}
export interface CartDiscountChangeIsActiveAction {
  readonly action: 'changeIsActive'
  /**
   *	New value to set.
   *	If set to `true`, the Discount will be applied to the Cart.
   *
   *
   */
  readonly isActive: boolean
}
export interface CartDiscountChangeNameAction {
  readonly action: 'changeName'
  /**
   *	New value to set.
   *
   *
   */
  readonly name: LocalizedString
}
export interface CartDiscountChangeRequiresDiscountCodeAction {
  readonly action: 'changeRequiresDiscountCode'
  /**
   *	New value to set.
   *	If set to `true`, the Discount can only be used in connection with a [DiscountCode](ctp:api:type:DiscountCode).
   *
   *
   */
  readonly requiresDiscountCode: boolean
}
export interface CartDiscountChangeSortOrderAction {
  readonly action: 'changeSortOrder'
  /**
   *	New value to set (between `0` and `1`).
   *	A Discount with a higher sortOrder is prioritized.
   *
   *
   */
  readonly sortOrder: string
}
export interface CartDiscountChangeStackingModeAction {
  readonly action: 'changeStackingMode'
  /**
   *	New value to set.
   *
   *
   */
  readonly stackingMode: StackingMode
}
export interface CartDiscountChangeTargetAction {
  readonly action: 'changeTarget'
  /**
   *	New value to set.
   *
   *
   */
  readonly target: CartDiscountTarget
}
export interface CartDiscountChangeValueAction {
  readonly action: 'changeValue'
  /**
   *	New value to set.
   *
   *
   */
  readonly value: CartDiscountValueDraft
}
export interface CartDiscountSetCustomFieldAction {
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
export interface CartDiscountSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the CartDiscount with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the CartDiscount.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the CartDiscount.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface CartDiscountSetDescriptionAction {
  readonly action: 'setDescription'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly description?: LocalizedString
}
export interface CartDiscountSetKeyAction {
  readonly action: 'setKey'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly key?: string
}
export interface CartDiscountSetValidFromAction {
  readonly action: 'setValidFrom'
  /**
   *	Value to set.
   *	If empty, any existing value will be removed.
   *
   *
   */
  readonly validFrom?: string
}
export interface CartDiscountSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  /**
   *	Value to set.
   *	If empty, any existing value will be removed.
   *
   *
   */
  readonly validFrom?: string
  /**
   *	Value to set.
   *	If empty, any existing value will be removed.
   *
   *
   */
  readonly validUntil?: string
}
export interface CartDiscountSetValidUntilAction {
  readonly action: 'setValidUntil'
  /**
   *	Value to set.
   *	If empty, any existing value will be removed.
   *
   *
   */
  readonly validUntil?: string
}