import {
  CartOrigin,
  CartReference,
  CartResourceIdentifier,
  CustomLineItem,
  CustomLineItemImportDraft,
  DiscountCodeInfo,
  DiscountedLineItemPortion,
  InventoryMode,
  ItemShippingDetailsDraft,
  LineItem,
  RoundingMode,
  ShippingInfo,
  ShippingMethodState,
  ShippingRateInput,
  TaxCalculationMode,
  TaxedPrice,
  TaxedPriceDraft,
  TaxMode,
} from './cart'
import { CartDiscountReference } from './cart-discount'
import { ChannelReference, ChannelResourceIdentifier } from './channel'
import {
  Address,
  BaseAddress,
  BaseResource,
  CreatedBy,
  Image,
  LastModifiedBy,
  LocalizedString,
  Money,
  PriceDraft,
  TypedMoney,
} from './common'
import { CustomerGroupReference, CustomerGroupResourceIdentifier } from './customer-group'
import {
  StagedOrderAddCustomLineItemAction,
  StagedOrderAddDeliveryAction,
  StagedOrderAddDiscountCodeAction,
  StagedOrderAddItemShippingAddressAction,
  StagedOrderAddLineItemAction,
  StagedOrderAddParcelToDeliveryAction,
  StagedOrderAddPaymentAction,
  StagedOrderAddReturnInfoAction,
  StagedOrderAddShoppingListAction,
  StagedOrderChangeCustomLineItemMoneyAction,
  StagedOrderChangeCustomLineItemQuantityAction,
  StagedOrderChangeLineItemQuantityAction,
  StagedOrderChangeOrderStateAction,
  StagedOrderChangePaymentStateAction,
  StagedOrderChangeShipmentStateAction,
  StagedOrderChangeTaxCalculationModeAction,
  StagedOrderChangeTaxModeAction,
  StagedOrderChangeTaxRoundingModeAction,
  StagedOrderImportCustomLineItemStateAction,
  StagedOrderImportLineItemStateAction,
  StagedOrderRemoveCustomLineItemAction,
  StagedOrderRemoveDeliveryAction,
  StagedOrderRemoveDiscountCodeAction,
  StagedOrderRemoveItemShippingAddressAction,
  StagedOrderRemoveLineItemAction,
  StagedOrderRemoveParcelFromDeliveryAction,
  StagedOrderRemovePaymentAction,
  StagedOrderSetBillingAddressAction,
  StagedOrderSetBillingAddressCustomFieldAction,
  StagedOrderSetBillingAddressCustomTypeAction,
  StagedOrderSetCountryAction,
  StagedOrderSetCustomerEmailAction,
  StagedOrderSetCustomerGroupAction,
  StagedOrderSetCustomerIdAction,
  StagedOrderSetCustomFieldAction,
  StagedOrderSetCustomLineItemCustomFieldAction,
  StagedOrderSetCustomLineItemCustomTypeAction,
  StagedOrderSetCustomLineItemShippingDetailsAction,
  StagedOrderSetCustomLineItemTaxAmountAction,
  StagedOrderSetCustomLineItemTaxRateAction,
  StagedOrderSetCustomShippingMethodAction,
  StagedOrderSetCustomTypeAction,
  StagedOrderSetDeliveryAddressAction,
  StagedOrderSetDeliveryAddressCustomFieldAction,
  StagedOrderSetDeliveryAddressCustomTypeAction,
  StagedOrderSetDeliveryCustomFieldAction,
  StagedOrderSetDeliveryCustomTypeAction,
  StagedOrderSetDeliveryItemsAction,
  StagedOrderSetItemShippingAddressCustomFieldAction,
  StagedOrderSetItemShippingAddressCustomTypeAction,
  StagedOrderSetLineItemCustomFieldAction,
  StagedOrderSetLineItemCustomTypeAction,
  StagedOrderSetLineItemDistributionChannelAction,
  StagedOrderSetLineItemPriceAction,
  StagedOrderSetLineItemShippingDetailsAction,
  StagedOrderSetLineItemTaxAmountAction,
  StagedOrderSetLineItemTaxRateAction,
  StagedOrderSetLineItemTotalPriceAction,
  StagedOrderSetLocaleAction,
  StagedOrderSetOrderNumberAction,
  StagedOrderSetOrderTotalTaxAction,
  StagedOrderSetParcelCustomFieldAction,
  StagedOrderSetParcelCustomTypeAction,
  StagedOrderSetParcelItemsAction,
  StagedOrderSetParcelMeasurementsAction,
  StagedOrderSetParcelTrackingDataAction,
  StagedOrderSetReturnInfoAction,
  StagedOrderSetReturnItemCustomFieldAction,
  StagedOrderSetReturnItemCustomTypeAction,
  StagedOrderSetReturnPaymentStateAction,
  StagedOrderSetReturnShipmentStateAction,
  StagedOrderSetShippingAddressAction,
  StagedOrderSetShippingAddressAndCustomShippingMethodAction,
  StagedOrderSetShippingAddressAndShippingMethodAction,
  StagedOrderSetShippingAddressCustomFieldAction,
  StagedOrderSetShippingAddressCustomTypeAction,
  StagedOrderSetShippingMethodAction,
  StagedOrderSetShippingMethodTaxAmountAction,
  StagedOrderSetShippingMethodTaxRateAction,
  StagedOrderSetShippingRateInputAction,
  StagedOrderTransitionCustomLineItemStateAction,
  StagedOrderTransitionLineItemStateAction,
  StagedOrderTransitionStateAction,
  StagedOrderUpdateItemShippingAddressAction,
  StagedOrderUpdateSyncInfoAction,
} from './order-edit'
import { PaymentReference, PaymentResourceIdentifier } from './payment'
import { Attribute } from './product'
import { ShippingMethodResourceIdentifier, ShippingRateDraft } from './shipping-method'
import { StateReference, StateResourceIdentifier } from './state'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import { TaxCategoryResourceIdentifier, TaxRate } from './tax-category'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export declare type StagedOrderUpdateAction =
  | StagedOrderAddCustomLineItemAction
  | StagedOrderAddDeliveryAction
  | StagedOrderAddDiscountCodeAction
  | StagedOrderAddItemShippingAddressAction
  | StagedOrderAddLineItemAction
  | StagedOrderAddParcelToDeliveryAction
  | StagedOrderAddPaymentAction
  | StagedOrderAddReturnInfoAction
  | StagedOrderAddShoppingListAction
  | StagedOrderChangeCustomLineItemMoneyAction
  | StagedOrderChangeCustomLineItemQuantityAction
  | StagedOrderChangeLineItemQuantityAction
  | StagedOrderChangeOrderStateAction
  | StagedOrderChangePaymentStateAction
  | StagedOrderChangeShipmentStateAction
  | StagedOrderChangeTaxCalculationModeAction
  | StagedOrderChangeTaxModeAction
  | StagedOrderChangeTaxRoundingModeAction
  | StagedOrderImportCustomLineItemStateAction
  | StagedOrderImportLineItemStateAction
  | StagedOrderRemoveCustomLineItemAction
  | StagedOrderRemoveDeliveryAction
  | StagedOrderRemoveDiscountCodeAction
  | StagedOrderRemoveItemShippingAddressAction
  | StagedOrderRemoveLineItemAction
  | StagedOrderRemoveParcelFromDeliveryAction
  | StagedOrderRemovePaymentAction
  | StagedOrderSetBillingAddressAction
  | StagedOrderSetBillingAddressCustomFieldAction
  | StagedOrderSetBillingAddressCustomTypeAction
  | StagedOrderSetCountryAction
  | StagedOrderSetCustomFieldAction
  | StagedOrderSetCustomLineItemCustomFieldAction
  | StagedOrderSetCustomLineItemCustomTypeAction
  | StagedOrderSetCustomLineItemShippingDetailsAction
  | StagedOrderSetCustomLineItemTaxAmountAction
  | StagedOrderSetCustomLineItemTaxRateAction
  | StagedOrderSetCustomShippingMethodAction
  | StagedOrderSetCustomTypeAction
  | StagedOrderSetCustomerEmailAction
  | StagedOrderSetCustomerGroupAction
  | StagedOrderSetCustomerIdAction
  | StagedOrderSetDeliveryAddressAction
  | StagedOrderSetDeliveryAddressCustomFieldAction
  | StagedOrderSetDeliveryAddressCustomTypeAction
  | StagedOrderSetDeliveryCustomFieldAction
  | StagedOrderSetDeliveryCustomTypeAction
  | StagedOrderSetDeliveryItemsAction
  | StagedOrderSetItemShippingAddressCustomFieldAction
  | StagedOrderSetItemShippingAddressCustomTypeAction
  | StagedOrderSetLineItemCustomFieldAction
  | StagedOrderSetLineItemCustomTypeAction
  | StagedOrderSetLineItemDistributionChannelAction
  | StagedOrderSetLineItemPriceAction
  | StagedOrderSetLineItemShippingDetailsAction
  | StagedOrderSetLineItemTaxAmountAction
  | StagedOrderSetLineItemTaxRateAction
  | StagedOrderSetLineItemTotalPriceAction
  | StagedOrderSetLocaleAction
  | StagedOrderSetOrderNumberAction
  | StagedOrderSetOrderTotalTaxAction
  | StagedOrderSetParcelCustomFieldAction
  | StagedOrderSetParcelCustomTypeAction
  | StagedOrderSetParcelItemsAction
  | StagedOrderSetParcelMeasurementsAction
  | StagedOrderSetParcelTrackingDataAction
  | StagedOrderSetReturnInfoAction
  | StagedOrderSetReturnItemCustomFieldAction
  | StagedOrderSetReturnItemCustomTypeAction
  | StagedOrderSetReturnPaymentStateAction
  | StagedOrderSetReturnShipmentStateAction
  | StagedOrderSetShippingAddressAction
  | StagedOrderSetShippingAddressAndCustomShippingMethodAction
  | StagedOrderSetShippingAddressAndShippingMethodAction
  | StagedOrderSetShippingAddressCustomFieldAction
  | StagedOrderSetShippingAddressCustomTypeAction
  | StagedOrderSetShippingMethodAction
  | StagedOrderSetShippingMethodTaxAmountAction
  | StagedOrderSetShippingMethodTaxRateAction
  | StagedOrderSetShippingRateInputAction
  | StagedOrderTransitionCustomLineItemStateAction
  | StagedOrderTransitionLineItemStateAction
  | StagedOrderTransitionStateAction
  | StagedOrderUpdateItemShippingAddressAction
  | StagedOrderUpdateSyncInfoAction
export interface Hit {
  readonly id: string
  readonly version: number
  readonly relevance: number
}
export interface OrderPagedSearchResponse {
  readonly total: number
  readonly offset?: number
  readonly limit?: number
  readonly hits: Hit[]
}
export interface Delivery {
  readonly id: string
  readonly createdAt: string
  readonly items: DeliveryItem[]
  readonly parcels: Parcel[]
  readonly address?: Address
  readonly custom?: CustomFields
}
export interface DeliveryItem {
  readonly id: string
  readonly quantity: number
}
export interface DiscountedLineItemPriceDraft {
  readonly value: Money
  readonly includedDiscounts: DiscountedLineItemPortion[]
}
export interface ItemState {
  readonly quantity: number
  readonly state: StateReference
}
export interface LineItemImportDraft {
  readonly productId?: string
  readonly name: LocalizedString
  readonly variant: ProductVariantImportDraft
  readonly price: PriceDraft
  readonly quantity: number
  readonly state?: ItemState[]
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
  readonly taxRate?: TaxRate
  readonly custom?: CustomFieldsDraft
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface Order extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly completedAt?: string
  readonly orderNumber?: string
  readonly customerId?: string
  readonly customerEmail?: string
  readonly anonymousId?: string
  readonly store?: StoreKeyReference
  readonly lineItems: LineItem[]
  readonly customLineItems: CustomLineItem[]
  readonly totalPrice: TypedMoney
  readonly taxedPrice?: TaxedPrice
  readonly shippingAddress?: Address
  readonly billingAddress?: Address
  readonly taxMode?: TaxMode
  readonly taxRoundingMode?: RoundingMode
  readonly customerGroup?: CustomerGroupReference
  readonly country?: string
  readonly orderState: OrderState
  readonly state?: StateReference
  readonly shipmentState?: ShipmentState
  readonly paymentState?: PaymentState
  readonly shippingInfo?: ShippingInfo
  readonly syncInfo: SyncInfo[]
  readonly returnInfo?: ReturnInfo[]
  readonly discountCodes?: DiscountCodeInfo[]
  readonly lastMessageSequenceNumber: number
  readonly cart?: CartReference
  readonly custom?: CustomFields
  readonly paymentInfo?: PaymentInfo
  readonly locale?: string
  readonly inventoryMode?: InventoryMode
  readonly origin: CartOrigin
  readonly taxCalculationMode?: TaxCalculationMode
  readonly shippingRateInput?: ShippingRateInput
  readonly itemShippingAddresses?: Address[]
  readonly refusedGifts: CartDiscountReference[]
}
export interface OrderFromCartDraft {
  readonly id?: string
  readonly cart?: CartResourceIdentifier
  readonly version: number
  readonly orderNumber?: string
  readonly paymentState?: PaymentState
  readonly shipmentState?: ShipmentState
  readonly orderState?: OrderState
  readonly state?: StateResourceIdentifier
}
export interface OrderImportDraft {
  readonly orderNumber?: string
  readonly customerId?: string
  readonly customerEmail?: string
  readonly lineItems?: LineItemImportDraft[]
  readonly customLineItems?: CustomLineItemImportDraft[]
  readonly totalPrice: Money
  readonly taxedPrice?: TaxedPriceDraft
  readonly shippingAddress?: BaseAddress
  readonly billingAddress?: BaseAddress
  readonly customerGroup?: CustomerGroupResourceIdentifier
  readonly country?: string
  readonly orderState?: OrderState
  readonly shipmentState?: ShipmentState
  readonly paymentState?: PaymentState
  readonly shippingInfo?: ShippingInfoImportDraft
  readonly completedAt?: string
  readonly custom?: CustomFieldsDraft
  readonly inventoryMode?: InventoryMode
  readonly taxRoundingMode?: RoundingMode
  readonly itemShippingAddresses?: BaseAddress[]
  readonly store?: StoreResourceIdentifier
  readonly origin?: CartOrigin
}
export interface OrderPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Order[]
}
export interface OrderReference {
  readonly typeId: 'order'
  readonly id: string
  readonly obj?: Order
}
export interface OrderResourceIdentifier {
  readonly typeId: 'order'
  readonly id?: string
  readonly key?: string
}
export interface OrderSearchQuery {}
export interface OrderSearchRequest {
  readonly query: OrderSearchQuery
  readonly sort?: string
  readonly limit?: number
  readonly offset?: number
}
export declare type OrderState = 'Cancelled' | 'Complete' | 'Confirmed' | 'Open'
export interface OrderUpdate {
  readonly version: number
  readonly actions: OrderUpdateAction[]
}
export declare type OrderUpdateAction =
  | OrderAddDeliveryAction
  | OrderAddItemShippingAddressAction
  | OrderAddParcelToDeliveryAction
  | OrderAddPaymentAction
  | OrderAddReturnInfoAction
  | OrderChangeOrderStateAction
  | OrderChangePaymentStateAction
  | OrderChangeShipmentStateAction
  | OrderImportCustomLineItemStateAction
  | OrderImportLineItemStateAction
  | OrderRemoveDeliveryAction
  | OrderRemoveItemShippingAddressAction
  | OrderRemoveParcelFromDeliveryAction
  | OrderRemovePaymentAction
  | OrderSetBillingAddressAction
  | OrderSetBillingAddressCustomFieldAction
  | OrderSetBillingAddressCustomTypeAction
  | OrderSetCustomFieldAction
  | OrderSetCustomLineItemCustomFieldAction
  | OrderSetCustomLineItemCustomTypeAction
  | OrderSetCustomLineItemShippingDetailsAction
  | OrderSetCustomTypeAction
  | OrderSetCustomerEmailAction
  | OrderSetCustomerIdAction
  | OrderSetDeliveryAddressAction
  | OrderSetDeliveryAddressCustomFieldAction
  | OrderSetDeliveryAddressCustomTypeAction
  | OrderSetDeliveryCustomFieldAction
  | OrderSetDeliveryCustomTypeAction
  | OrderSetDeliveryItemsAction
  | OrderSetItemShippingAddressCustomFieldAction
  | OrderSetItemShippingAddressCustomTypeAction
  | OrderSetLineItemCustomFieldAction
  | OrderSetLineItemCustomTypeAction
  | OrderSetLineItemShippingDetailsAction
  | OrderSetLocaleAction
  | OrderSetOrderNumberAction
  | OrderSetParcelCustomFieldAction
  | OrderSetParcelCustomTypeAction
  | OrderSetParcelItemsAction
  | OrderSetParcelMeasurementsAction
  | OrderSetParcelTrackingDataAction
  | OrderSetReturnInfoAction
  | OrderSetReturnItemCustomFieldAction
  | OrderSetReturnItemCustomTypeAction
  | OrderSetReturnPaymentStateAction
  | OrderSetReturnShipmentStateAction
  | OrderSetShippingAddressAction
  | OrderSetShippingAddressCustomFieldAction
  | OrderSetShippingAddressCustomTypeAction
  | OrderSetStoreAction
  | OrderTransitionCustomLineItemStateAction
  | OrderTransitionLineItemStateAction
  | OrderTransitionStateAction
  | OrderUpdateItemShippingAddressAction
  | OrderUpdateSyncInfoAction
export interface Parcel {
  readonly id: string
  readonly createdAt: string
  readonly measurements?: ParcelMeasurements
  readonly trackingData?: TrackingData
  readonly items?: DeliveryItem[]
  readonly custom?: CustomFields
}
export interface ParcelDraft {
  readonly measurements?: ParcelMeasurements
  readonly trackingData?: TrackingData
  readonly items?: DeliveryItem[]
  readonly custom?: CustomFieldsDraft
}
export interface ParcelMeasurements {
  readonly heightInMillimeter?: number
  readonly lengthInMillimeter?: number
  readonly widthInMillimeter?: number
  readonly weightInGram?: number
}
export interface PaymentInfo {
  readonly payments: PaymentReference[]
}
export declare type PaymentState = 'BalanceDue' | 'CreditOwed' | 'Failed' | 'Paid' | 'Pending'
export interface ProductVariantImportDraft {
  readonly id?: number
  readonly sku?: string
  readonly prices?: PriceDraft[]
  readonly attributes?: Attribute[]
  readonly images?: Image[]
}
export interface ReturnInfo {
  readonly items: ReturnItem[]
  readonly returnTrackingId?: string
  readonly returnDate?: string
}
export interface ReturnInfoDraft {
  readonly items: ReturnItemDraft[]
  readonly returnTrackingId?: string
  readonly returnDate?: string
}
export declare type ReturnItem = CustomLineItemReturnItem | LineItemReturnItem
export interface CustomLineItemReturnItem {
  readonly type: 'CustomLineItemReturnItem'
  readonly id: string
  readonly quantity: number
  readonly comment?: string
  readonly shipmentState: ReturnShipmentState
  readonly paymentState: ReturnPaymentState
  readonly custom?: CustomFields
  readonly lastModifiedAt: string
  readonly createdAt: string
  readonly customLineItemId: string
}
export interface LineItemReturnItem {
  readonly type: 'LineItemReturnItem'
  readonly id: string
  readonly quantity: number
  readonly comment?: string
  readonly shipmentState: ReturnShipmentState
  readonly paymentState: ReturnPaymentState
  readonly custom?: CustomFields
  readonly lastModifiedAt: string
  readonly createdAt: string
  readonly lineItemId: string
}
export interface ReturnItemDraft {
  readonly quantity: number
  readonly lineItemId?: string
  readonly customLineItemId?: string
  readonly comment?: string
  readonly shipmentState: ReturnShipmentState
  readonly custom?: CustomFieldsDraft
}
export declare type ReturnPaymentState = 'Initial' | 'NonRefundable' | 'NotRefunded' | 'Refunded'
export declare type ReturnShipmentState = 'Advised' | 'BackInStock' | 'Returned' | 'Unusable'
export declare type ShipmentState = 'Backorder' | 'Delayed' | 'Partial' | 'Pending' | 'Ready' | 'Shipped'
export interface ShippingInfoImportDraft {
  readonly shippingMethodName: string
  readonly price: Money
  readonly shippingRate: ShippingRateDraft
  readonly taxRate?: TaxRate
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly shippingMethod?: ShippingMethodResourceIdentifier
  readonly deliveries?: Delivery[]
  readonly discountedPrice?: DiscountedLineItemPriceDraft
  readonly shippingMethodState?: ShippingMethodState
}
export interface SyncInfo {
  readonly channel: ChannelReference
  readonly externalId?: string
  readonly syncedAt: string
}
export interface TaxedItemPriceDraft {
  readonly totalNet: Money
  readonly totalGross: Money
}
export interface TrackingData {
  readonly trackingId?: string
  readonly carrier?: string
  readonly provider?: string
  readonly providerTransaction?: string
  readonly isReturn?: boolean
}
export interface OrderAddDeliveryAction {
  readonly action: 'addDelivery'
  readonly items?: DeliveryItem[]
  readonly address?: BaseAddress
  readonly parcels?: ParcelDraft[]
  readonly custom?: CustomFieldsDraft
}
export interface OrderAddItemShippingAddressAction {
  readonly action: 'addItemShippingAddress'
  readonly address: BaseAddress
}
export interface OrderAddParcelToDeliveryAction {
  readonly action: 'addParcelToDelivery'
  readonly deliveryId: string
  readonly measurements?: ParcelMeasurements
  readonly trackingData?: TrackingData
  readonly items?: DeliveryItem[]
}
export interface OrderAddPaymentAction {
  readonly action: 'addPayment'
  readonly payment: PaymentResourceIdentifier
}
export interface OrderAddReturnInfoAction {
  readonly action: 'addReturnInfo'
  readonly returnTrackingId?: string
  readonly items: ReturnItemDraft[]
  readonly returnDate?: string
}
export interface OrderChangeOrderStateAction {
  readonly action: 'changeOrderState'
  readonly orderState: OrderState
}
export interface OrderChangePaymentStateAction {
  readonly action: 'changePaymentState'
  readonly paymentState?: PaymentState
}
export interface OrderChangeShipmentStateAction {
  readonly action: 'changeShipmentState'
  readonly shipmentState?: ShipmentState
}
export interface OrderImportCustomLineItemStateAction {
  readonly action: 'importCustomLineItemState'
  readonly customLineItemId: string
  readonly state: ItemState[]
}
export interface OrderImportLineItemStateAction {
  readonly action: 'importLineItemState'
  readonly lineItemId: string
  readonly state: ItemState[]
}
export interface OrderRemoveDeliveryAction {
  readonly action: 'removeDelivery'
  readonly deliveryId: string
}
export interface OrderRemoveItemShippingAddressAction {
  readonly action: 'removeItemShippingAddress'
  readonly addressKey: string
}
export interface OrderRemoveParcelFromDeliveryAction {
  readonly action: 'removeParcelFromDelivery'
  readonly parcelId: string
}
export interface OrderRemovePaymentAction {
  readonly action: 'removePayment'
  readonly payment: PaymentResourceIdentifier
}
export interface OrderSetBillingAddressAction {
  readonly action: 'setBillingAddress'
  readonly address?: BaseAddress
}
export interface OrderSetBillingAddressCustomFieldAction {
  readonly action: 'setBillingAddressCustomField'
  readonly name: string
  readonly value?: any
}
export interface OrderSetBillingAddressCustomTypeAction {
  readonly action: 'setBillingAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface OrderSetCustomLineItemCustomFieldAction {
  readonly action: 'setCustomLineItemCustomField'
  readonly customLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetCustomLineItemCustomTypeAction {
  readonly action: 'setCustomLineItemCustomType'
  readonly customLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetCustomLineItemShippingDetailsAction {
  readonly action: 'setCustomLineItemShippingDetails'
  readonly customLineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface OrderSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetCustomerEmailAction {
  readonly action: 'setCustomerEmail'
  readonly email?: string
}
export interface OrderSetCustomerIdAction {
  readonly action: 'setCustomerId'
  readonly customerId?: string
}
export interface OrderSetDeliveryAddressAction {
  readonly action: 'setDeliveryAddress'
  readonly deliveryId: string
  readonly address?: BaseAddress
}
export interface OrderSetDeliveryAddressCustomFieldAction {
  readonly action: 'setDeliveryAddressCustomField'
  readonly deliveryId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetDeliveryAddressCustomTypeAction {
  readonly action: 'setDeliveryAddressCustomType'
  readonly deliveryId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetDeliveryCustomFieldAction {
  readonly action: 'setDeliveryCustomField'
  readonly deliveryId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetDeliveryCustomTypeAction {
  readonly action: 'setDeliveryCustomType'
  readonly deliveryId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetDeliveryItemsAction {
  readonly action: 'setDeliveryItems'
  readonly deliveryId: string
  readonly items: DeliveryItem[]
}
export interface OrderSetItemShippingAddressCustomFieldAction {
  readonly action: 'setItemShippingAddressCustomField'
  readonly addressKey: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetItemShippingAddressCustomTypeAction {
  readonly action: 'setItemShippingAddressCustomType'
  readonly addressKey: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetLineItemShippingDetailsAction {
  readonly action: 'setLineItemShippingDetails'
  readonly lineItemId: string
  readonly shippingDetails?: ItemShippingDetailsDraft
}
export interface OrderSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface OrderSetOrderNumberAction {
  readonly action: 'setOrderNumber'
  readonly orderNumber?: string
}
export interface OrderSetParcelCustomFieldAction {
  readonly action: 'setParcelCustomField'
  readonly parcelId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetParcelCustomTypeAction {
  readonly action: 'setParcelCustomType'
  readonly parcelId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetParcelItemsAction {
  readonly action: 'setParcelItems'
  readonly parcelId: string
  readonly items: DeliveryItem[]
}
export interface OrderSetParcelMeasurementsAction {
  readonly action: 'setParcelMeasurements'
  readonly parcelId: string
  readonly measurements?: ParcelMeasurements
}
export interface OrderSetParcelTrackingDataAction {
  readonly action: 'setParcelTrackingData'
  readonly parcelId: string
  readonly trackingData?: TrackingData
}
export interface OrderSetReturnInfoAction {
  readonly action: 'setReturnInfo'
  readonly items?: ReturnInfoDraft[]
}
export interface OrderSetReturnItemCustomFieldAction {
  readonly action: 'setReturnItemCustomField'
  readonly returnItemId: string
  readonly name: string
  readonly value?: any
}
export interface OrderSetReturnItemCustomTypeAction {
  readonly action: 'setReturnItemCustomType'
  readonly returnItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetReturnPaymentStateAction {
  readonly action: 'setReturnPaymentState'
  readonly returnItemId: string
  readonly paymentState: ReturnPaymentState
}
export interface OrderSetReturnShipmentStateAction {
  readonly action: 'setReturnShipmentState'
  readonly returnItemId: string
  readonly shipmentState: ReturnShipmentState
}
export interface OrderSetShippingAddressAction {
  readonly action: 'setShippingAddress'
  readonly address?: BaseAddress
}
export interface OrderSetShippingAddressCustomFieldAction {
  readonly action: 'setShippingAddressCustomField'
  readonly name: string
  readonly value?: any
}
export interface OrderSetShippingAddressCustomTypeAction {
  readonly action: 'setShippingAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface OrderSetStoreAction {
  readonly action: 'setStore'
  readonly store?: StoreResourceIdentifier
}
export interface OrderTransitionCustomLineItemStateAction {
  readonly action: 'transitionCustomLineItemState'
  readonly customLineItemId: string
  readonly quantity: number
  readonly fromState: StateResourceIdentifier
  readonly toState: StateResourceIdentifier
  readonly actualTransitionDate?: string
}
export interface OrderTransitionLineItemStateAction {
  readonly action: 'transitionLineItemState'
  readonly lineItemId: string
  readonly quantity: number
  readonly fromState: StateResourceIdentifier
  readonly toState: StateResourceIdentifier
  readonly actualTransitionDate?: string
}
export interface OrderTransitionStateAction {
  readonly action: 'transitionState'
  readonly state: StateResourceIdentifier
  readonly force?: boolean
}
export interface OrderUpdateItemShippingAddressAction {
  readonly action: 'updateItemShippingAddress'
  readonly address: BaseAddress
}
export interface OrderUpdateSyncInfoAction {
  readonly action: 'updateSyncInfo'
  readonly channel: ChannelResourceIdentifier
  readonly externalId?: string
  readonly syncedAt?: string
}
//# sourceMappingURL=order.d.ts.map
