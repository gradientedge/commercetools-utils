import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString } from './common'
import { ProductReference, ProductResourceIdentifier } from './product'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface AssignedProductReference {
  readonly product: ProductReference
}
export interface AssignedProductSelection {
  readonly productSelection: ProductSelectionReference
}
export interface AssignedProductSelectionPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: AssignedProductSelection[]
}
export interface ProductSelection extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly name: LocalizedString
  readonly productCount: number
  readonly type: ProductSelectionTypeEnum
  readonly custom?: CustomFields
}
export interface ProductSelectionAssignment {
  readonly product: ProductReference
  readonly productSelection: ProductSelectionReference
}
export interface ProductSelectionDraft {
  readonly key?: string
  readonly name: LocalizedString
  readonly custom?: CustomFieldsDraft
}
export interface ProductSelectionPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: ProductSelection[]
}
export interface ProductSelectionProductPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: AssignedProductReference[]
}
export interface ProductSelectionReference {
  readonly typeId: 'product-selection'
  readonly id: string
  readonly obj?: ProductSelection
}
export interface ProductSelectionResourceIdentifier {
  readonly typeId: 'product-selection'
  readonly id?: string
  readonly key?: string
}
export declare type ProductSelectionType = IndividualProductSelectionType
export interface IndividualProductSelectionType {
  readonly type: 'individual'
  readonly name: LocalizedString
}
export declare type ProductSelectionTypeEnum = 'individual'
export interface ProductSelectionUpdate {
  readonly version: number
  readonly actions: ProductSelectionUpdateAction[]
}
export declare type ProductSelectionUpdateAction =
  | ProductSelectionAddProductAction
  | ProductSelectionChangeNameAction
  | ProductSelectionRemoveProductAction
  | ProductSelectionSetCustomFieldAction
  | ProductSelectionSetCustomTypeAction
  | ProductSelectionSetKeyAction
export interface ProductsInStorePagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: ProductSelectionAssignment[]
}
export interface ProductSelectionAddProductAction {
  readonly action: 'addProduct'
  readonly product: ProductResourceIdentifier
}
export interface ProductSelectionChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ProductSelectionRemoveProductAction {
  readonly action: 'removeProduct'
  readonly product: ProductResourceIdentifier
}
export interface ProductSelectionSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ProductSelectionSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ProductSelectionSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
//# sourceMappingURL=product-selection.d.ts.map
