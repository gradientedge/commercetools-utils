/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import { BusinessUnitKeyReference } from './business-unit.js'
import {
  CustomLineItem,
  DirectDiscount,
  InventoryMode,
  LineItem,
  RoundingMode,
  ShippingInfo,
  ShippingRateInput,
  TaxCalculationMode,
  TaxedPrice,
  TaxMode,
} from './cart.js'
import { Address, BaseResource, CreatedBy, LastModifiedBy, TypedMoney } from './common.js'
import { CustomerReference, CustomerResourceIdentifier } from './customer.js'
import { CustomerGroupReference } from './customer-group.js'
import { PaymentInfo } from './order.js'
import { QuoteRequestReference } from './quote-request.js'
import { StagedQuoteReference, StagedQuoteResourceIdentifier } from './staged-quote.js'
import { StateReference, StateResourceIdentifier } from './state.js'
import { StoreKeyReference } from './store.js'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type.js'

export interface Quote extends BaseResource {
  /**
   *	Unique identifier of the Quote.
   *
   *
   */
  readonly id: string
  /**
   *	Current version of the Quote.
   *
   *
   */
  readonly version: number
  /**
   *	User-defined unique identifier of the Quote.
   *
   *
   */
  readonly key?: string
  /**
   *	Date and time (UTC) the Quote was initially created.
   *
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) the Quote was last updated.
   *
   *
   */
  readonly lastModifiedAt: string
  /**
   *	IDs and references that last modified the Quote.
   *
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	IDs and references that created the Quote.
   *
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	Quote Request related to the Quote.
   *
   *
   */
  readonly quoteRequest: QuoteRequestReference
  /**
   *	Staged Quote related to the Quote.
   *
   *
   */
  readonly stagedQuote: StagedQuoteReference
  /**
   *	The [Buyer](/../api/quotes-overview#buyer) who owns the Quote.
   *
   *
   */
  readonly customer?: CustomerReference
  /**
   *	Set automatically when `customer` is set and the Customer is a member of a Customer Group.
   *	Not updated if Customer is changed after Quote creation.
   *	Used for Product Variant price selection.
   *
   *
   */
  readonly customerGroup?: CustomerGroupReference
  /**
   *	Expiration date for the Quote.
   *
   *
   */
  readonly validTo?: string
  /**
   *	Message from the [Seller](/../api/quotes-overview#seller) included in the offer.
   *
   *
   */
  readonly sellerComment?: string
  /**
   *	Message from the [Buyer](/../api/quotes-overview#buyer) included in the [renegotiation request](ctp:api:type:QuoteRequestQuoteRenegotiationAction).
   *
   *
   */
  readonly buyerComment?: string
  /**
   *	The Store to which the [Buyer](/../api/quotes-overview#buyer) belongs.
   *
   *
   */
  readonly store?: StoreKeyReference
  /**
   *	The Line Items for which the Quote is requested.
   *
   *
   */
  readonly lineItems: LineItem[]
  /**
   *	The Custom Line Items for which the Quote is requested.
   *
   *
   */
  readonly customLineItems: CustomLineItem[]
  /**
   *	Sum of all `totalPrice` fields of the `lineItems` and `customLineItems`, as well as the `price` field of `shippingInfo` (if it exists).
   *	`totalPrice` may or may not include the taxes: it depends on the taxRate.includedInPrice property of each price.
   *
   *
   */
  readonly totalPrice: TypedMoney
  /**
   *	Not set until the shipping address is set.
   *	Will be set automatically in the `Platform` TaxMode.
   *	For the `External` tax mode it will be set  as soon as the external tax rates for all line items, custom line items, and shipping in the cart are set.
   *
   */
  readonly taxedPrice?: TaxedPrice
  /**
   *	Used to determine the eligible [ShippingMethods](ctp:api:type:ShippingMethod)
   *	and rates as well as the tax rate of the Line Items.
   *
   *
   */
  readonly shippingAddress?: Address
  /**
   *	Address used for invoicing.
   *
   *
   */
  readonly billingAddress?: Address
  /**
   *	Inventory mode of the Cart referenced in the [QuoteRequestDraft](ctp:api:type:QuoteRequestDraft).
   *
   *
   */
  readonly inventoryMode?: InventoryMode
  /**
   *	Tax mode of the Cart referenced in the [QuoteRequestDraft](ctp:api:type:QuoteRequestDraft).
   *
   *
   */
  readonly taxMode: TaxMode
  /**
   *	When calculating taxes for `taxedPrice`, the selected mode is used for rounding.
   *
   *
   */
  readonly taxRoundingMode: RoundingMode
  /**
   *	When calculating taxes for `taxedPrice`, the selected mode is used for calculating the price with `LineItemLevel` (horizontally) or `UnitPriceLevel` (vertically) calculation mode.
   *
   */
  readonly taxCalculationMode: TaxCalculationMode
  /**
   *	Used for Product Variant price selection.
   *
   *
   */
  readonly country?: string
  /**
   *	Set automatically once the [ShippingMethod](ctp:api:type:ShippingMethod) is set.
   *
   *
   */
  readonly shippingInfo?: ShippingInfo
  /**
   *	Log of payment transactions related to the Quote.
   *
   *
   */
  readonly paymentInfo?: PaymentInfo
  /**
   *	Used to select a [ShippingRatePriceTier](ctp:api:type:ShippingRatePriceTier).
   *
   *
   */
  readonly shippingRateInput?: ShippingRateInput
  /**
   *	Contains addresses for carts with multiple shipping addresses.
   *	Line items reference these addresses under their `shippingDetails`.
   *	The addresses captured here are not used to determine eligible shipping methods or the applicable tax rate.
   *	Only the cart's `shippingAddress` is used for this.
   *
   *
   */
  readonly itemShippingAddresses?: Address[]
  /**
   *	Discounts that are only valid for the Quote and cannot be associated to any other Cart or Order.
   *
   *
   */
  readonly directDiscounts?: DirectDiscount[]
  /**
   *	Custom Fields on the Quote.
   *
   *
   */
  readonly custom?: CustomFields
  /**
   *	Predefined states tracking the status of the Quote.
   *
   *
   */
  readonly quoteState: QuoteState
  /**
   *	[State](ctp:api:type:State) of the Quote.
   *	This reference can point to a State in a custom workflow.
   *
   *
   */
  readonly state?: StateReference
  /**
   *	The Purchase Order Number is typically set by the [Buyer](/quotes-overview#buyer) on a [QuoteRequest](ctp:api:type:QuoteRequest) to
   *	track the purchase order during the [quote and order flow](/../api/quotes-overview#intended-workflow).
   *
   *
   */
  readonly purchaseOrderNumber?: string
  /**
   *	The [BusinessUnit](ctp:api:type:BusinessUnit) for the Quote.
   *
   *
   */
  readonly businessUnit?: BusinessUnitKeyReference
}
export interface QuoteDraft {
  /**
   *	User-defined unique identifier for the Quote.
   *
   *
   */
  readonly key?: string
  /**
   *	StagedQuote from which the Quote is created.
   *
   */
  readonly stagedQuote: StagedQuoteResourceIdentifier
  /**
   *	Current version of the StagedQuote.
   *
   *
   */
  readonly stagedQuoteVersion: number
  /**
   *	If `true`, the `stagedQuoteState` of the referenced [StagedQuote](/../api/projects/staged-quotes#stagedquote) will be set to `Sent`.
   *
   *
   */
  readonly stagedQuoteStateToSent?: boolean
  /**
   *	[State](ctp:api:type:State) of the Quote.
   *	This reference can point to a State in a custom workflow.
   *
   *
   */
  readonly state?: StateReference
  /**
   *	[Custom Fields](/../api/projects/custom-fields) to be added to the Quote.
   *
   *	- If specified, the Custom Fields are merged with the Custom Fields on the referenced [StagedQuote](/../api/projects/staged-quotes#stagedquote) and added to the Quote.
   *	- If empty, the Custom Fields on the referenced [StagedQuote](/../api/projects/staged-quotes#stagedquote) are added to the Quote automatically.
   *
   *
   */
  readonly custom?: CustomFieldsDraft
}
/**
 *	[PagedQueryResult](/../api/general-concepts#pagedqueryresult) with results containing an array of [Quote](ctp:api:type:Quote).
 *
 */
export interface QuotePagedQueryResponse {
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
   *	Quotes matching the query.
   *
   *
   */
  readonly results: Quote[]
}
/**
 *	[Reference](ctp:api:type:Reference) to a [Quote](ctp:api:type:Quote).
 *
 */
export interface QuoteReference {
  readonly typeId: 'quote'
  /**
   *	Unique ID of the referenced resource.
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded Quote.
   *	Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for Quote.
   *
   *
   */
  readonly obj?: Quote
}
/**
 *	[ResourceIdentifier](ctp:api:type:ResourceIdentifier) to a [Quote](ctp:api:type:Quote).
 *
 */
export interface QuoteResourceIdentifier {
  readonly typeId: 'quote'
  /**
   *	Unique identifier of the referenced resource. Required if `key` is absent.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced resource. Required if `id` is absent.
   *
   *
   */
  readonly key?: string
}
/**
 *	Predefined states tracking the status of the Quote.
 *
 */
export type QuoteState =
  | 'Accepted'
  | 'Declined'
  | 'DeclinedForRenegotiation'
  | 'Pending'
  | 'RenegotiationAddressed'
  | 'Withdrawn'
  | string
export interface QuoteUpdate {
  /**
   *	Expected version of the [Quote](ctp:api:type:Quote) to which the changes should be applied.
   *	If the expected version does not match the actual version, a [ConcurrentModification](ctp:api:type:ConcurrentModificationError) error will be returned.
   *
   *
   */
  readonly version: number
  /**
   *	Update actions to be performed on the [Quote](ctp:api:type:Quote).
   *
   *
   */
  readonly actions: QuoteUpdateAction[]
}
export type QuoteUpdateAction =
  | QuoteChangeCustomerAction
  | QuoteChangeQuoteStateAction
  | QuoteRequestQuoteRenegotiationAction
  | QuoteSetCustomFieldAction
  | QuoteSetCustomTypeAction
  | QuoteTransitionStateAction
/**
 *	Changes the owner of a Quote to a different Customer.
 *	Customer Group is not updated.
 *	This update action produces the [Quote Customer Changed](ctp:api:type:QuoteCustomerChangedMessage) Message.
 *
 */
export interface QuoteChangeCustomerAction {
  readonly action: 'changeCustomer'
  /**
   *	New Customer to own the Quote.
   *
   */
  readonly customer: CustomerResourceIdentifier
}
export interface QuoteChangeQuoteStateAction {
  readonly action: 'changeQuoteState'
  /**
   *	New state to be set for the Quote.
   *
   */
  readonly quoteState: QuoteState
}
/**
 *	Represents the Buyer requesting renegotiation for a Quote. Valid for Quotes in a `Pending` [state](ctp:api:type:QuoteState).
 *
 */
export interface QuoteRequestQuoteRenegotiationAction {
  readonly action: 'requestQuoteRenegotiation'
  /**
   *	Message from the [Buyer](/api/quotes-overview#buyer) regarding the Quote renegotiation request.
   *
   *
   */
  readonly buyerComment?: string
}
export interface QuoteSetCustomFieldAction {
  readonly action: 'setCustomField'
  /**
   *	Name of the [Custom Field](/../api/projects/custom-fields).
   *
   *
   */
  readonly name: string
  /**
   *	If `value` is absent or `null`, this field will be removed if it exists.
   *	Removing a field that does not exist returns an [InvalidOperation](ctp:api:type:InvalidOperationError) error.
   *	If `value` is provided, it is set for the field defined by `name`.
   *
   *
   */
  readonly value?: any
}
export interface QuoteSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the Quote with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the Quote.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the Quote.
   *
   *
   */
  readonly fields?: FieldContainer
}
/**
 *	If the existing [State](ctp:api:type:State) has set `transitions`, there must be a direct transition to the new State. If `transitions` is not set, no validation is performed. This update action produces the [Quote State Transition](ctp:api:type:QuoteStateTransitionMessage) Message.
 *
 */
export interface QuoteTransitionStateAction {
  readonly action: 'transitionState'
  /**
   *	Value to set.
   *	If there is no State yet, this must be an initial State.
   *
   *
   */
  readonly state: StateResourceIdentifier
  /**
   *	Switch validations on or off.
   *
   *
   */
  readonly force?: boolean
}