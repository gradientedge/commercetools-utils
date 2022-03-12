import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString } from './common'
export interface CustomFieldEnumValue {
  readonly key: string
  readonly label: string
}
export interface CustomFieldLocalizedEnumValue {
  readonly key: string
  readonly label: LocalizedString
}
export declare type CustomFieldReferenceValue =
  | 'cart'
  | 'category'
  | 'channel'
  | 'customer'
  | 'key-value-document'
  | 'order'
  | 'product'
  | 'product-type'
  | 'review'
  | 'shipping-method'
  | 'state'
  | 'zone'
export interface CustomFields {
  readonly type: TypeReference
  readonly fields: FieldContainer
}
export interface CustomFieldsDraft {
  readonly type: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface FieldContainer {
  [key: string]: any
}
export interface FieldDefinition {
  readonly type: FieldType
  readonly name: string
  readonly label: LocalizedString
  readonly required: boolean
  readonly inputHint?: TypeTextInputHint
}
export declare type FieldType =
  | CustomFieldBooleanType
  | CustomFieldDateTimeType
  | CustomFieldDateType
  | CustomFieldEnumType
  | CustomFieldLocalizedEnumType
  | CustomFieldLocalizedStringType
  | CustomFieldMoneyType
  | CustomFieldNumberType
  | CustomFieldReferenceType
  | CustomFieldSetType
  | CustomFieldStringType
  | CustomFieldTimeType
export interface CustomFieldBooleanType {
  readonly name: 'Boolean'
}
export interface CustomFieldDateTimeType {
  readonly name: 'DateTime'
}
export interface CustomFieldDateType {
  readonly name: 'Date'
}
export interface CustomFieldEnumType {
  readonly name: 'Enum'
  readonly values: CustomFieldEnumValue[]
}
export interface CustomFieldLocalizedEnumType {
  readonly name: 'LocalizedEnum'
  readonly values: CustomFieldLocalizedEnumValue[]
}
export interface CustomFieldLocalizedStringType {
  readonly name: 'LocalizedString'
}
export interface CustomFieldMoneyType {
  readonly name: 'Money'
}
export interface CustomFieldNumberType {
  readonly name: 'Number'
}
export interface CustomFieldReferenceType {
  readonly name: 'Reference'
  readonly referenceTypeId: CustomFieldReferenceValue
}
export interface CustomFieldSetType {
  readonly name: 'Set'
  readonly elementType: FieldType
}
export interface CustomFieldStringType {
  readonly name: 'String'
}
export interface CustomFieldTimeType {
  readonly name: 'Time'
}
export declare type ResourceTypeId =
  | 'address'
  | 'asset'
  | 'cart-discount'
  | 'category'
  | 'channel'
  | 'custom-line-item'
  | 'customer'
  | 'customer-group'
  | 'discount-code'
  | 'inventory-entry'
  | 'line-item'
  | 'order'
  | 'order-delivery'
  | 'order-edit'
  | 'payment'
  | 'payment-interface-interaction'
  | 'product-price'
  | 'product-selection'
  | 'review'
  | 'shipping-method'
  | 'shopping-list'
  | 'shopping-list-text-line-item'
  | 'store'
  | 'transaction'
export interface Type extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key: string
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly resourceTypeIds: ResourceTypeId[]
  readonly fieldDefinitions: FieldDefinition[]
}
export interface TypeDraft {
  readonly key: string
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly resourceTypeIds: ResourceTypeId[]
  readonly fieldDefinitions?: FieldDefinition[]
}
export interface TypePagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: Type[]
}
export interface TypeReference {
  readonly typeId: 'type'
  readonly id: string
  readonly obj?: Type
}
export interface TypeResourceIdentifier {
  readonly typeId: 'type'
  readonly id?: string
  readonly key?: string
}
export declare type TypeTextInputHint = 'MultiLine' | 'SingleLine'
export interface TypeUpdate {
  readonly version: number
  readonly actions: TypeUpdateAction[]
}
export declare type TypeUpdateAction =
  | TypeAddEnumValueAction
  | TypeAddFieldDefinitionAction
  | TypeAddLocalizedEnumValueAction
  | TypeChangeEnumValueLabelAction
  | TypeChangeEnumValueOrderAction
  | TypeChangeFieldDefinitionLabelAction
  | TypeChangeFieldDefinitionOrderAction
  | TypeChangeInputHintAction
  | TypeChangeKeyAction
  | TypeChangeLabelAction
  | TypeChangeLocalizedEnumValueLabelAction
  | TypeChangeLocalizedEnumValueOrderAction
  | TypeChangeNameAction
  | TypeRemoveFieldDefinitionAction
  | TypeSetDescriptionAction
export interface TypeAddEnumValueAction {
  readonly action: 'addEnumValue'
  readonly fieldName: string
  readonly value: CustomFieldEnumValue
}
export interface TypeAddFieldDefinitionAction {
  readonly action: 'addFieldDefinition'
  readonly fieldDefinition: FieldDefinition
}
export interface TypeAddLocalizedEnumValueAction {
  readonly action: 'addLocalizedEnumValue'
  readonly fieldName: string
  readonly value: CustomFieldLocalizedEnumValue
}
export interface TypeChangeEnumValueLabelAction {
  readonly action: 'changeEnumValueLabel'
  readonly fieldName: string
  readonly value: CustomFieldEnumValue
}
export interface TypeChangeEnumValueOrderAction {
  readonly action: 'changeEnumValueOrder'
  readonly fieldName: string
  readonly keys: string[]
}
export interface TypeChangeFieldDefinitionLabelAction {
  readonly action: 'changeFieldDefinitionLabel'
  readonly fieldName: string
  readonly label: LocalizedString
}
export interface TypeChangeFieldDefinitionOrderAction {
  readonly action: 'changeFieldDefinitionOrder'
  readonly fieldNames: string[]
}
export interface TypeChangeInputHintAction {
  readonly action: 'changeInputHint'
  readonly fieldName: string
  readonly inputHint: TypeTextInputHint
}
export interface TypeChangeKeyAction {
  readonly action: 'changeKey'
  readonly key: string
}
export interface TypeChangeLabelAction {
  readonly action: 'changeLabel'
  readonly fieldName: string
  readonly label: LocalizedString
}
export interface TypeChangeLocalizedEnumValueLabelAction {
  readonly action: 'changeLocalizedEnumValueLabel'
  readonly fieldName: string
  readonly value: CustomFieldLocalizedEnumValue
}
export interface TypeChangeLocalizedEnumValueOrderAction {
  readonly action: 'changeLocalizedEnumValueOrder'
  readonly fieldName: string
  readonly keys: string[]
}
export interface TypeChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface TypeRemoveFieldDefinitionAction {
  readonly action: 'removeFieldDefinition'
  readonly fieldName: string
}
export interface TypeSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
//# sourceMappingURL=type.d.ts.map
