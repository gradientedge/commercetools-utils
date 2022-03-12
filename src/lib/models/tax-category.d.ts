import { BaseResource, CreatedBy, LastModifiedBy } from './common'
export interface SubRate {
  readonly name: string
  readonly amount: number
}
export interface TaxCategory extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly name: string
  readonly description?: string
  readonly rates: TaxRate[]
  readonly key?: string
}
export interface TaxCategoryDraft {
  readonly name: string
  readonly description?: string
  readonly rates?: TaxRateDraft[]
  readonly key?: string
}
export interface TaxCategoryPagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: TaxCategory[]
}
export interface TaxCategoryReference {
  readonly typeId: 'tax-category'
  readonly id: string
  readonly obj?: TaxCategory
}
export interface TaxCategoryResourceIdentifier {
  readonly typeId: 'tax-category'
  readonly id?: string
  readonly key?: string
}
export interface TaxCategoryUpdate {
  readonly version: number
  readonly actions: TaxCategoryUpdateAction[]
}
export declare type TaxCategoryUpdateAction =
  | TaxCategoryAddTaxRateAction
  | TaxCategoryChangeNameAction
  | TaxCategoryRemoveTaxRateAction
  | TaxCategoryReplaceTaxRateAction
  | TaxCategorySetDescriptionAction
  | TaxCategorySetKeyAction
export interface TaxRate {
  readonly id?: string
  readonly name: string
  readonly amount: number
  readonly includedInPrice: boolean
  readonly country: string
  readonly state?: string
  readonly subRates?: SubRate[]
}
export interface TaxRateDraft {
  readonly name: string
  readonly amount?: number
  readonly includedInPrice: boolean
  readonly country: string
  readonly state?: string
  readonly subRates?: SubRate[]
}
export interface TaxCategoryAddTaxRateAction {
  readonly action: 'addTaxRate'
  readonly taxRate: TaxRateDraft
}
export interface TaxCategoryChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface TaxCategoryRemoveTaxRateAction {
  readonly action: 'removeTaxRate'
  readonly taxRateId: string
}
export interface TaxCategoryReplaceTaxRateAction {
  readonly action: 'replaceTaxRate'
  readonly taxRateId: string
  readonly taxRate: TaxRateDraft
}
export interface TaxCategorySetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: string
}
export interface TaxCategorySetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
//# sourceMappingURL=tax-category.d.ts.map
