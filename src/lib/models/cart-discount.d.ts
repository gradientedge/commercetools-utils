import { ChannelReference, ChannelResourceIdentifier } from './channel'
import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString, Money, Reference, TypedMoney } from './common'
import { ProductReference, ProductResourceIdentifier } from './product'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface CartDiscount extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly name: LocalizedString
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: CartDiscountValue
  readonly cartPredicate: string
  readonly target?: CartDiscountTarget
  readonly sortOrder: string
  readonly isActive: boolean
  readonly validFrom?: string
  readonly validUntil?: string
  readonly requiresDiscountCode: boolean
  readonly references: Reference[]
  readonly stackingMode: StackingMode
  readonly custom?: CustomFields
}
export interface CartDiscountDraft {
  readonly name: LocalizedString
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: CartDiscountValueDraft
  readonly cartPredicate: string
  readonly target?: CartDiscountTarget
  readonly sortOrder: string
  readonly isActive?: boolean
  readonly validFrom?: string
  readonly validUntil?: string
  readonly requiresDiscountCode?: boolean
  readonly stackingMode?: StackingMode
  readonly custom?: CustomFieldsDraft
}
export interface CartDiscountPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: CartDiscount[]
}
export interface CartDiscountReference {
  readonly typeId: 'cart-discount'
  readonly id: string
  readonly obj?: CartDiscount
}
export interface CartDiscountResourceIdentifier {
  readonly typeId: 'cart-discount'
  readonly id?: string
  readonly key?: string
}
export declare type CartDiscountTarget =
  | CartDiscountCustomLineItemsTarget
  | CartDiscountLineItemsTarget
  | CartDiscountShippingCostTarget
  | MultiBuyCustomLineItemsTarget
  | MultiBuyLineItemsTarget
export interface CartDiscountCustomLineItemsTarget {
  readonly type: 'customLineItems'
  readonly predicate: string
}
export interface CartDiscountLineItemsTarget {
  readonly type: 'lineItems'
  readonly predicate: string
}
export interface CartDiscountShippingCostTarget {
  readonly type: 'shipping'
}
export interface CartDiscountUpdate {
  readonly version: number
  readonly actions: CartDiscountUpdateAction[]
}
export declare type CartDiscountUpdateAction =
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
export declare type CartDiscountValue =
  | CartDiscountValueAbsolute
  | CartDiscountValueFixed
  | CartDiscountValueGiftLineItem
  | CartDiscountValueRelative
export interface CartDiscountValueAbsolute {
  readonly type: 'absolute'
  readonly money: TypedMoney[]
}
export declare type CartDiscountValueDraft =
  | CartDiscountValueAbsoluteDraft
  | CartDiscountValueFixedDraft
  | CartDiscountValueGiftLineItemDraft
  | CartDiscountValueRelativeDraft
export interface CartDiscountValueAbsoluteDraft {
  readonly type: 'absolute'
  readonly money: Money[]
}
export interface CartDiscountValueFixed {
  readonly type: 'fixed'
  readonly money: TypedMoney[]
}
export interface CartDiscountValueFixedDraft {
  readonly type: 'fixed'
  readonly money: Money[]
}
export interface CartDiscountValueGiftLineItem {
  readonly type: 'giftLineItem'
  readonly product: ProductReference
  readonly variantId: number
  readonly supplyChannel?: ChannelReference
  readonly distributionChannel?: ChannelReference
}
export interface CartDiscountValueGiftLineItemDraft {
  readonly type: 'giftLineItem'
  readonly product: ProductResourceIdentifier
  readonly variantId: number
  readonly supplyChannel?: ChannelResourceIdentifier
  readonly distributionChannel?: ChannelResourceIdentifier
}
export interface CartDiscountValueRelative {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface CartDiscountValueRelativeDraft {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface MultiBuyCustomLineItemsTarget {
  readonly type: 'multiBuyCustomLineItems'
  readonly predicate: string
  readonly triggerQuantity: number
  readonly discountedQuantity: number
  readonly maxOccurrence?: number
  readonly selectionMode: SelectionMode
}
export interface MultiBuyLineItemsTarget {
  readonly type: 'multiBuyLineItems'
  readonly predicate: string
  readonly triggerQuantity: number
  readonly discountedQuantity: number
  readonly maxOccurrence?: number
  readonly selectionMode: SelectionMode
}
export declare type SelectionMode = 'Cheapest' | 'MostExpensive'
export declare type StackingMode = 'Stacking' | 'StopAfterThisDiscount'
export interface CartDiscountChangeCartPredicateAction {
  readonly action: 'changeCartPredicate'
  readonly cartPredicate: string
}
export interface CartDiscountChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface CartDiscountChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface CartDiscountChangeRequiresDiscountCodeAction {
  readonly action: 'changeRequiresDiscountCode'
  readonly requiresDiscountCode: boolean
}
export interface CartDiscountChangeSortOrderAction {
  readonly action: 'changeSortOrder'
  readonly sortOrder: string
}
export interface CartDiscountChangeStackingModeAction {
  readonly action: 'changeStackingMode'
  readonly stackingMode: StackingMode
}
export interface CartDiscountChangeTargetAction {
  readonly action: 'changeTarget'
  readonly target: CartDiscountTarget
}
export interface CartDiscountChangeValueAction {
  readonly action: 'changeValue'
  readonly value: CartDiscountValueDraft
}
export interface CartDiscountSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CartDiscountSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CartDiscountSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface CartDiscountSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface CartDiscountSetValidFromAction {
  readonly action: 'setValidFrom'
  readonly validFrom?: string
}
export interface CartDiscountSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface CartDiscountSetValidUntilAction {
  readonly action: 'setValidUntil'
  readonly validUntil?: string
}
//# sourceMappingURL=cart-discount.d.ts.map
