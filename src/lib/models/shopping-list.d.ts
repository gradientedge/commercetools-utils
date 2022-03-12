import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString } from './common'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { ProductVariant } from './product'
import { ProductTypeReference } from './product-type'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface ShoppingList extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly custom?: CustomFields
  readonly customer?: CustomerReference
  readonly deleteDaysAfterLastModification?: number
  readonly description?: LocalizedString
  readonly key?: string
  readonly lineItems?: ShoppingListLineItem[]
  readonly name: LocalizedString
  readonly slug?: LocalizedString
  readonly textLineItems?: TextLineItem[]
  readonly anonymousId?: string
  readonly store?: StoreKeyReference
}
export interface ShoppingListDraft {
  readonly custom?: CustomFieldsDraft
  readonly customer?: CustomerResourceIdentifier
  readonly deleteDaysAfterLastModification?: number
  readonly description?: LocalizedString
  readonly key?: string
  readonly lineItems?: ShoppingListLineItemDraft[]
  readonly name: LocalizedString
  readonly slug?: LocalizedString
  readonly textLineItems?: TextLineItemDraft[]
  readonly anonymousId?: string
  readonly store?: StoreResourceIdentifier
}
export interface ShoppingListLineItem {
  readonly addedAt: string
  readonly custom?: CustomFields
  readonly deactivatedAt?: string
  readonly id: string
  readonly name: LocalizedString
  readonly productId: string
  readonly productSlug?: LocalizedString
  readonly productType: ProductTypeReference
  readonly quantity: number
  readonly variant?: ProductVariant
  readonly variantId?: number
}
export interface ShoppingListLineItemDraft {
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
  readonly sku?: string
  readonly productId?: string
  readonly quantity?: number
  readonly variantId?: number
}
export interface ShoppingListPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ShoppingList[]
}
export interface ShoppingListReference {
  readonly typeId: 'shopping-list'
  readonly id: string
  readonly obj?: ShoppingList
}
export interface ShoppingListResourceIdentifier {
  readonly typeId: 'shopping-list'
  readonly id?: string
  readonly key?: string
}
export interface ShoppingListUpdate {
  readonly version: number
  readonly actions: ShoppingListUpdateAction[]
}
export declare type ShoppingListUpdateAction =
  | ShoppingListAddLineItemAction
  | ShoppingListAddTextLineItemAction
  | ShoppingListChangeLineItemQuantityAction
  | ShoppingListChangeLineItemsOrderAction
  | ShoppingListChangeNameAction
  | ShoppingListChangeTextLineItemNameAction
  | ShoppingListChangeTextLineItemQuantityAction
  | ShoppingListChangeTextLineItemsOrderAction
  | ShoppingListRemoveLineItemAction
  | ShoppingListRemoveTextLineItemAction
  | ShoppingListSetAnonymousIdAction
  | ShoppingListSetCustomFieldAction
  | ShoppingListSetCustomTypeAction
  | ShoppingListSetCustomerAction
  | ShoppingListSetDeleteDaysAfterLastModificationAction
  | ShoppingListSetDescriptionAction
  | ShoppingListSetKeyAction
  | ShoppingListSetLineItemCustomFieldAction
  | ShoppingListSetLineItemCustomTypeAction
  | ShoppingListSetSlugAction
  | ShoppingListSetStoreAction
  | ShoppingListSetTextLineItemCustomFieldAction
  | ShoppingListSetTextLineItemCustomTypeAction
  | ShoppingListSetTextLineItemDescriptionAction
export interface TextLineItem {
  readonly addedAt: string
  readonly custom?: CustomFields
  readonly description?: LocalizedString
  readonly id: string
  readonly name: LocalizedString
  readonly quantity: number
}
export interface TextLineItemDraft {
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
  readonly description?: LocalizedString
  readonly name: LocalizedString
  readonly quantity?: number
}
export interface ShoppingListAddLineItemAction {
  readonly action: 'addLineItem'
  readonly sku?: string
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface ShoppingListAddTextLineItemAction {
  readonly action: 'addTextLineItem'
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly quantity?: number
  readonly addedAt?: string
  readonly custom?: CustomFieldsDraft
}
export interface ShoppingListChangeLineItemQuantityAction {
  readonly action: 'changeLineItemQuantity'
  readonly lineItemId: string
  readonly quantity: number
}
export interface ShoppingListChangeLineItemsOrderAction {
  readonly action: 'changeLineItemsOrder'
  readonly lineItemOrder: string[]
}
export interface ShoppingListChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ShoppingListChangeTextLineItemNameAction {
  readonly action: 'changeTextLineItemName'
  readonly textLineItemId: string
  readonly name: LocalizedString
}
export interface ShoppingListChangeTextLineItemQuantityAction {
  readonly action: 'changeTextLineItemQuantity'
  readonly textLineItemId: string
  readonly quantity: number
}
export interface ShoppingListChangeTextLineItemsOrderAction {
  readonly action: 'changeTextLineItemsOrder'
  readonly textLineItemOrder: string[]
}
export interface ShoppingListRemoveLineItemAction {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}
export interface ShoppingListRemoveTextLineItemAction {
  readonly action: 'removeTextLineItem'
  readonly textLineItemId: string
  readonly quantity?: number
}
export interface ShoppingListSetAnonymousIdAction {
  readonly action: 'setAnonymousId'
  readonly anonymousId?: string
}
export interface ShoppingListSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShoppingListSetCustomerAction {
  readonly action: 'setCustomer'
  readonly customer?: CustomerResourceIdentifier
}
export interface ShoppingListSetDeleteDaysAfterLastModificationAction {
  readonly action: 'setDeleteDaysAfterLastModification'
  readonly deleteDaysAfterLastModification?: number
}
export interface ShoppingListSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface ShoppingListSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ShoppingListSetLineItemCustomFieldAction {
  readonly action: 'setLineItemCustomField'
  readonly lineItemId: string
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetLineItemCustomTypeAction {
  readonly action: 'setLineItemCustomType'
  readonly lineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShoppingListSetSlugAction {
  readonly action: 'setSlug'
  readonly slug?: LocalizedString
}
export interface ShoppingListSetStoreAction {
  readonly action: 'setStore'
  readonly store?: StoreResourceIdentifier
}
export interface ShoppingListSetTextLineItemCustomFieldAction {
  readonly action: 'setTextLineItemCustomField'
  readonly textLineItemId: string
  readonly name: string
  readonly value?: any
}
export interface ShoppingListSetTextLineItemCustomTypeAction {
  readonly action: 'setTextLineItemCustomType'
  readonly textLineItemId: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShoppingListSetTextLineItemDescriptionAction {
  readonly action: 'setTextLineItemDescription'
  readonly textLineItemId: string
  readonly description?: LocalizedString
}
//# sourceMappingURL=shopping-list.d.ts.map
