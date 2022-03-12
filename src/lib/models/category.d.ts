import { Asset, AssetDraft, AssetSource, BaseResource, CreatedBy, LastModifiedBy, LocalizedString } from './common'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface Category extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly name: LocalizedString
  readonly slug: LocalizedString
  readonly description?: LocalizedString
  readonly ancestors: CategoryReference[]
  readonly parent?: CategoryReference
  readonly orderHint: string
  readonly externalId?: string
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly custom?: CustomFields
  readonly assets?: Asset[]
  readonly key?: string
}
export interface CategoryDraft {
  readonly name: LocalizedString
  readonly slug: LocalizedString
  readonly description?: LocalizedString
  readonly parent?: CategoryResourceIdentifier
  readonly orderHint?: string
  readonly externalId?: string
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly custom?: CustomFieldsDraft
  readonly assets?: AssetDraft[]
  readonly key?: string
}
export interface CategoryPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Category[]
}
export interface CategoryReference {
  readonly typeId: 'category'
  readonly id: string
  readonly obj?: Category
}
export interface CategoryResourceIdentifier {
  readonly typeId: 'category'
  readonly id?: string
  readonly key?: string
}
export interface CategoryUpdate {
  readonly version: number
  readonly actions: CategoryUpdateAction[]
}
export declare type CategoryUpdateAction =
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
export interface CategoryAddAssetAction {
  readonly action: 'addAsset'
  readonly asset: AssetDraft
  readonly position?: number
}
export interface CategoryChangeAssetNameAction {
  readonly action: 'changeAssetName'
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: LocalizedString
}
export interface CategoryChangeAssetOrderAction {
  readonly action: 'changeAssetOrder'
  readonly assetOrder: string[]
}
export interface CategoryChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
}
export interface CategoryChangeOrderHintAction {
  readonly action: 'changeOrderHint'
  readonly orderHint: string
}
export interface CategoryChangeParentAction {
  readonly action: 'changeParent'
  readonly parent: CategoryResourceIdentifier
}
export interface CategoryChangeSlugAction {
  readonly action: 'changeSlug'
  readonly slug: LocalizedString
}
export interface CategoryRemoveAssetAction {
  readonly action: 'removeAsset'
  readonly assetId?: string
  readonly assetKey?: string
}
export interface CategorySetAssetCustomFieldAction {
  readonly action: 'setAssetCustomField'
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: string
  readonly value?: any
}
export interface CategorySetAssetCustomTypeAction {
  readonly action: 'setAssetCustomType'
  readonly assetId?: string
  readonly assetKey?: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: any
}
export interface CategorySetAssetDescriptionAction {
  readonly action: 'setAssetDescription'
  readonly assetId?: string
  readonly assetKey?: string
  readonly description?: LocalizedString
}
export interface CategorySetAssetKeyAction {
  readonly action: 'setAssetKey'
  readonly assetId: string
  readonly assetKey?: string
}
export interface CategorySetAssetSourcesAction {
  readonly action: 'setAssetSources'
  readonly assetId?: string
  readonly assetKey?: string
  readonly sources: AssetSource[]
}
export interface CategorySetAssetTagsAction {
  readonly action: 'setAssetTags'
  readonly assetId?: string
  readonly assetKey?: string
  readonly tags?: string[]
}
export interface CategorySetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface CategorySetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface CategorySetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
export interface CategorySetExternalIdAction {
  readonly action: 'setExternalId'
  readonly externalId?: string
}
export interface CategorySetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface CategorySetMetaDescriptionAction {
  readonly action: 'setMetaDescription'
  readonly metaDescription?: LocalizedString
}
export interface CategorySetMetaKeywordsAction {
  readonly action: 'setMetaKeywords'
  readonly metaKeywords?: LocalizedString
}
export interface CategorySetMetaTitleAction {
  readonly action: 'setMetaTitle'
  readonly metaTitle?: LocalizedString
}
//# sourceMappingURL=category.d.ts.map
