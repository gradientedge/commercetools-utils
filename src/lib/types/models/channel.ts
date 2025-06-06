/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import {
  Address,
  BaseResource,
  CreatedBy,
  GeoJson,
  IReference,
  IResourceIdentifier,
  LastModifiedBy,
  LocalizedString,
  _BaseAddress,
} from './common.js'
import { ReviewRatingStatistics } from './review.js'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type.js'

export interface Channel extends BaseResource {
  /**
   *	Unique identifier of the Channel.
   *
   *
   */
  readonly id: string
  /**
   *	Current version of the Channel.
   *
   *
   */
  readonly version: number
  /**
   *	Date and time (UTC) the Channel was initially created.
   *
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) the Channel was last updated.
   *
   *
   */
  readonly lastModifiedAt: string
  /**
   *	IDs and references that last modified the Channel.
   *
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	IDs and references that created the Channel.
   *
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	User-defined unique identifier of the Channel.
   *
   *
   */
  readonly key: string
  /**
   *	Roles of the Channel.
   *
   *
   */
  readonly roles: ChannelRoleEnum[]
  /**
   *	Name of the Channel.
   *
   *
   */
  readonly name?: LocalizedString
  /**
   *	Description of the Channel.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Address where the Channel is located (for example, if the Channel is a physical store).
   *
   *
   */
  readonly address?: Address
  /**
   *	Statistics about the review ratings taken into account for the Channel.
   *
   *
   */
  readonly reviewRatingStatistics?: ReviewRatingStatistics
  /**
   *	Custom Fields defined for the Channel.
   *
   *
   */
  readonly custom?: CustomFields
  /**
   *	GeoJSON geometry object encoding the geo location of the Channel.
   *
   *
   */
  readonly geoLocation?: GeoJson
}
export interface ChannelDraft {
  /**
   *	User-defined unique identifier for the Channel.
   *
   *
   */
  readonly key: string
  /**
   *	Roles of the Channel.
   *	Each channel must have at least one role.
   *	If not specified, then `InventorySupply` is assigned by default.
   *
   *
   */
  readonly roles?: ChannelRoleEnum[]
  /**
   *	Name of the Channel.
   *
   *
   */
  readonly name?: LocalizedString
  /**
   *	Description of the Channel.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Address where the Channel is located.
   *
   *
   */
  readonly address?: _BaseAddress
  /**
   *	Custom fields defined for the Channel.
   *
   *
   */
  readonly custom?: CustomFieldsDraft
  /**
   *	GeoJSON geometry object encoding the geo location of the Channel.
   *	Currently, only the [Point](ctp:api:type:GeoJsonPoint) type is supported.
   *
   *
   */
  readonly geoLocation?: GeoJson
}
/**
 *	[PagedQueryResult](/../api/general-concepts#pagedqueryresult) with results containing an array of [Channel](ctp:api:type:Channel).
 *
 */
export interface ChannelPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Number of [elements skipped](/../api/general-concepts#offset).
   *
   *
   */
  readonly offset: number
  /**
   *	Actual number of results returned.
   *
   *
   */
  readonly count: number
  /**
   *	Total number of results matching the query.
   *	This number is an estimation that is not [strongly consistent](/../api/general-concepts#strong-consistency).
   *	This field is returned by default.
   *	For improved performance, calculating this field can be deactivated by using the query parameter `withTotal=false`.
   *	When the results are filtered with a [Query Predicate](/../api/predicates/query), `total` is subject to a [limit](/../api/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	[Channels](ctp:api:type:Channel) matching the query.
   *
   *
   */
  readonly results: Channel[]
}
/**
 *	[Reference](ctp:api:type:Reference) to a [Channel](ctp:api:type:Channel).
 *
 */
export interface ChannelReference extends IReference {
  readonly typeId: 'channel'
  /**
   *	Unique identifier of the referenced [Channel](ctp:api:type:Channel).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded Channel.
   *	Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for Channels.
   *
   *
   */
  readonly obj?: Channel
}
/**
 *	[ResourceIdentifier](ctp:api:type:ResourceIdentifier) to a [Channel](ctp:api:type:Channel). Either `id` or `key` is required. If both are set, an [InvalidJsonInput](/../api/errors#invalidjsoninput) error is returned.
 *
 */
export interface ChannelResourceIdentifier extends IResourceIdentifier {
  readonly typeId: 'channel'
  /**
   *	Unique identifier of the referenced [Channel](ctp:api:type:Channel). Required if `key` is absent.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced [Channel](ctp:api:type:Channel). Required if `id` is absent.
   *
   *
   */
  readonly key?: string
}
/**
 *	Describes the purpose and type of the Channel. A Channel can have one or more roles.
 *
 */
export enum ChannelRoleEnumValues {
  InventorySupply = 'InventorySupply',
  OrderExport = 'OrderExport',
  OrderImport = 'OrderImport',
  Primary = 'Primary',
  ProductDistribution = 'ProductDistribution',
}

export type ChannelRoleEnum =
  | 'InventorySupply'
  | 'OrderExport'
  | 'OrderImport'
  | 'Primary'
  | 'ProductDistribution'
  | (string & {})
export interface ChannelUpdate {
  /**
   *	Expected version of the Channel on which the changes should be applied.
   *	If the expected version does not match the actual version, a [ConcurrentModification](ctp:api:type:ConcurrentModificationError) error will be returned.
   *
   *
   */
  readonly version: number
  /**
   *	Update actions to be performed on the Channel.
   *
   *
   */
  readonly actions: ChannelUpdateAction[]
}
export type ChannelUpdateAction =
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
export interface IChannelUpdateAction {
  /**
   *
   */
  readonly action: string
}
export interface ChannelAddRolesAction extends IChannelUpdateAction {
  readonly action: 'addRoles'
  /**
   *	Value to append to the array.
   *
   *
   */
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelChangeDescriptionAction extends IChannelUpdateAction {
  readonly action: 'changeDescription'
  /**
   *	New value to set. Must not be empty.
   *
   *
   */
  readonly description: LocalizedString
}
export interface ChannelChangeKeyAction extends IChannelUpdateAction {
  readonly action: 'changeKey'
  /**
   *	New value to set. Must not be empty.
   *
   *
   */
  readonly key: string
}
export interface ChannelChangeNameAction extends IChannelUpdateAction {
  readonly action: 'changeName'
  /**
   *	New value to set. Must not be empty.
   *
   *
   */
  readonly name: LocalizedString
}
export interface ChannelRemoveRolesAction extends IChannelUpdateAction {
  readonly action: 'removeRoles'
  /**
   *	Value to remove from the array.
   *
   *
   */
  readonly roles: ChannelRoleEnum[]
}
export interface ChannelSetAddressAction extends IChannelUpdateAction {
  readonly action: 'setAddress'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly address?: _BaseAddress
}
export interface ChannelSetAddressCustomFieldAction extends IChannelUpdateAction {
  readonly action: 'setAddressCustomField'
  /**
   *	Name of the [Custom Field](/../api/projects/custom-fields).
   *
   *
   */
  readonly name: string
  /**
   *	Specifies the format of the value of the Custom Field defined by `name`.
   *	If `value` is absent or `null`, this field will be removed, if it exists.
   *	Removing a field that does not exist returns an [InvalidOperation](ctp:api:type:InvalidOperationError) error.
   *
   *
   */
  readonly value?: any
}
export interface ChannelSetAddressCustomTypeAction extends IChannelUpdateAction {
  readonly action: 'setAddressCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the `address` with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the `address`.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the `address`.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface ChannelSetCustomFieldAction extends IChannelUpdateAction {
  readonly action: 'setCustomField'
  /**
   *	Name of the [Custom Field](/../api/projects/custom-fields).
   *
   *
   */
  readonly name: string
  /**
   *	If `value` is absent or `null`, this field will be removed if it exists.
   *	Removing a field that does not exist returns an [InvalidOperation](ctp:api:type:InvalidOperationError) error.
   *	If `value` is provided, it is set for the field defined by `name`.
   *
   *
   */
  readonly value?: any
}
export interface ChannelSetCustomTypeAction extends IChannelUpdateAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the Channel with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the Channel.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the Channel.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface ChannelSetGeoLocationAction extends IChannelUpdateAction {
  readonly action: 'setGeoLocation'
  /**
   *	Value to set.
   *
   *
   */
  readonly geoLocation?: GeoJson
}
export interface ChannelSetRolesAction extends IChannelUpdateAction {
  readonly action: 'setRoles'
  /**
   *	Value to set. If not specified, then `InventorySupply` is assigned by default.
   *
   *
   */
  readonly roles: ChannelRoleEnum[]
}
