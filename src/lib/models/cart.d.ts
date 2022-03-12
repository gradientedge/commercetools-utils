import { CartDiscountReference } from './cart-discount'
import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  Address,
  BaseAddress,
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  Money,
  Price,
  TypedMoney,
} from './common'
import { CustomerGroupReference, CustomerGroupResourceIdentifier } from './customer-group'
import { DiscountCodeReference } from './discount-code'
import { Delivery, ItemState, OrderReference, PaymentInfo } from './order'
import { PaymentResourceIdentifier } from './payment'
import { ProductVariant } from './product'
import { ProductTypeReference } from './product-type'
import {
  ShippingMethodReference,
  ShippingMethodResourceIdentifier,
  ShippingRate,
  ShippingRateDraft,
} from './shipping-method'
import { ShoppingListResourceIdentifier } from './shopping-list'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import { SubRate, TaxCategoryReference, TaxCategoryResourceIdentifier, TaxRate } from './tax-category'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface Cart extends BaseResource {
  readonly id: string
  readonly key?: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly customerId?: string
  readonly customerEmail?: string
  readonly anonymousId?: string
  readonly store?: StoreKeyReference
  readonly lineItems: LineItem[]
  readonly customLineItems: CustomLineItem[]
  readonly totalPrice: TypedMoney
  readonly taxedPrice?: TaxedPrice
  readonly cartState: CartState
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly inventoryMode?: InventoryMode
  readonly taxMode: TaxMode
  readonly taxRoundingMode: RoundingMode
  readonly taxCalculationMode: TaxCalculationMode
  readonly customerGroup?: CustomerGroupReference
  readonly country?: string
  readonly shippingInfo?: ShippingInfo
  readonly discountCodes?: DiscountCodeInfo[]
  readonly custom?: CustomFields
  readonly paymentInfo?: PaymentInfo
  readonly locale?: string
  readonly deleteDaysAfterLastModification?: number
  readonly refusedGifts: CartDiscountReference[]
  readonly origin: CartOrigin
  readonly shippingRateInput?: ShippingRateInput
  readonly itemShippingAddresses?: Address[]
  readonly totalLineItemQuantity?: number
}
export interface CartDraft {
  readonly currency: string
  readonly key?: string
  readonly customerId?: string
  readonly customerEmail?: string
  readonly customerGroup?: CustomerGroupResourceIdentifier
  readonly anonymousId?: string
  readonly store?: StoreResourceIdentifier
  readonly country?: string
  readonly inventoryMode?: InventoryMode
  readonly taxMode?: TaxMode
  readonly taxRoundingMode?: RoundingMode
  readonly taxCalculationMode?: TaxCalculationMode
  readonly lineItems?: LineItemDraft[]
  readonly customLineItems?: CustomLineItemDraft[]
  readonly shippingAddress?: BaseAddress
  readonly billingAddress?: BaseAddress
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  readonly externalTaxRateForShippingMethod?: ExternalTaxRateDraft
  readonly custom?: CustomFieldsDraft
  readonly locale?: string
  readonly deleteDaysAfterLastModification?: number
  readonly origin?: CartOrigin
  readonly shippingRateInput?: ShippingRateInputDraft
  readonly itemShippingAddresses?: BaseAddress[]
  readonly discountCodes?: string[]
}
export declare type CartOrigin = 'Customer' | 'Merchant'
export interface CartPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Cart[]
}
export interface CartReference {
  readonly typeId: 'cart'
  readonly id: string
  readonly obj?: Cart
}
export interface CartResourceIdentifier {
  readonly typeId: 'cart'
  readonly id?: string
  readonly key?: string
}
export declare type CartState = 'Active' | 'Merged' | 'Ordered'
export interface CartUpdate {
  readonly version: number
  readonly actions: CartUpdateAction[]
}
export declare type CartUpdateAction =
  | CartAddCustomLineItemAction
  | CartAddDiscountCodeAction
  | CartAddItemShippingAddressAction
  | CartAddLineItemAction
  | CartAddPaymentAction
  | CartAddShoppingListAction
  | CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction
  | CartApplyDeltaToLineItemShippingDetailsTargetsAction
  | CartChangeCustomLineItemMoneyAction
  | CartChangeCustomLineItemQuantityAction
  | CartChangeLineItemQuantityAction
  | CartChangeTaxCalculationModeAction
  | CartChangeTaxModeAction
  | CartChangeTaxRoundingModeAction
  | CartRecalculateAction
  | CartRemoveCustomLineItemAction
  | CartRemoveDiscountCodeAction
  | CartRemoveItemShippingAddressAction
  | CartRemoveLineItemAction
  | CartRemovePaymentAction
  | CartSetAnonymousIdAction
  | CartSetBillingAddressAction
  | CartSetBillingAddressCustomFieldAction
  | CartSetBillingAddressCustomTypeAction
  | CartSetCartTotalTaxAction
  | CartSetCountryAction
  | CartSetCustomFieldAction
  | CartSetCustomLineItemCustomFieldAction
  | CartSetCustomLineItemCustomTypeAction
  | CartSetCustomLineItemShippingDetailsAction
  | CartSetCustomLineItemTaxAmountAction
  | CartSetCustomLineItemTaxRateAction
  | CartSetCustomShippingMethodAction
  | CartSetCustomTypeAction
  | CartSetCustomerEmailAction
  | CartSetCustomerGroupAction
  | CartSetCustomerIdAction
  | CartSetDeleteDaysAfterLastModificationAction
  | CartSetDeliveryAddressCustomFieldAction
  | CartSetDeliveryAddressCustomTypeAction
  | CartSetItemShippingAddressCustomFieldAction
  | CartSetItemShippingAddressCustomTypeAction
  | CartSetKeyAction
  | CartSetLineItemCustomFieldAction
  | CartSetLineItemCustomTypeAction
  | CartSetLineItemDistributionChannelAction
  | CartSetLineItemPriceAction
  | CartSetLineItemShippingDetailsAction
  | CartSetLineItemSupplyChannelAction
  | CartSetLineItemTaxAmountAction
  | CartSetLineItemTaxRateAction
  | CartSetLineItemTotalPriceAction
  | CartSetLocaleAction
  | CartSetShippingAddressAction
  | CartSetShippingAddressCustomFieldAction
  | CartSetShippingAddressCustomTypeAction
  | CartSetShippingMethodAction
  | CartSetShippingMethodTaxAmountAction
  | CartSetShippingMethodTaxRateAction
  | CartSetShippingRateInputAction
  | CartUpdateItemShippingAddressAction
export interface CustomLineItem {
  readonly id: string
  readonly name: LocalizedString
  readonly money: TypedMoney
  readonly taxedPrice?: TaxedItemPrice
  readonly totalPrice: TypedMoney
  readonly slug: string
  readonly quantity: number
  readonly state: ItemState[]
  readonly taxCategory?: TaxCategoryReference
  readonly taxRate?: TaxRate
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly custom?: CustomFields
  readonly shippingDetails?: ItemShippingDetails
}
export interface CustomLineItemDraft {
  readonly name: LocalizedString
  readonly quantity: number
  readonly money: Money
  readonly slug: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly custom?: CustomFieldsDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface DiscountCodeInfo {
  readonly discountCode: DiscountCodeReference
  readonly state: DiscountCodeState
}
export declare type DiscountCodeState =
  | 'ApplicationStoppedByPreviousDiscount'
  | 'DoesNotMatchCart'
  | 'MatchesCart'
  | 'MaxApplicationReached'
  | 'NotActive'
  | 'NotValid'
export interface DiscountedLineItemPortion {
  readonly discount: CartDiscountReference
  readonly discountedAmount: TypedMoney
}
export interface DiscountedLineItemPrice {
  readonly value: TypedMoney
  readonly includedDiscounts: DiscountedLineItemPortion[]
}
export interface DiscountedLineItemPriceForQuantity {
  readonly quantity: number
  readonly discountedPrice: DiscountedLineItemPrice
}
export interface ExternalLineItemTotalPrice {
  readonly price: Money
  readonly totalPrice: Money
}
export interface ExternalTaxAmountDraft {
  readonly totalGross: Money
  readonly taxRate: ExternalTaxRateDraft
}
export interface ExternalTaxRateDraft {
  readonly name: string
  readonly amount?: number
  readonly country: string
  readonly state?: string
  readonly subRates?: SubRate[]
  readonly includedInPrice?: boolean
}
export declare type InventoryMode = 'None' | 'ReserveOnOrder' | 'TrackOnly'
export interface ItemShippingDetails {
  readonly targets: ItemShippingTarget[]
  readonly valid: boolean
}
export interface ItemShippingDetailsDraft {
  readonly targets: ItemShippingTarget[]
}
export interface ItemShippingTarget {
  readonly addressKey: string
  readonly quantity: number
}
export interface LineItem {
  readonly id: string
  readonly productId: string
  readonly productKey?: string
  readonly name: LocalizedString
  readonly productSlug?: LocalizedString
  readonly productType: ProductTypeReference
  readonly variant: ProductVariant
  readonly price: Price
  readonly taxedPrice?: TaxedItemPrice
  readonly totalPrice: TypedMoney
  readonly quantity: number
  readonly addedAt?: string
  readonly state: ItemState[]
  readonly taxRate?: TaxRate
  readonly supplyChannel?: ChannelReference
  readonly distributionChannel?: ChannelReference
  readonly discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[]
  readonly priceMode: LineItemPriceMode
  readonly lineItemMode: LineItemMode
  readonly custom?: CustomFields
  readonly shippingDetails?: ItemShippingDetails
  readonly lastModifiedAt?: string
}
export interface LineItemDraft {
  readonly productId?: string
  readonly variantId?: number
  readonly sku?: string
  readonly quantity?: number
  readonly addedAt?: string
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly custom?: CustomFieldsDraft
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export declare type LineItemMode = 'GiftLineItem' | 'Standard'
export declare type LineItemPriceMode = 'ExternalPrice' | 'ExternalTotal' | 'Platform'
export interface ReplicaCartDraft {
  readonly reference: CartReference | OrderReference
  readonly key?: string
}
export declare type RoundingMode = 'HalfDown' | 'HalfEven' | 'HalfUp'
export interface ShippingInfo {
  readonly shippingMethodName: string
  readonly price: TypedMoney
  readonly shippingRate: ShippingRate
  readonly taxedPrice?: TaxedItemPrice
  readonly taxRate?: TaxRate
  readonly taxCategory?: TaxCategoryReference
  readonly shippingMethod?: ShippingMethodReference
  readonly deliveries?: Delivery[]
  readonly discountedPrice?: DiscountedLineItemPrice
  readonly shippingMethodState: ShippingMethodState
}
export declare type ShippingMethodState = 'DoesNotMatchCart' | 'MatchesCart'
export declare type ShippingRateInput = ClassificationShippingRateInput | ScoreShippingRateInput
export interface ClassificationShippingRateInput {
  readonly type: 'Classification'
  readonly key: string
  readonly label: LocalizedString
}
export interface ScoreShippingRateInput {
  readonly type: 'Score'
  readonly score: number
}
export declare type ShippingRateInputDraft = ClassificationShippingRateInputDraft | ScoreShippingRateInputDraft
export interface ClassificationShippingRateInputDraft {
  readonly type: 'Classification'
  readonly key: string
}
export interface ScoreShippingRateInputDraft {
  readonly type: 'Score'
  readonly score: number
}
export declare type TaxCalculationMode = 'LineItemLevel' | 'UnitPriceLevel'
export declare type TaxMode = 'Disabled' | 'External' | 'ExternalAmount' | 'Platform'
export interface TaxPortion {
  readonly name?: string
  readonly rate: number
  readonly amount: TypedMoney
}
export interface TaxPortionDraft {
  readonly name?: string
  readonly rate: number
  readonly amount: Money
}
export interface TaxedItemPrice {
  readonly totalNet: TypedMoney
  readonly totalGross: TypedMoney
}
export interface TaxedPrice {
  readonly totalNet: TypedMoney
  readonly totalGross: TypedMoney
  readonly taxPortions: TaxPortion[]
}
export interface TaxedPriceDraft {
  readonly totalNet: Money
  readonly totalGross: Money
  readonly taxPortions: TaxPortionDraft[]
}
export interface CartAddCustomLineItemAction {
  readonly action: 'addCustomLineItem'
  readonly money: Money
  readonly name: LocalizedString
  readonly quantity: number
  readonly slug: string
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly custom?: CustomFieldsDraft
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartAddDiscountCodeAction {
  readonly action: 'addDiscountCode'
  readonly code: string
}
export interface CartAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: BaseAddress
}
export interface CartAddLineItemAction {
  readonly action: 'addLineItem'
  readonly custom?: CustomFieldsDraft
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
  readonly productId?: string
  readonly variantId?: number
  readonly sku?: string
  readonly quantity?: number
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface CartAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface CartAddShoppingListAction {
  readonly action: 'addShoppingList'
  readonly shoppingList: ShoppingListResourceIdentifier
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface CartApplyDeltaToCustomLineItemShippingDetailsTargetsAction {
  readonly action: 'applyDeltaToCustomLineItemShippingDetailsTargets'
  readonly customLineItemId: string
  readonly targetsDelta: ItemShippingTarget[]
}
export interface CartApplyDeltaToLineItemShippingDetailsTargetsAction {
  readonly action: 'applyDeltaToLineItemShippingDetailsTargets'
  readonly lineItemId: string
  readonly targetsDelta: ItemShippingTarget[]
}
export interface CartChangeCustomLineItemMoneyAction {
  readonly action: 'changeCustomLineItemMoney'
  readonly customLineItemId: string
  readonly money: Money
}
export interface CartChangeCustomLineItemQuantityAction {
  readonly action: 'changeCustomLineItemQuantity'
  readonly customLineItemId: string
  readonly quantity: number
}
export interface CartChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly lineItemId: string
  readonly quantity: number
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
}
export interface CartChangeTaxCalculationModeAction {
  readonly action: 'changeTaxCalculationMode'
  readonly taxCalculationMode: TaxCalculationMode
}
export interface CartChangeTaxModeAction {
  readonly action: 'changeTaxMode'
  readonly taxMode: TaxMode
}
export interface CartChangeTaxRoundingModeAction {
  readonly action: 'changeTaxRoundingMode'
  readonly taxRoundingMode: RoundingMode
}
export interface CartRecalculateAction {
  readonly action: 'recalculate'
  readonly updateProductData?: boolean
}
export interface CartRemoveCustomLineItemAction {
  readonly action: 'removeCustomLineItem'
  readonly customLineItemId: string
}
export interface CartRemoveDiscountCodeAction {
  readonly action: 'removeDiscountCode'
  readonly discountCode: DiscountCodeReference
}
export interface CartRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'
  readonly addressKey: string
}
export interface CartRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft
}
export interface CartRemovePaymentAction {
  readonly action: 'removePayment'
  readonly payment: PaymentResourceIdentifier
}
export interface CartSetAnonymousIdAction {
  readonly action: 'setAnonymousId'
  readonly anonymousId?: string
}
export interface CartSetBillingAddressAction {
  readonly action: 'setBillingAddress'
  readonly address?: BaseAddress
}
export interface CartSetBillingAddressCustomFieldAction {
  readonly action: 'setBillingAddressCustomField'
  readonly name: string
  readonly value?: any
}
export interface CartSetBillingAddressCustomTypeAction {
  readonly action: 'setBillingAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetCartTotalTaxAction {
  readonly action: 'setCartTotalTax'
  readonly externalTotalGross: Money
  readonly externalTaxPortions?: TaxPortionDraft[]
}
export interface CartSetCountryAction {
  readonly action: 'setCountry'
  readonly country?: string
}
export interface CartSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CartSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'
  readonly customLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface CartSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'
  readonly customLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'
  readonly customLineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface CartSetCustomLineItemTaxAmountAction {
  readonly action: 'setCustomLineItemTaxAmount'
  readonly customLineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetCustomLineItemTaxRateAction {
  readonly action: 'setCustomLineItemTaxRate'
  readonly customLineItemId: string
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetCustomShippingMethodAction {
  readonly action: 'setCustomShippingMethod'
  readonly shippingMethodName: string
  readonly shippingRate: ShippingRateDraft
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'
  readonly email: string
}
export interface CartSetCustomerGroupAction {
  readonly action: 'setCustomerGroup'
  readonly customerGroup?: CustomerGroupResourceIdentifier
}
export interface CartSetCustomerIdAction {
  readonly action: 'setCustomerId'
  readonly customerId?: string
}
export interface CartSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface CartSetDeliveryAddressCustomFieldAction {
  readonly action: 'setDeliveryAddressCustomField'
  readonly deliveryId: string
  readonly name: string
  readonly value?: any
}
export interface CartSetDeliveryAddressCustomTypeAction {
  readonly action: 'setDeliveryAddressCustomType'
  readonly deliveryId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetItemShippingAddressCustomFieldAction {
  readonly action: 'setItemShippingAddressCustomField'
  readonly addressKey: string
  readonly name: string
  readonly value?: any
}
export interface CartSetItemShippingAddressCustomTypeAction {
  readonly action: 'setItemShippingAddressCustomType'
  readonly addressKey: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface CartSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface CartSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetLineItemDistributionChannelAction {
  readonly action: 'setLineItemDistributionChannel'
  readonly lineItemId: string
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface CartSetLineItemPriceAction {
  readonly action: 'setLineItemPrice'
  readonly lineItemId: string
  readonly externalPrice?: Money
}
export interface CartSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly lineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface CartSetLineItemSupplyChannelAction {
  readonly action: 'setLineItemSupplyChannel'
  readonly lineItemId: string
  readonly supplyChannel?: ChannelResourceIdentifier
}
export interface CartSetLineItemTaxAmountAction {
  readonly action: 'setLineItemTaxAmount'
  readonly lineItemId: string
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetLineItemTaxRateAction {
  readonly action: 'setLineItemTaxRate'
  readonly lineItemId: string
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetLineItemTotalPriceAction {
  readonly action: 'setLineItemTotalPrice'
  readonly lineItemId: string
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
}
export interface CartSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface CartSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: BaseAddress
}
export interface CartSetShippingAddressCustomFieldAction {
  readonly action: 'setShippingAddressCustomField'
  readonly name: string
  readonly value?: any
}
export interface CartSetShippingAddressCustomTypeAction {
  readonly action: 'setShippingAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartSetShippingMethodAction {
  readonly action: 'setShippingMethod'
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetShippingMethodTaxAmountAction {
  readonly action: 'setShippingMethodTaxAmount'
  readonly externalTaxAmount?: ExternalTaxAmountDraft
}
export interface CartSetShippingMethodTaxRateAction {
  readonly action: 'setShippingMethodTaxRate'
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface CartSetShippingRateInputAction {
  readonly action: 'setShippingRateInput'
  readonly shippingRateInput?: ShippingRateInputDraft
}
export interface CartUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'
  readonly address: BaseAddress
}
export interface CustomLineItemImportDraft {
  readonly name: LocalizedString
  readonly quantity: number
  readonly money: Money
  readonly slug: string
  readonly state?: ItemState[]
  readonly taxRate?: TaxRate
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly custom?: CustomFieldsDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export declare type ProductPublishScope = 'All' | 'Prices'
//# sourceMappingURL=cart.d.ts.map
