import { BaseResource, CreatedBy, LastModifiedBy, LocalizedString, Money, TypedMoney } from './common'
import { TaxCategoryReference, TaxCategoryResourceIdentifier } from './tax-category'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
import { ZoneReference, ZoneResourceIdentifier } from './zone'
export interface PriceFunction {
  readonly currencyCode: string
  readonly function: string
}
export interface ShippingMethod extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly name: string
  readonly localizedName?: LocalizedString
  readonly description?: string
  readonly localizedDescription?: LocalizedString
  readonly taxCategory: TaxCategoryReference
  readonly zoneRates: ZoneRate[]
  readonly isDefault: boolean
  readonly predicate?: string
  readonly custom?: CustomFields
}
export interface ShippingMethodDraft {
  readonly key?: string
  readonly name: string
  readonly localizedName?: LocalizedString
  readonly description?: string
  readonly localizedDescription?: LocalizedString
  readonly taxCategory: TaxCategoryResourceIdentifier
  readonly zoneRates: ZoneRateDraft[]
  readonly isDefault: boolean
  readonly predicate?: string
  readonly custom?: CustomFieldsDraft
}
export interface ShippingMethodPagedQueryResponse {
  readonly limit?: number
  readonly count: number
  readonly total?: number
  readonly offset?: number
  readonly results: ShippingMethod[]
}
export interface ShippingMethodReference {
  readonly typeId: 'shipping-method'
  readonly id: string
  readonly obj?: ShippingMethod
}
export interface ShippingMethodResourceIdentifier {
  readonly typeId: 'shipping-method'
  readonly id?: string
  readonly key?: string
}
export interface ShippingMethodUpdate {
  readonly version: number
  readonly actions: ShippingMethodUpdateAction[]
}
export declare type ShippingMethodUpdateAction =
  | ShippingMethodAddShippingRateAction
  | ShippingMethodAddZoneAction
  | ShippingMethodChangeIsDefaultAction
  | ShippingMethodChangeNameAction
  | ShippingMethodChangeTaxCategoryAction
  | ShippingMethodRemoveShippingRateAction
  | ShippingMethodRemoveZoneAction
  | ShippingMethodSetCustomFieldAction
  | ShippingMethodSetCustomTypeAction
  | ShippingMethodSetDescriptionAction
  | ShippingMethodSetKeyAction
  | ShippingMethodSetLocalizedDescriptionAction
  | ShippingMethodSetLocalizedNameAction
  | ShippingMethodSetPredicateAction
export interface ShippingRate {
  readonly price: TypedMoney
  readonly freeAbove?: TypedMoney
  readonly isMatching?: boolean
  readonly tiers: ShippingRatePriceTier[]
}
export interface ShippingRateDraft {
  readonly price: Money
  readonly freeAbove?: Money
  readonly tiers?: ShippingRatePriceTier[]
}
export declare type ShippingRatePriceTier = CartClassificationTier | CartScoreTier | CartValueTier
export interface CartClassificationTier {
  readonly type: 'CartClassification'
  readonly value: string
  readonly price: Money
  readonly isMatching?: boolean
}
export interface CartScoreTier {
  readonly type: 'CartScore'
  readonly score: number
  readonly price?: Money
  readonly priceFunction?: PriceFunction
  readonly isMatching?: boolean
}
export interface CartValueTier {
  readonly type: 'CartValue'
  readonly minimumCentAmount: number
  readonly price: Money
  readonly isMatching?: boolean
}
export declare type ShippingRateTierType = 'CartClassification' | 'CartScore' | 'CartValue'
export interface ZoneRate {
  readonly zone: ZoneReference
  readonly shippingRates: ShippingRate[]
}
export interface ZoneRateDraft {
  readonly zone: ZoneResourceIdentifier
  readonly shippingRates: ShippingRateDraft[]
}
export interface ShippingMethodAddShippingRateAction {
  readonly action: 'addShippingRate'
  readonly zone: ZoneResourceIdentifier
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodAddZoneAction {
  readonly action: 'addZone'
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodChangeIsDefaultAction {
  readonly action: 'changeIsDefault'
  readonly isDefault: boolean
}
export interface ShippingMethodChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface ShippingMethodChangeTaxCategoryAction {
  readonly action: 'changeTaxCategory'
  readonly taxCategory: TaxCategoryResourceIdentifier
}
export interface ShippingMethodRemoveShippingRateAction {
  readonly action: 'removeShippingRate'
  readonly zone: ZoneResourceIdentifier
  readonly shippingRate: ShippingRateDraft
}
export interface ShippingMethodRemoveZoneAction {
  readonly action: 'removeZone'
  readonly zone: ZoneResourceIdentifier
}
export interface ShippingMethodSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ShippingMethodSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ShippingMethodSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: string
}
export interface ShippingMethodSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ShippingMethodSetLocalizedDescriptionAction {
  readonly action: 'setLocalizedDescription'
  readonly localizedDescription?: LocalizedString
}
export interface ShippingMethodSetLocalizedNameAction {
  readonly action: 'setLocalizedName'
  readonly localizedName?: LocalizedString
}
export interface ShippingMethodSetPredicateAction {
  readonly action: 'setPredicate'
  readonly predicate?: string
}
//# sourceMappingURL=shipping-method.d.ts.map
