/**
 * Code generated by [commercetools RMF-Codegen](https://github.com/commercetools/rmf-codegen). DO NOT EDIT.
 * Please don't change this file manually but run `rmf-codegen generate raml_file_path -o output_path -t typescript_client` to update it.
 * For more information about the commercetools platform APIs, visit https://docs.commercetools.com/.
 */

import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString } from './common'
import { ProductReference, ProductResourceIdentifier } from './product'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'

export interface AssignedProductReference {
  /**
   *	Reference to a Product that is assigned to the Product Selection.
   *
   */
  readonly product: ProductReference
}
export interface AssignedProductSelection {
  /**
   *	Reference to the Product Selection that this assignment is part of.
   *
   */
  readonly productSelection: ProductSelectionReference
}
/**
 *	[PagedQueryResult](/general-concepts#pagedqueryresult) containing an array of [AssignedProductSelection](ctp:api:type:AssignedProductSelection).
 *
 */
export interface AssignedProductSelectionPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Offset supplied by the client or the server default.
   *	It is the number of elements skipped, not a page number.
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
   *	This number is an estimation that is not [strongly consistent](/general-concepts#strong-consistency).
   *	Unlike other endpoints, the Product Selection endpoint does not return this field by default.
   *	To get `total`, pass the query parameter `withTotal` set to `true`.
   *	When the results are filtered with a [Query Predicate](/predicates/query), `total` is subject to a [limit](/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	References to Product Selection that are assigned to the Product.
   *
   */
  readonly results: AssignedProductSelection[]
}
export interface ProductSelection extends BaseResource {
  /**
   *	Platform-generated unique identifier of the Product Selection.
   *
   */
  readonly id: string
  /**
   *	Current version of the Product Selection.
   *
   */
  readonly version: number
  /**
   *	Date and time (UTC) the Product Selection was initially created.
   *
   */
  readonly createdAt: string
  /**
   *	Date and time (UTC) the Product Selection was last updated.
   *
   */
  readonly lastModifiedAt: string
  /**
   *	Present on resources updated after 1/02/2019 except for [events not tracked](/../api/client-logging#events-tracked).
   *
   */
  readonly lastModifiedBy?: LastModifiedBy
  /**
   *	Present on resources created after 1/02/2019 except for [events not tracked](/../api/client-logging#events-tracked).
   *
   */
  readonly createdBy?: CreatedBy
  /**
   *	User-defined unique identifier of the Product Selection.
   *
   */
  readonly key?: string
  /**
   *	Name of the Product Selection.
   *
   */
  readonly name: LocalizedString
  /**
   *	Number of Products that are currently assigned to this Product Selection.
   *
   */
  readonly productCount: number
  /**
   *	Specifies in which way the Products are assigned to the Product Selection. Currently, the only way of doing this is to specify each Product individually. Hence, the type is fixed to `individual` for now, but we have plans to add other types in the future.
   *
   */
  readonly type: ProductSelectionTypeEnum
  /**
   *	Custom Fields of this Product Selection.
   *
   */
  readonly custom?: CustomFields
}
/**
 *	Specifies which Product is assigned to which Product Selection.
 */
export interface ProductSelectionAssignment {
  /**
   *	Reference to a Product that is assigned to the Product Selection.
   *
   */
  readonly product: ProductReference
  /**
   *	Reference to the Product Selection that this assignment is part of.
   *
   */
  readonly productSelection: ProductSelectionReference
}
export interface ProductSelectionDraft {
  /**
   *	User-defined unique identifier for the Product Selection.
   *
   */
  readonly key?: string
  /**
   *	Name of the Product Selection. Not checked for uniqueness, but distinct names are recommended.
   *
   */
  readonly name: LocalizedString
  /**
   *	Custom Fields of this Product Selection.
   *
   */
  readonly custom?: CustomFieldsDraft
}
/**
 *	[PagedQueryResult](/general-concepts#pagedqueryresult) containing an array of [ProductSelection](ctp:api:type:ProductSelection).
 *
 */
export interface ProductSelectionPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Offset supplied by the client or the server default.
   *	It is the number of elements skipped, not a page number.
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
   *	This number is an estimation that is not [strongly consistent](/general-concepts#strong-consistency).
   *	Unlike other endpoints, the Product Selection endpoint does not return this field by default.
   *	To get `total`, pass the query parameter `withTotal` set to `true`.
   *	When the results are filtered with a [Query Predicate](/predicates/query), `total` is subject to a [limit](/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	The Product Selections matching the query.
   *
   *
   */
  readonly results: ProductSelection[]
}
/**
 *	[PagedQueryResult](/general-concepts#pagedqueryresult) containing an array of [AssignedProductReference](ctp:api:type:AssignedProductReference).
 *
 */
export interface ProductSelectionProductPagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Offset supplied by the client or the server default.
   *	It is the number of elements skipped, not a page number.
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
   *	This number is an estimation that is not [strongly consistent](/general-concepts#strong-consistency).
   *	Unlike other endpoints, the Product Selection endpoint does not return this field by default.
   *	To get `total`, pass the query parameter `withTotal` set to `true`.
   *	When the results are filtered with a [Query Predicate](/predicates/query), `total` is subject to a [limit](/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	References to Products that are assigned to the Product Selection.
   *
   */
  readonly results: AssignedProductReference[]
}
/**
 *	[Reference](/../api/types#reference) to a [ProductSelection](ctp:api:type:ProductSelection).
 *
 */
export interface ProductSelectionReference {
  readonly typeId: 'product-selection'
  /**
   *	Platform-generated unique identifier of the referenced [ProductSelection](ctp:api:type:ProductSelection).
   *
   *
   */
  readonly id: string
  /**
   *	Contains the representation of the expanded Product Selection. Only present in responses to requests with [Reference Expansion](/../api/general-concepts#reference-expansion) for Product Selections.
   *
   */
  readonly obj?: ProductSelection
}
/**
 *	[ResourceIdentifier](/../api/types#resourceidentifier) to a [ProductSelection](ctp:api:type:ProductSelection).
 *
 */
export interface ProductSelectionResourceIdentifier {
  readonly typeId: 'product-selection'
  /**
   *	Platform-generated unique identifier of the referenced [ProductSelection](ctp:api:type:ProductSelection). Either `id` or `key` is required.
   *
   *
   */
  readonly id?: string
  /**
   *	User-defined unique identifier of the referenced [ProductSelection](ctp:api:type:ProductSelection). Either `id` or `key` is required.
   *
   *
   */
  readonly key?: string
}
export type ProductSelectionType = IndividualProductSelectionType
export interface IndividualProductSelectionType {
  readonly type: 'individual'
  /**
   *	The name of the Product Selection which is recommended to be unique.
   *
   */
  readonly name: LocalizedString
}
/**
 *	The following type of Product Selections is supported:
 *
 */
export type ProductSelectionTypeEnum = 'individual'
export interface ProductSelectionUpdate {
  /**
   *
   */
  readonly version: number
  /**
   *
   */
  readonly actions: ProductSelectionUpdateAction[]
}
export type ProductSelectionUpdateAction =
  | ProductSelectionAddProductAction
  | ProductSelectionChangeNameAction
  | ProductSelectionRemoveProductAction
  | ProductSelectionSetCustomFieldAction
  | ProductSelectionSetCustomTypeAction
  | ProductSelectionSetKeyAction
/**
 *	[PagedQueryResult](/general-concepts#pagedqueryresult) containing an array of [ProductSelectionAssignment](ctp:api:type:ProductSelectionAssignment).
 *
 */
export interface ProductsInStorePagedQueryResponse {
  /**
   *	Number of [results requested](/../api/general-concepts#limit).
   *
   *
   */
  readonly limit: number
  /**
   *	Offset supplied by the client or the server default.
   *	It is the number of elements skipped, not a page number.
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
   *	This number is an estimation that is not [strongly consistent](/general-concepts#strong-consistency).
   *	Unlike other endpoints, the Product Selection endpoint does not return this field by default.
   *	To get `total`, pass the query parameter `withTotal` set to `true`.
   *	When the results are filtered with a [Query Predicate](/predicates/query), `total` is subject to a [limit](/limits#queries).
   *
   *
   */
  readonly total?: number
  /**
   *	Product Selection Assignments.
   *
   */
  readonly results: ProductSelectionAssignment[]
}
export interface ProductSelectionAddProductAction {
  readonly action: 'addProduct'
  /**
   *	ResourceIdentifier to Product
   *
   */
  readonly product: ProductResourceIdentifier
}
export interface ProductSelectionChangeNameAction {
  readonly action: 'changeName'
  /**
   *	The new name to be set for the Product Selection.
   *
   */
  readonly name: LocalizedString
}
export interface ProductSelectionRemoveProductAction {
  readonly action: 'removeProduct'
  /**
   *	ResourceIdentifier to Product
   *
   */
  readonly product: ProductResourceIdentifier
}
export interface ProductSelectionSetCustomFieldAction {
  readonly action: 'setCustomField'
  /**
   *	Name of the [Custom Field](/../api/projects/custom-fields).
   *
   *
   */
  readonly name: string
  /**
   *	If `value` is absent or `null`, this field will be removed if it exists.
   *	Trying to remove a field that does not exist will fail with an [InvalidOperation](/../api/errors#general-400-invalid-operation) error.
   *	If `value` is provided, it is set for the field defined by `name`.
   *
   *
   */
  readonly value?: any
}
export interface ProductSelectionSetCustomTypeAction {
  readonly action: 'setCustomType'
  /**
   *	Defines the [Type](ctp:api:type:Type) that extends the ProductSelection with [Custom Fields](/../api/projects/custom-fields).
   *	If absent, any existing Type and Custom Fields are removed from the ProductSelection.
   *
   *
   */
  readonly type?: TypeResourceIdentifier
  /**
   *	Sets the [Custom Fields](/../api/projects/custom-fields) fields for the ProductSelection.
   *
   *
   */
  readonly fields?: FieldContainer
}
export interface ProductSelectionSetKeyAction {
  readonly action: 'setKey'
  /**
   *	If `key` is absent or `null`, the existing key, if any, will be removed.
   *
   */
  readonly key?: string
}