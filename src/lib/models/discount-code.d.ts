import { CartDiscountReference, CartDiscountResourceIdentifier } from './cart-discount'
import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString, Reference } from './common'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface DiscountCode extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  readonly code: string
  readonly cartDiscounts: CartDiscountReference[]
  readonly cartPredicate?: string
  readonly isActive: boolean
  readonly references: Reference[]
  readonly maxApplications?: number
  readonly maxApplicationsPerCustomer?: number
  readonly custom?: CustomFields
  readonly groups: string[]
  readonly validFrom?: string
  readonly validUntil?: string
  readonly applicationVersion?: number
}
export interface DiscountCodeDraft {
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  readonly code: string
  readonly cartDiscounts: CartDiscountResourceIdentifier[]
  readonly cartPredicate?: string
  readonly isActive?: boolean
  readonly maxApplications?: number
  readonly maxApplicationsPerCustomer?: number
  readonly custom?: CustomFieldsDraft
  readonly groups?: string[]
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface DiscountCodePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: DiscountCode[]
}
export interface DiscountCodeReference {
  readonly typeId: 'discount-code'
  readonly id: string
  readonly obj?: DiscountCode
}
export interface DiscountCodeResourceIdentifier {
  readonly typeId: 'discount-code'
  readonly id?: string
  readonly key?: string
}
export interface DiscountCodeUpdate {
  readonly version: number
  readonly actions: DiscountCodeUpdateAction[]
}
export declare type DiscountCodeUpdateAction =
  | DiscountCodeChangeCartDiscountsAction
  | DiscountCodeChangeGroupsAction
  | DiscountCodeChangeIsActiveAction
  | DiscountCodeSetCartPredicateAction
  | DiscountCodeSetCustomFieldAction
  | DiscountCodeSetCustomTypeAction
  | DiscountCodeSetDescriptionAction
  | DiscountCodeSetMaxApplicationsAction
  | DiscountCodeSetMaxApplicationsPerCustomerAction
  | DiscountCodeSetNameAction
  | DiscountCodeSetValidFromAction
  | DiscountCodeSetValidFromAndUntilAction
  | DiscountCodeSetValidUntilAction
export interface DiscountCodeChangeCartDiscountsAction {
  readonly action: 'changeCartDiscounts'
  readonly cartDiscounts: CartDiscountResourceIdentifier[]
}
export interface DiscountCodeChangeGroupsAction {
  readonly action: 'changeGroups'
  readonly groups: string[]
}
export interface DiscountCodeChangeIsActiveAction {
  readonly action: 'changeIsActive'
  readonly isActive: boolean
}
export interface DiscountCodeSetCartPredicateAction {
  readonly action: 'setCartPredicate'
  readonly cartPredicate?: string
}
export interface DiscountCodeSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface DiscountCodeSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface DiscountCodeSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface DiscountCodeSetMaxApplicationsAction {
  readonly action: 'setMaxApplications'
  readonly maxApplications?: number
}
export interface DiscountCodeSetMaxApplicationsPerCustomerAction {
  readonly action: 'setMaxApplicationsPerCustomer'
  readonly maxApplicationsPerCustomer?: number
}
export interface DiscountCodeSetNameAction {
  readonly action: 'setName'
  readonly name?: LocalizedString
}
export interface DiscountCodeSetValidFromAction {
  readonly action: 'setValidFrom'
  readonly validFrom?: string
}
export interface DiscountCodeSetValidFromAndUntilAction {
  readonly action: 'setValidFromAndUntil'
  readonly validFrom?: string
  readonly validUntil?: string
}
export interface DiscountCodeSetValidUntilAction {
  readonly action: 'setValidUntil'
  readonly validUntil?: string
}
//# sourceMappingURL=discount-code.d.ts.map
