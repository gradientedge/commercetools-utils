import {
  DiscountCodeInfo,
  ExternalLineItemTotalPrice,
  ExternalTaxRateDraft,
  InventoryMode,
  ItemShippingDetailsDraft,
  ItemShippingTarget,
  TaxMode,
} from './cart'
import { ChannelResourceIdentifier } from './channel'
import { BaseAddress, LocalizedString, Money, TypedMoney } from './common'
import { CustomerReference } from './customer'
import { DiscountCodeReference } from './discount-code'
import { PaymentMethodInfo, PaymentResourceIdentifier, Transaction, TransactionDraft, TransactionType } from './payment'
import { ShippingMethodResourceIdentifier } from './shipping-method'
import { ShoppingListLineItemDraft, TextLineItemDraft } from './shopping-list'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface MyCartDraft {
  readonly currency: string
  readonly customerEmail?: string
  readonly country?: string
  readonly inventoryMode?: InventoryMode
  readonly lineItems?: MyLineItemDraft[]
  readonly shippingAddress?: BaseAddress
  readonly billingAddress?: BaseAddress
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  readonly custom?: CustomFieldsDraft
  readonly locale?: string
  readonly taxMode?: TaxMode
  readonly deleteDaysAfterLastModification?: number
  readonly itemShippingAddresses?: BaseAddress[]
  readonly store?: StoreKeyReference
  readonly discountCodes?: DiscountCodeInfo[]
}
export interface MyCartUpdate {
  readonly version: number
  readonly actions: MyCartUpdateAction[]
}
export declare type MyCartUpdateAction =
  | MyCartAddDiscountCodeAction
  | MyCartAddItemShippingAddressAction
  | MyCartAddLineItemAction
  | MyCartAddPaymentAction
  | MyCartApplyDeltaToLineItemShippingDetailsTargetsAction
  | MyCartChangeLineItemQuantityAction
  | MyCartChangeTaxModeAction
  | MyCartRecalculateAction
  | MyCartRemoveDiscountCodeAction
  | MyCartRemoveItemShippingAddressAction
  | MyCartRemoveLineItemAction
  | MyCartRemovePaymentAction
  | MyCartSetBillingAddressAction
  | MyCartSetCountryAction
  | MyCartSetCustomFieldAction
  | MyCartSetCustomTypeAction
  | MyCartSetCustomerEmailAction
  | MyCartSetDeleteDaysAfterLastModificationAction
  | MyCartSetLineItemCustomFieldAction
  | MyCartSetLineItemCustomTypeAction
  | MyCartSetLineItemDistributionChannelAction
  | MyCartSetLineItemShippingDetailsAction
  | MyCartSetLineItemSupplyChannelAction
  | MyCartSetLocaleAction
  | MyCartSetShippingAddressAction
  | MyCartSetShippingMethodAction
  | MyCartUpdateItemShippingAddressAction
export interface MyCustomerDraft {
  readonly email: string
  readonly password: string
  readonly firstName?: string
  readonly lastName?: string
  readonly middleName?: string
  readonly title?: string
  readonly dateOfBirth?: string
  readonly companyName?: string
  readonly vatId?: string
  readonly addresses?: BaseAddress[]
  readonly defaultShippingAddress?: number
  readonly defaultBillingAddress?: number
  readonly custom?: CustomFields
  readonly locale?: string
  readonly stores?: StoreResourceIdentifier[]
}
export interface MyCustomerUpdate {
  readonly version: number
  readonly actions: MyCustomerUpdateAction[]
}
export declare type MyCustomerUpdateAction =
  | MyCustomerAddAddressAction
  | MyCustomerAddBillingAddressIdAction
  | MyCustomerAddShippingAddressIdAction
  | MyCustomerChangeAddressAction
  | MyCustomerChangeEmailAction
  | MyCustomerRemoveAddressAction
  | MyCustomerRemoveBillingAddressIdAction
  | MyCustomerRemoveShippingAddressIdAction
  | MyCustomerSetCompanyNameAction
  | MyCustomerSetCustomFieldAction
  | MyCustomerSetCustomTypeAction
  | MyCustomerSetDateOfBirthAction
  | MyCustomerSetDefaultBillingAddressAction
  | MyCustomerSetDefaultShippingAddressAction
  | MyCustomerSetFirstNameAction
  | MyCustomerSetLastNameAction
  | MyCustomerSetLocaleAction
  | MyCustomerSetMiddleNameAction
  | MyCustomerSetSalutationAction
  | MyCustomerSetTitleAction
  | MyCustomerSetVatIdAction
export interface MyLineItemDraft {
  readonly productId?: string
  readonly variantId?: number
  readonly quantity: number
  readonly addedAt?: string
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly custom?: CustomFieldsDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
  readonly sku?: string
}
export interface MyOrderFromCartDraft {
  readonly id: string
  readonly version: number
}
export interface MyPayment {
  readonly id: string
  readonly version: number
  readonly customer?: CustomerReference
  readonly anonymousId?: string
  readonly amountPlanned: TypedMoney
  readonly paymentMethodInfo: PaymentMethodInfo
  readonly transactions: Transaction[]
  readonly custom?: CustomFields
}
export interface MyPaymentDraft {
  readonly amountPlanned: Money
  readonly paymentMethodInfo?: PaymentMethodInfo
  readonly custom?: CustomFieldsDraft
  readonly transaction?: MyTransactionDraft
}
export interface MyPaymentPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: MyPayment[]
}
export interface MyPaymentUpdate {
  readonly version: number
  readonly actions: MyPaymentUpdateAction[]
}
export declare type MyPaymentUpdateAction =
  | MyPaymentAddTransactionAction
  | MyPaymentChangeAmountPlannedAction
  | MyPaymentSetCustomFieldAction
  | MyPaymentSetMethodInfoInterfaceAction
  | MyPaymentSetMethodInfoMethodAction
  | MyPaymentSetMethodInfoNameAction
  | MyPaymentSetTransactionCustomFieldAction
export interface MyShoppingListDraft {
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly lineItems?: ShoppingListLineItemDraft[]
  readonly textLineItems?: TextLineItemDraft[]
  readonly custom?: CustomFieldsDraft
  readonly deleteDaysAfterLastModification?: number
  readonly store?: StoreResourceIdentifier
}
export interface MyShoppingListUpdate {
  readonly version: number
  readonly actions: MyShoppingListUpdateAction[]
}
export declare type MyShoppingListUpdateAction =
  | MyShoppingListAddLineItemAction
  | MyShoppingListAddTextLineItemAction
  | MyShoppingListChangeLineItemQuantityAction
  | MyShoppingListChangeLineItemsOrderAction
  | MyShoppingListChangeNameAction
  | MyShoppingListChangeTextLineItemNameAction
  | MyShoppingListChangeTextLineItemQuantityAction
  | MyShoppingListChangeTextLineItemsOrderAction
  | MyShoppingListRemoveLineItemAction
  | MyShoppingListRemoveTextLineItemAction
  | MyShoppingListSetCustomFieldAction
  | MyShoppingListSetCustomTypeAction
  | MyShoppingListSetDeleteDaysAfterLastModificationAction
  | MyShoppingListSetDescriptionAction
  | MyShoppingListSetLineItemCustomFieldAction
  | MyShoppingListSetLineItemCustomTypeAction
  | MyShoppingListSetTextLineItemCustomFieldAction
  | MyShoppingListSetTextLineItemCustomTypeAction
  | MyShoppingListSetTextLineItemDescriptionAction
export interface MyTransactionDraft {
  readonly timestamp?: string
  readonly type: TransactionType
  readonly amount: Money
  readonly interactionId?: string
  readonly custom?: CustomFields
}
export interface MyCartAddDiscountCodeAction {
  readonly action: 'addDiscountCode'
  readonly code: string
}
export interface MyCartAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: BaseAddress
}
export interface MyCartAddLineItemAction {
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
  readonly addedAt?: string
}
export interface MyCartAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface MyCartApplyDeltaToLineItemShippingDetailsTargetsAction {
  readonly action: 'applyDeltaToLineItemShippingDetailsTargets'
  readonly lineItemId: string
  readonly targetsDelta: ItemShippingTarget[]
}
export interface MyCartChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly lineItemId: string
  readonly quantity: number
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
}
export interface MyCartChangeTaxModeAction {
  readonly action: 'changeTaxMode'
  readonly taxMode: TaxMode
}
export interface MyCartRecalculateAction {
  readonly action: 'recalculate'
  readonly updateProductData?: boolean
}
export interface MyCartRemoveDiscountCodeAction {
  readonly action: 'removeDiscountCode'
  readonly discountCode: DiscountCodeReference
}
export interface MyCartRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'
  readonly addressKey: string
}
export interface MyCartRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
  readonly externalPrice?: Money
  readonly externalTotalPrice?: ExternalLineItemTotalPrice
  readonly shippingDetailsToRemove?: ItemShippingDetailsDraft
}
export interface MyCartRemovePaymentAction {
  readonly action: 'removePayment'
  readonly payment: PaymentResourceIdentifier
}
export interface MyCartSetBillingAddressAction {
  readonly action: 'setBillingAddress'
  readonly address?: BaseAddress
}
export interface MyCartSetCountryAction {
  readonly action: 'setCountry'
  readonly country?: string
}
export interface MyCartSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface MyCartSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyCartSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'
  readonly email?: string
}
export interface MyCartSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface MyCartSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface MyCartSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyCartSetLineItemDistributionChannelAction {
  readonly action: 'setLineItemDistributionChannel'
  readonly lineItemId: string
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface MyCartSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly lineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface MyCartSetLineItemSupplyChannelAction {
  readonly action: 'setLineItemSupplyChannel'
  readonly lineItemId: string
  readonly supplyChannel?: ChannelResourceIdentifier
}
export interface MyCartSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface MyCartSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: BaseAddress
}
export interface MyCartSetShippingMethodAction {
  readonly action: 'setShippingMethod'
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  readonly externalTaxRate?: ExternalTaxRateDraft
}
export interface MyCartUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'
  readonly address: BaseAddress
}
export interface MyCustomerAddAddressAction {
  readonly action: 'addAddress'
  readonly address: BaseAddress
}
export interface MyCustomerAddBillingAddressIdAction {
  readonly action: 'addBillingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerAddShippingAddressIdAction {
  readonly action: 'addShippingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerChangeAddressAction {
  readonly action: 'changeAddress'
  readonly addressId?: string
  readonly addressKey?: string
  readonly address: BaseAddress
}
export interface MyCustomerChangeEmailAction {
  readonly action: 'changeEmail'
  readonly email: string
}
export interface MyCustomerRemoveAddressAction {
  readonly action: 'removeAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerRemoveBillingAddressIdAction {
  readonly action: 'removeBillingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerRemoveShippingAddressIdAction {
  readonly action: 'removeShippingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerSetCompanyNameAction {
  readonly action: 'setCompanyName'
  readonly companyName?: string
}
export interface MyCustomerSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface MyCustomerSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyCustomerSetDateOfBirthAction {
  readonly action: 'setDateOfBirth'
  readonly dateOfBirth?: string
}
export interface MyCustomerSetDefaultBillingAddressAction {
  readonly action: 'setDefaultBillingAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerSetDefaultShippingAddressAction {
  readonly action: 'setDefaultShippingAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface MyCustomerSetFirstNameAction {
  readonly action: 'setFirstName'
  readonly firstName?: string
}
export interface MyCustomerSetLastNameAction {
  readonly action: 'setLastName'
  readonly lastName?: string
}
export interface MyCustomerSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface MyCustomerSetMiddleNameAction {
  readonly action: 'setMiddleName'
  readonly middleName?: string
}
export interface MyCustomerSetSalutationAction {
  readonly action: 'setSalutation'
  readonly salutation?: string
}
export interface MyCustomerSetTitleAction {
  readonly action: 'setTitle'
  readonly title?: string
}
export interface MyCustomerSetVatIdAction {
  readonly action: 'setVatId'
  readonly vatId?: string
}
export interface MyPaymentAddTransactionAction {
  readonly action: 'addTransaction'
  readonly transaction: TransactionDraft
}
export interface MyPaymentChangeAmountPlannedAction {
  readonly action: 'changeAmountPlanned'
  readonly amount: Money
}
export interface MyPaymentSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface MyPaymentSetMethodInfoInterfaceAction {
  readonly action: 'setMethodInfoInterface'
  readonly interface: string
}
export interface MyPaymentSetMethodInfoMethodAction {
  readonly action: 'setMethodInfoMethod'
  readonly method?: string
}
export interface MyPaymentSetMethodInfoNameAction {
  readonly action: 'setMethodInfoName'
  readonly name?: LocalizedString
}
export interface MyPaymentSetTransactionCustomFieldAction {
  readonly action: 'setTransactionCustomField'
  readonly name: string
  readonly value?: any
}
export interface MyShoppingListAddLineItemAction {
  readonly action: 'addLineItem'
  readonly sku?: string
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface MyShoppingListAddTextLineItemAction {
  readonly action: 'addTextLineItem'
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface MyShoppingListChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly lineItemId: string
  readonly quantity: number
}
export interface MyShoppingListChangeLineItemsOrderAction {
  readonly action: 'changeLineItemsOrder'
  readonly lineItemOrder: string[]
}
export interface MyShoppingListChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface MyShoppingListChangeTextLineItemNameAction {
  readonly action: 'changeTextLineItemName'
  readonly textLineItemId: string
  readonly name: LocalizedString
}
export interface MyShoppingListChangeTextLineItemQuantityAction {
  readonly action: 'changeTextLineItemQuantity'
  readonly textLineItemId: string
  readonly quantity: number
}
export interface MyShoppingListChangeTextLineItemsOrderAction {
  readonly action: 'changeTextLineItemsOrder'
  readonly textLineItemOrder: string[]
}
export interface MyShoppingListRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}
export interface MyShoppingListRemoveTextLineItemAction {
  readonly action: 'removeTextLineItem'
  readonly textLineItemId: string
  readonly quantity?: number
}
export interface MyShoppingListSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface MyShoppingListSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyShoppingListSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface MyShoppingListSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface MyShoppingListSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface MyShoppingListSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyShoppingListSetTextLineItemCustomFieldAction {
  readonly action: 'setTextLineItemCustomField'
  readonly textLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface MyShoppingListSetTextLineItemCustomTypeAction {
  readonly action: 'setTextLineItemCustomType'
  readonly textLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface MyShoppingListSetTextLineItemDescriptionAction {
  readonly action: 'setTextLineItemDescription'
  readonly textLineItemId: string
  readonly description?: LocalizedString
}
//# sourceMappingURL=me.d.ts.map
