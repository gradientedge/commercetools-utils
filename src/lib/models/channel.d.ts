import { Address, BaseAddress, BaseResource, CreatedBy, GeoJson, LastModifiedBy, LocalizedString } from './common'
import { ReviewRatingStatistics } from './review'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface Channel extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key: string
  readonly roles: ChannelRoleEnum[]
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  readonly address?: Address
  readonly reviewRatingStatistics?: ReviewRatingStatistics
  readonly custom?: CustomFields
  readonly geoLocation?: GeoJson
}
export interface ChannelDraft {
  readonly key: string
  readonly roles?: ChannelRoleEnum[]
  readonly name?: LocalizedString
  readonly description?: LocalizedString
  readonly address?: BaseAddress
  readonly custom?: CustomFieldsDraft
  readonly geoLocation?: GeoJson
}
export interface ChannelPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: Channel[]
}
export interface ChannelReference {
  readonly typeId: 'channel'
  readonly id: string
  readonly obj?: Channel
}
export interface ChannelResourceIdentifier {
  readonly typeId: 'channel'
  readonly id?: string
  readonly key?: string
}
export declare type ChannelRoleEnum =
  | 'InventorySupply'
  | 'OrderExport'
  | 'OrderImport'
  | 'Primary'
  | 'ProductDistribution'
export interface ChannelUpdate {
  readonly version: number
  readonly actions: ChannelUpdateAction[]
}
export declare type ChannelUpdateAction =
  | ChannelAddRolesAction
  | ChannelChangeDescriptionAction
  | ChannelChangeKeyAction
  | ChannelChangeNameAction
  | ChannelRemoveRolesAction
  | ChannelSetAddressAction
  | ChannelSetAddressCustomFieldAction
  | ChannelSetAddressCustomTypeAction
  | ChannelSetCustomFieldAction
  | ChannelSetCustomTypeAction
  | ChannelSetGeoLocationAction
  | ChannelSetRolesAction
export interface ChannelAddRolesAction {
  readonly action: 'addRoles'
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelChangeDescriptionAction {
  readonly action: 'changeDescription'
  readonly description: LocalizedString
}
export interface ChannelChangeKeyAction {
  readonly action: 'changeKey'
  readonly key: string
}
export interface ChannelChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface ChannelRemoveRolesAction {
  readonly action: 'removeRoles'
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelSetAddressAction {
  readonly action: 'setAddress'
  readonly address?: BaseAddress
}
export interface ChannelSetAddressCustomFieldAction {
  readonly action: 'setAddressCustomField'
  readonly name: string
  readonly value?: any
}
export interface ChannelSetAddressCustomTypeAction {
  readonly action: 'setAddressCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ChannelSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ChannelSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ChannelSetGeoLocationAction {
  readonly action: 'setGeoLocation'
  readonly geoLocation?: GeoJson
}
export interface ChannelSetRolesAction {
  readonly action: 'setRoles'
  readonly roles: ChannelRoleEnum[]
}
//# sourceMappingURL=channel.d.ts.map
