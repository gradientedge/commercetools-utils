/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import {
  Asset,
  AssetDraft,
  AssetSource,
  BaseResource,
  CreatedBy,
  IReference,
  IResourceIdentifier,
  LastModifiedBy,
  LocalizedString,
} from './common.js'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type.js'

export interface Category extends BaseResource {
  /**
   *	Unique identifier of the Category.
   *
   *
   */
  readonly id: string
  /**
   *	Current version of the Category.
   *
   *
   */
  readonly version: number
  /**
   *	Date and time (UTC) the Category was initially created.
   *
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) the Category was last updated.
   *
   *
   */
  readonly lastModifiedAt: string
  /**
   *	IDs and references that last modified the Category.
   *
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	IDs and references that created the Category.
   *
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	Name of the Category.
   *
   *
   */
  readonly name: LocalizedString
  /**
   *	User-defined identifier used as a deep-link URL to the related Category per [Locale](ctp:api:type:Locale).
   *	A Category can have the same slug for different Locales, but they are unique across the [Project](ctp:api:type:Project).
   *	Valid slugs match the pattern `^[A-Za-z0-9_-]{2,256}+$`.
   *	For [good performance](/../api/predicates/query#performance-considerations), indexes are provided for the first 15 `languages` set in a Project.
   *
   *
   */
  readonly slug: LocalizedString
  /**
   *	Description of the Category.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Contains the parent path towards the root Category.
   *
   *
   */
  readonly ancestors: CategoryReference[]
  /**
   *	Parent Category of this Category.
   *
   *
   */
  readonly parent?: CategoryReference
  /**
   *	Decimal value between 0 and 1. Frontend applications can use this value for ordering Categories within the same level in the category tree.
   *
   *
   */
  readonly orderHint: string
  /**
   *	Additional identifier for external systems like customer relationship management (CRM) or enterprise resource planning (ERP).
   *
   *
   */
  readonly externalId?: string
  /**
   *	Name of the Category used by external search engines for improved search engine performance.
   *
   *
   */
  readonly metaTitle?: LocalizedString
  /**
   *	Description of the Category used by external search engines for improved search engine performance.
   *
   *
   */
  readonly metaDescription?: LocalizedString
  /**
   *	Keywords related to the Category for improved search engine performance.
   *
   *
   */
  readonly metaKeywords?: LocalizedString
  /**
   *	Custom Fields for the Category.
   *
   *
   */
  readonly custom?: CustomFields
  /**
   *	Media related to the Category.
   *
   *
   */
  readonly assets?: Asset[]
  /**
   *	User-defined unique identifier of the Category.
   *
   *
   */
  readonly key?: string
}
export interface CategoryDraft {
  /**
   *	Name of the Category.
   *
   *
   */
  readonly name: LocalizedString
  /**
   *	User-defined identifier used as a deep-link URL to the related Category.
   *	A Category can have the same slug for different [Locales](ctp:api:type:Locale), but it must be unique across the [Project](ctp:api:type:Project).
   *	Valid slugs must match the pattern `^[A-Za-z0-9_-]{2,256}+$`.
   *
   *
   */
  readonly slug: LocalizedString
  /**
   *	Description of the Category.
   *
   *
   */
  readonly description?: LocalizedString
  /**
   *	Parent Category of the Category.
   *	The parent can be set by its `id` or `key`.
   *
   *
   */
  readonly parent?: CategoryResourceIdentifier
  /**
   *	Decimal value between 0 and 1. Frontend applications can use this value for ordering Categories within the same level in the category tree.
   *	If not set, a random value will be assigned.
   *
   *
   */
  readonly orderHint?: string
  /**
   *	Additional identifier for external systems like customer relationship management (CRM) or enterprise resource planning (ERP).
   *
   *
   */
  readonly externalId?: string
  /**
   *	Name of the Category used by external search engines for improved search engine performance.
   *
   *
   */
  readonly metaTitle?: LocalizedString
  /**
   *	Description of the Category used by external search engines for improved search engine performance.
   *
   *
   */
  readonly metaDescription?: LocalizedString
  /**
   *	Keywords related to the Category for improved search engine performance.
   *
   *
   */
  readonly metaKeywords?: LocalizedString
  /**
   *	Custom Fields for the Category.
   *
   *
   */
  readonly custom?: CustomFieldsDraft
  /**
   *	Media related to the Category.
   *
   *
   */
  readonly assets?: AssetDraft[]
  /**
   *	User-defined unique identifier for the Category.
   *
   *	This field is optional for backwards compatibility reasons, but we strongly recommend setting it. Keys are mandatory for importing Categories with the [Import API](/../api/import-export/overview) and the [Merchant Center](/../merchant-center/import-data).
   *
   *
   */
  readonly key?: string
}
/**
 *	[PagedQueryResult](/../api/general-concepts#pagedqueryresult) with results containing an array of [Category](ctp:api:type:Category).
 *
 */
export interface CategoryPagedQueryResponse {
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
   *	[Category](ctp:api:type:Category) matching the query.
   *
   *
   */
  readonly results: Category[]
}
/**
 *	[Reference](ctp:api:type:Reference) to a [Category](ctp:api:type:Category).
 *
 */
export interface CategoryReference extends IReference {
  readonly typeId: 'category'
  /**
   *	Unique identifier of the referenced [Category](ctp:api:type:Category).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded Category. Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for Categories.
   *
   *
   */
  readonly obj?: Category
}
/**
 *	[ResourceIdentifier](ctp:api:type:ResourceIdentifier) to a [Category](ctp:api:type:Category). Either `id` or `key` is required. If both are set, an [InvalidJsonInput](/../api/errors#invalidjsoninput) error is returned.
 *
 */
export interface CategoryResourceIdentifier extends IResourceIdentifier {
  readonly typeId: 'category'
  /**
   *	Unique identifier of the referenced [Category](ctp:api:type:Channel). Required if `key` is absent.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced [Category](ctp:api:type:Category). Required if `id` is absent.
   *
   *
   */
  readonly key?: string
}
export interface CategoryUpdate {
  /**
   *	Expected version of the Category on which the changes should be applied.
   *	If the expected version does not match the actual version, a [ConcurrentModification](ctp:api:type:ConcurrentModificationError) error will be returned.
   *
   *
   */
  readonly version: number
  /**
   *	Update actions to be performed on the Category.
   *
   *
   */
  readonly actions: CategoryUpdateAction[]
}
export type CategoryUpdateAction =
  | CategoryAddAssetAction
  | CategoryChangeAssetNameAction
  | CategoryChangeAssetOrderAction
  | CategoryChangeNameAction
  | CategoryChangeOrderHintAction
  | CategoryChangeParentAction
  | CategoryChangeSlugAction
  | CategoryRemoveAssetAction
  | CategorySetAssetCustomFieldAction
  | CategorySetAssetCustomTypeAction
  | CategorySetAssetDescriptionAction
  | CategorySetAssetKeyAction
  | CategorySetAssetSourcesAction
  | CategorySetAssetTagsAction
  | CategorySetCustomFieldAction
  | CategorySetCustomTypeAction
  | CategorySetDescriptionAction
  | CategorySetExternalIdAction
  | CategorySetKeyAction
  | CategorySetMetaDescriptionAction
  | CategorySetMetaKeywordsAction
  | CategorySetMetaTitleAction
export interface ICategoryUpdateAction {
  /**
   *
   */
  readonly action: string
}
export interface CategoryAddAssetAction extends ICategoryUpdateAction {
  readonly action: 'addAsset'
  /**
   *	Value to append.
   *
   *
   */
  readonly asset: AssetDraft
  /**
   *	Position in the array at which the Asset should be put. When specified, the value must be between `0` and the total number of Assets minus `1`.
   *
   */
  readonly position?: number
}
export interface CategoryChangeAssetNameAction extends ICategoryUpdateAction {
  readonly action: 'changeAssetName'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
  /**
   *	New value to set. Must not be empty.
   *
   *
   */
  readonly name: LocalizedString
}
/**
 *	This update action changes the order of the `assets` array. The new order is defined by listing the `id`s of the Assets.
 *
 */
export interface CategoryChangeAssetOrderAction extends ICategoryUpdateAction {
  readonly action: 'changeAssetOrder'
  /**
   *	New value to set. Must contain all Asset `id`s.
   *
   *
   */
  readonly assetOrder: string[]
}
export interface CategoryChangeNameAction extends ICategoryUpdateAction {
  readonly action: 'changeName'
  /**
   *	New value to set. Must not be empty.
   *
   *
   */
  readonly name: LocalizedString
}
export interface CategoryChangeOrderHintAction extends ICategoryUpdateAction {
  readonly action: 'changeOrderHint'
  /**
   *	New value to set. Must be a decimal value between 0 and 1.
   *
   *
   */
  readonly orderHint: string
}
export interface CategoryChangeParentAction extends ICategoryUpdateAction {
  readonly action: 'changeParent'
  /**
   *	New value to set as parent.
   *
   *
   */
  readonly parent: CategoryResourceIdentifier
}
/**
 *	Changing the slug produces the [CategorySlugChanged](ctp:api:type:CategorySlugChangedMessage) Message.
 *
 */
export interface CategoryChangeSlugAction extends ICategoryUpdateAction {
  readonly action: 'changeSlug'
  /**
   *	New value to set. Must not be empty.
   *	A Category can have the same slug for different [Locales](ctp:api:type:Locale), but it must be unique across the [Project](ctp:api:type:Project).
   *	Valid slugs must match the pattern `^[A-Za-z0-9_-]{2,256}+$`.
   *
   *
   */
  readonly slug: LocalizedString
}
export interface CategoryRemoveAssetAction extends ICategoryUpdateAction {
  readonly action: 'removeAsset'
  /**
   *	Value to remove. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	Value to remove. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
}
export interface CategorySetAssetCustomFieldAction extends ICategoryUpdateAction {
  readonly action: 'setAssetCustomField'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
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
export interface CategorySetAssetCustomTypeAction extends ICategoryUpdateAction {
  readonly action: 'setAssetCustomType'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the Asset with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the Asset.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the Asset.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface CategorySetAssetDescriptionAction extends ICategoryUpdateAction {
  readonly action: 'setAssetDescription'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly description?: LocalizedString
}
/**
 *	Set or remove the `key` of an [Asset](ctp:api:type:Asset).
 *
 */
export interface CategorySetAssetKeyAction extends ICategoryUpdateAction {
  readonly action: 'setAssetKey'
  /**
   *	Value to set.
   *
   *
   */
  readonly assetId: string
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly assetKey?: string
}
export interface CategorySetAssetSourcesAction extends ICategoryUpdateAction {
  readonly action: 'setAssetSources'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
  /**
   *	Must not be empty. At least one entry is required.
   *
   *
   */
  readonly sources: AssetSource[]
}
export interface CategorySetAssetTagsAction extends ICategoryUpdateAction {
  readonly action: 'setAssetTags'
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetId?: string
  /**
   *	New value to set. Either `assetId` or `assetKey` is required.
   *
   *
   */
  readonly assetKey?: string
  /**
   *	Keywords for categorizing and organizing Assets.
   *
   *
   */
  readonly tags?: string[]
}
export interface CategorySetCustomFieldAction extends ICategoryUpdateAction {
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
export interface CategorySetCustomTypeAction extends ICategoryUpdateAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the Category with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the Category.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the Category.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface CategorySetDescriptionAction extends ICategoryUpdateAction {
  readonly action: 'setDescription'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly description?: LocalizedString
}
/**
 *	This update action sets a new ID that can be used as an additional identifier for external systems like customer relationship management (CRM) or enterprise resource planning (ERP).
 *
 */
export interface CategorySetExternalIdAction extends ICategoryUpdateAction {
  readonly action: 'setExternalId'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly externalId?: string
}
export interface CategorySetKeyAction extends ICategoryUpdateAction {
  readonly action: 'setKey'
  /**
   *	Value to set. If empty, any existing value will be removed.
   *
   *
   */
  readonly key?: string
}
export interface CategorySetMetaDescriptionAction extends ICategoryUpdateAction {
  readonly action: 'setMetaDescription'
  /**
   *	Value to set.
   *
   *
   */
  readonly metaDescription?: LocalizedString
}
export interface CategorySetMetaKeywordsAction extends ICategoryUpdateAction {
  readonly action: 'setMetaKeywords'
  /**
   *	Value to set.
   *
   *
   */
  readonly metaKeywords?: LocalizedString
}
export interface CategorySetMetaTitleAction extends ICategoryUpdateAction {
  readonly action: 'setMetaTitle'
  /**
   *	Value to set.
   *
   *
   */
  readonly metaTitle?: LocalizedString
}
