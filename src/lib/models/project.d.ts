import { MessagesConfiguration, MessagesConfigurationDraft } from './message'
import { CustomFieldLocalizedEnumValue } from './type'
export interface CartsConfiguration {
  readonly deleteDaysAfterLastModification?: number
  readonly countryTaxRateFallbackEnabled?: boolean
}
export interface ExternalOAuth {
  readonly url: string
  readonly authorizationHeader: string
}
export declare type OrderSearchStatus = 'Activated' | 'Deactivated'
export interface Project {
  readonly version: number
  readonly key: string
  readonly name: string
  readonly countries: string[]
  readonly currencies: string[]
  readonly languages: string[]
  readonly createdAt: string
  readonly trialUntil?: string
  readonly messages: MessagesConfiguration
  readonly carts: CartsConfiguration
  readonly shoppingLists?: ShoppingListsConfiguration
  readonly shippingRateInputType?: ShippingRateInputType
  readonly externalOAuth?: ExternalOAuth
  readonly searchIndexing?: SearchIndexingConfiguration
}
export interface ProjectUpdate {
  readonly version: number
  readonly actions: ProjectUpdateAction[]
}
export declare type ProjectUpdateAction =
  | ProjectChangeCartsConfigurationAction
  | ProjectChangeCountriesAction
  | ProjectChangeCountryTaxRateFallbackEnabledAction
  | ProjectChangeCurrenciesAction
  | ProjectChangeLanguagesAction
  | ProjectChangeMessagesConfigurationAction
  | ProjectChangeMessagesEnabledAction
  | ProjectChangeNameAction
  | ProjectChangeOrderSearchStatusAction
  | ProjectChangeProductSearchIndexingEnabledAction
  | ProjectChangeShoppingListsConfigurationAction
  | ProjectSetExternalOAuthAction
  | ProjectSetShippingRateInputTypeAction
export interface SearchIndexingConfiguration {
  readonly products?: SearchIndexingConfigurationValues
  readonly orders?: SearchIndexingConfigurationValues
}
export declare type SearchIndexingConfigurationStatus = 'Activated' | 'Deactivated' | 'Indexing'
export interface SearchIndexingConfigurationValues {
  readonly status?: SearchIndexingConfigurationStatus
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: string
}
export declare type ShippingRateInputType = CartClassificationType | CartScoreType | CartValueType
export interface CartClassificationType {
  readonly type: 'CartClassification'
  readonly values: CustomFieldLocalizedEnumValue[]
}
export interface CartScoreType {
  readonly type: 'CartScore'
}
export interface CartValueType {
  readonly type: 'CartValue'
}
export interface ShoppingListsConfiguration {
  readonly deleteDaysAfterLastModification?: number
}
export interface ProjectChangeCartsConfigurationAction {
  readonly action: 'changeCartsConfiguration'
  readonly cartsConfiguration: CartsConfiguration
}
export interface ProjectChangeCountriesAction {
  readonly action: 'changeCountries'
  readonly countries: string[]
}
export interface ProjectChangeCountryTaxRateFallbackEnabledAction {
  readonly action: 'changeCountryTaxRateFallbackEnabled'
  readonly countryTaxRateFallbackEnabled: boolean
}
export interface ProjectChangeCurrenciesAction {
  readonly action: 'changeCurrencies'
  readonly currencies: string[]
}
export interface ProjectChangeLanguagesAction {
  readonly action: 'changeLanguages'
  readonly languages: string[]
}
export interface ProjectChangeMessagesConfigurationAction {
  readonly action: 'changeMessagesConfiguration'
  readonly messagesConfiguration: MessagesConfigurationDraft
}
export interface ProjectChangeMessagesEnabledAction {
  readonly action: 'changeMessagesEnabled'
  readonly messagesEnabled: boolean
}
export interface ProjectChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface ProjectChangeOrderSearchStatusAction {
  readonly action: 'changeOrderSearchStatus'
  readonly status: OrderSearchStatus
}
export interface ProjectChangeProductSearchIndexingEnabledAction {
  readonly action: 'changeProductSearchIndexingEnabled'
  readonly enabled: boolean
}
export interface ProjectChangeShoppingListsConfigurationAction {
  readonly action: 'changeShoppingListsConfiguration'
  readonly shoppingListsConfiguration: ShoppingListsConfiguration
}
export interface ProjectSetExternalOAuthAction {
  readonly action: 'setExternalOAuth'
  readonly externalOAuth?: ExternalOAuth
}
export interface ProjectSetShippingRateInputTypeAction {
  readonly action: 'setShippingRateInputType'
  readonly shippingRateInputType?: ShippingRateInputType
}
//# sourceMappingURL=project.d.ts.map
