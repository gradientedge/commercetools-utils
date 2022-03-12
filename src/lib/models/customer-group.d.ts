import { BaseResource, CreatedBy, LastModifiedBy } from './common'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface CustomerGroup extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly name: string
  readonly custom?: CustomFields
}
export interface CustomerGroupDraft {
  readonly key?: string
  readonly groupName: string
  readonly custom?: CustomFieldsDraft
}
export interface CustomerGroupPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: CustomerGroup[]
}
export interface CustomerGroupReference {
  readonly typeId: 'customer-group'
  readonly id: string
  readonly obj?: CustomerGroup
}
export interface CustomerGroupResourceIdentifier {
  readonly typeId: 'customer-group'
  readonly id?: string
  readonly key?: string
}
export interface CustomerGroupUpdate {
  readonly version: number
  readonly actions: CustomerGroupUpdateAction[]
}
export declare type CustomerGroupUpdateAction =
  | CustomerGroupChangeNameAction
  | CustomerGroupSetCustomFieldAction
  | CustomerGroupSetCustomTypeAction
  | CustomerGroupSetKeyAction
export interface CustomerGroupChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface CustomerGroupSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CustomerGroupSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CustomerGroupSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
//# sourceMappingURL=customer-group.d.ts.map
