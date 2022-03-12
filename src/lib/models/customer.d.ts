import { Cart, CartResourceIdentifier } from './cart'
import { Address, BaseAddress, BaseResource, CreatedBy, LastModifiedBy } from './common'
import { CustomerGroupReference, CustomerGroupResourceIdentifier } from './customer-group'
import { StoreKeyReference, StoreResourceIdentifier } from './store'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export declare type AnonymousCartSignInMode = 'MergeWithExistingCustomerCart' | 'UseAsNewActiveCustomerCart'
export interface Customer extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly customerNumber?: string
  readonly email: string
  readonly password: string
  readonly firstName?: string
  readonly lastName?: string
  readonly middleName?: string
  readonly title?: string
  readonly dateOfBirth?: string
  readonly companyName?: string
  readonly vatId?: string
  readonly addresses: Address[]
  readonly defaultShippingAddressId?: string
  readonly shippingAddressIds?: string[]
  readonly defaultBillingAddressId?: string
  readonly billingAddressIds?: string[]
  readonly isEmailVerified: boolean
  readonly externalId?: string
  readonly customerGroup?: CustomerGroupReference
  readonly custom?: CustomFields
  readonly locale?: string
  readonly salutation?: string
  readonly key?: string
  readonly stores?: StoreKeyReference[]
}
export interface CustomerChangePassword {
  readonly id: string
  readonly version: number
  readonly currentPassword: string
  readonly newPassword: string
}
export interface CustomerCreateEmailToken {
  readonly id: string
  readonly version?: number
  readonly ttlMinutes: number
}
export interface CustomerCreatePasswordResetToken {
  readonly email: string
  readonly ttlMinutes?: number
}
export interface CustomerDraft {
  readonly customerNumber?: string
  readonly email: string
  readonly password: string
  readonly firstName?: string
  readonly lastName?: string
  readonly middleName?: string
  readonly title?: string
  readonly anonymousCartId?: string
  readonly anonymousCart?: CartResourceIdentifier
  readonly anonymousId?: string
  readonly dateOfBirth?: string
  readonly companyName?: string
  readonly vatId?: string
  readonly addresses?: BaseAddress[]
  readonly defaultShippingAddress?: number
  readonly shippingAddresses?: number[]
  readonly defaultBillingAddress?: number
  readonly billingAddresses?: number[]
  readonly isEmailVerified?: boolean
  readonly externalId?: string
  readonly customerGroup?: CustomerGroupResourceIdentifier
  readonly custom?: CustomFieldsDraft
  readonly locale?: string
  readonly salutation?: string
  readonly key?: string
  readonly stores?: StoreResourceIdentifier[]
}
export interface CustomerEmailVerify {
  readonly version?: number
  readonly tokenValue: string
}
export interface CustomerPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Customer[]
}
export interface CustomerReference {
  readonly typeId: 'customer'
  readonly id: string
  readonly obj?: Customer
}
export interface CustomerResetPassword {
  readonly tokenValue: string
  readonly newPassword: string
  readonly version?: number
}
export interface CustomerResourceIdentifier {
  readonly typeId: 'customer'
  readonly id?: string
  readonly key?: string
}
export interface CustomerSignInResult {
  readonly customer: Customer
  readonly cart?: Cart
}
export interface CustomerSignin {
  readonly email: string
  readonly password: string
  readonly anonymousCartId?: string
  readonly anonymousCart?: CartResourceIdentifier
  readonly anonymousCartSignInMode?: AnonymousCartSignInMode
  readonly anonymousId?: string
  readonly updateProductData?: boolean
}
export interface CustomerToken {
  readonly id: string
  readonly createdAt: string
  readonly lastModifiedAt?: string
  readonly customerId: string
  readonly expiresAt: string
  readonly value: string
}
export interface CustomerUpdate {
  readonly version: number
  readonly actions: CustomerUpdateAction[]
}
export declare type CustomerUpdateAction =
  | CustomerAddAddressAction
  | CustomerAddBillingAddressIdAction
  | CustomerAddShippingAddressIdAction
  | CustomerAddStoreAction
  | CustomerChangeAddressAction
  | CustomerChangeEmailAction
  | CustomerRemoveAddressAction
  | CustomerRemoveBillingAddressIdAction
  | CustomerRemoveShippingAddressIdAction
  | CustomerRemoveStoreAction
  | CustomerSetAddressCustomFieldAction
  | CustomerSetAddressCustomTypeAction
  | CustomerSetCompanyNameAction
  | CustomerSetCustomFieldAction
  | CustomerSetCustomTypeAction
  | CustomerSetCustomerGroupAction
  | CustomerSetCustomerNumberAction
  | CustomerSetDateOfBirthAction
  | CustomerSetDefaultBillingAddressAction
  | CustomerSetDefaultShippingAddressAction
  | CustomerSetExternalIdAction
  | CustomerSetFirstNameAction
  | CustomerSetKeyAction
  | CustomerSetLastNameAction
  | CustomerSetLocaleAction
  | CustomerSetMiddleNameAction
  | CustomerSetSalutationAction
  | CustomerSetStoresAction
  | CustomerSetTitleAction
  | CustomerSetVatIdAction
export interface MyCustomerChangePassword {
  readonly version: number
  readonly currentPassword: string
  readonly newPassword: string
}
export interface MyCustomerResetPassword {
  readonly tokenValue: string
  readonly newPassword: string
}
export interface CustomerAddAddressAction {
  readonly action: 'addAddress'
  readonly address: BaseAddress
}
export interface CustomerAddBillingAddressIdAction {
  readonly action: 'addBillingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerAddShippingAddressIdAction {
  readonly action: 'addShippingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerAddStoreAction {
  readonly action: 'addStore'
  readonly store: StoreResourceIdentifier
}
export interface CustomerChangeAddressAction {
  readonly action: 'changeAddress'
  readonly addressId?: string
  readonly addressKey?: string
  readonly address: BaseAddress
}
export interface CustomerChangeEmailAction {
  readonly action: 'changeEmail'
  readonly email: string
}
export interface CustomerRemoveAddressAction {
  readonly action: 'removeAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerRemoveBillingAddressIdAction {
  readonly action: 'removeBillingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerRemoveShippingAddressIdAction {
  readonly action: 'removeShippingAddressId'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerRemoveStoreAction {
  readonly action: 'removeStore'
  readonly store: StoreResourceIdentifier
}
export interface CustomerSetAddressCustomFieldAction {
  readonly action: 'setAddressCustomField'
  readonly addressId: string
  readonly name: string
  readonly value?: any
}
export interface CustomerSetAddressCustomTypeAction {
  readonly action: 'setAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
  readonly addressId: string
}
export interface CustomerSetCompanyNameAction {
  readonly action: 'setCompanyName'
  readonly companyName?: string
}
export interface CustomerSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CustomerSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CustomerSetCustomerGroupAction {
  readonly action: 'setCustomerGroup'
  readonly customerGroup?: CustomerGroupResourceIdentifier
}
export interface CustomerSetCustomerNumberAction {
  readonly action: 'setCustomerNumber'
  readonly customerNumber?: string
}
export interface CustomerSetDateOfBirthAction {
  readonly action: 'setDateOfBirth'
  readonly dateOfBirth?: string
}
export interface CustomerSetDefaultBillingAddressAction {
  readonly action: 'setDefaultBillingAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerSetDefaultShippingAddressAction {
  readonly action: 'setDefaultShippingAddress'
  readonly addressId?: string
  readonly addressKey?: string
}
export interface CustomerSetExternalIdAction {
  readonly action: 'setExternalId'
  readonly externalId?: string
}
export interface CustomerSetFirstNameAction {
  readonly action: 'setFirstName'
  readonly firstName?: string
}
export interface CustomerSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface CustomerSetLastNameAction {
  readonly action: 'setLastName'
  readonly lastName?: string
}
export interface CustomerSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface CustomerSetMiddleNameAction {
  readonly action: 'setMiddleName'
  readonly middleName?: string
}
export interface CustomerSetSalutationAction {
  readonly action: 'setSalutation'
  readonly salutation?: string
}
export interface CustomerSetStoresAction {
  readonly action: 'setStores'
  readonly stores?: StoreResourceIdentifier[]
}
export interface CustomerSetTitleAction {
  readonly action: 'setTitle'
  readonly title?: string
}
export interface CustomerSetVatIdAction {
  readonly action: 'setVatId'
  readonly vatId?: string
}
//# sourceMappingURL=customer.d.ts.map
