import { ChannelReference, ChannelResourceIdentifier } from './channel'
import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString, ResourceIdentifier } from './common'
import { ProductSelectionReference, ProductSelectionResourceIdentifier } from './product-selection'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface ProductSelectionSetting {
  readonly productSelection: ProductSelectionReference
  readonly active: boolean
}
export interface ProductSelectionSettingDraft {
  readonly productSelection: ProductSelectionResourceIdentifier
  readonly active?: boolean
}
export interface Store extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key: string
  readonly name?: LocalizedString
  readonly languages?: string[]
  readonly distributionChannels: ChannelReference[]
  readonly supplyChannels?: ChannelReference[]
  readonly productSelections?: ProductSelectionSetting[]
  readonly custom?: CustomFields
}
export interface StoreDraft {
  readonly key: string
  readonly name?: LocalizedString
  readonly languages?: string[]
  readonly distributionChannels?: ChannelResourceIdentifier[]
  readonly supplyChannels?: ChannelResourceIdentifier[]
  readonly productSelections?: ProductSelectionSettingDraft[]
  readonly custom?: CustomFieldsDraft
}
export interface StoreKeyReference {
  readonly typeId: 'store'
  readonly key: string
}
export interface StorePagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Store[]
}
export interface StoreReference {
  readonly typeId: 'store'
  readonly id: string
  readonly obj?: Store
}
export interface StoreResourceIdentifier {
  readonly typeId: 'store'
  readonly id?: string
  readonly key?: string
}
export interface StoreUpdate {
  readonly version: number
  readonly actions: StoreUpdateAction[]
}
export declare type StoreUpdateAction =
  | StoreAddDistributionChannelAction
  | StoreAddProductSelectionAction
  | StoreAddSupplyChannelAction
  | StoreChangeProductSelectionAction
  | StoreRemoveDistributionChannelAction
  | StoreRemoveProductSelectionAction
  | StoreRemoveSupplyChannelAction
  | StoreSetCustomFieldAction
  | StoreSetCustomTypeAction
  | StoreSetDistributionChannelsAction
  | StoreSetLanguagesAction
  | StoreSetNameAction
  | StoreSetProductSelectionsAction
  | StoreSetSupplyChannelsAction
export interface StoreAddDistributionChannelAction {
  readonly action: 'addDistributionChannel'
  readonly distributionChannel: ChannelResourceIdentifier
}
export interface StoreAddProductSelectionAction {
  readonly action: 'addProductSelection'
  readonly productSelection: ProductSelectionSettingDraft
}
export interface StoreAddSupplyChannelAction {
  readonly action: 'addSupplyChannel'
  readonly supplyChannel?: ChannelResourceIdentifier
}
export interface StoreChangeProductSelectionAction {
  readonly action: 'changeProductSelectionActive'
  readonly productSelection: ResourceIdentifier
  readonly active?: boolean
}
export interface StoreRemoveDistributionChannelAction {
  readonly action: 'removeDistributionChannel'
  readonly distributionChannel: ChannelResourceIdentifier
}
export interface StoreRemoveProductSelectionAction {
  readonly action: 'removeProductSelection'
  readonly productSelection: ResourceIdentifier
}
export interface StoreRemoveSupplyChannelAction {
  readonly action: 'removeSupplyChannel'
  readonly supplyChannel?: ChannelResourceIdentifier
}
export interface StoreSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface StoreSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface StoreSetDistributionChannelsAction {
  readonly action: 'setDistributionChannels'
  readonly distributionChannels?: ChannelResourceIdentifier[]
}
export interface StoreSetLanguagesAction {
  readonly action: 'setLanguages'
  readonly languages?: string[]
}
export interface StoreSetNameAction {
  readonly action: 'setName'
  readonly name?: LocalizedString
}
export interface StoreSetProductSelectionsAction {
  readonly action: 'setProductSelections'
  readonly productSelections: ProductSelectionSettingDraft[]
}
export interface StoreSetSupplyChannelsAction {
  readonly action: 'setSupplyChannels'
  readonly supplyChannels?: ChannelResourceIdentifier[]
}
//# sourceMappingURL=store.d.ts.map
