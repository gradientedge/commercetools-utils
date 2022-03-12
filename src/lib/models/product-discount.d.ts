import {
  BaseResource,
  CreatedBy,
  LastModifiedBy,
  LocalizedString,
  Money,
  QueryPrice,
  Reference,
  TypedMoney,
} from './common'
export interface ProductDiscount extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly name: LocalizedString
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: ProductDiscountValue
  readonly predicate: string
  readonly sortOrder: string
  readonly isActive: boolean
  readonly references: Reference[]
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface ProductDiscountDraft {
  readonly name: LocalizedString
  readonly key?: string
  readonly description?: LocalizedString
  readonly value: ProductDiscountValueDraft
  readonly predicate: string
  readonly sortOrder: string
  readonly isActive: boolean
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface ProductDiscountMatchQuery {
  readonly productId: string
  readonly variantId: number
  readonly staged: boolean
  readonly price: QueryPrice
}
export interface ProductDiscountPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductDiscount[]
}
export interface ProductDiscountReference {
  readonly typeId: 'product-discount'
  readonly id: string
  readonly obj?: ProductDiscount
}
export interface ProductDiscountResourceIdentifier {
  readonly typeId: 'product-discount'
  readonly id?: string
  readonly key?: string
}
export interface ProductDiscountUpdate {
  readonly version: number
  readonly actions: ProductDiscountUpdateAction[]
}
export declare type ProductDiscountUpdateAction =
  | ProductDiscountChangeIsActiveAction
  | ProductDiscountChangeNameAction
  | ProductDiscountChangePredicateAction
  | ProductDiscountChangeSortOrderAction
  | ProductDiscountChangeValueAction
  | ProductDiscountSetDescriptionAction
  | ProductDiscountSetKeyAction
  | ProductDiscountSetValidFromAction
  | ProductDiscountSetValidFromAndUntilAction
  | ProductDiscountSetValidUntilAction
export declare type ProductDiscountValue =
  | ProductDiscountValueAbsolute
  | ProductDiscountValueExternal
  | ProductDiscountValueRelative
export interface ProductDiscountValueAbsolute {
  readonly type: 'absolute'
  readonly money: TypedMoney[]
}
export declare type ProductDiscountValueDraft =
  | ProductDiscountValueAbsoluteDraft
  | ProductDiscountValueExternalDraft
  | ProductDiscountValueRelativeDraft
export interface ProductDiscountValueAbsoluteDraft {
  readonly type: 'absolute'
  readonly money: Money[]
}
export interface ProductDiscountValueExternal {
  readonly type: 'external'
}
export interface ProductDiscountValueExternalDraft {
  readonly type: 'external'
}
export interface ProductDiscountValueRelative {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface ProductDiscountValueRelativeDraft {
  readonly type: 'relative'
  readonly permyriad: number
}
export interface ProductDiscountChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface ProductDiscountChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ProductDiscountChangePredicateAction {
  readonly action: 'changePredicate'
  readonly predicate: string
}
export interface ProductDiscountChangeSortOrderAction {
  readonly action: 'changeSortOrder'
  readonly sortOrder: string
}
export interface ProductDiscountChangeValueAction {
  readonly action: 'changeValue'
  readonly value: ProductDiscountValueDraft
}
export interface ProductDiscountSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface ProductDiscountSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ProductDiscountSetValidFromAction {
  readonly action: 'setValidFrom'
  readonly validFrom?: string
}
export interface ProductDiscountSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface ProductDiscountSetValidUntilAction {
  readonly action: 'setValidUntil'
  readonly validUntil?: string
}
//# sourceMappingURL=product-discount.d.ts.map
