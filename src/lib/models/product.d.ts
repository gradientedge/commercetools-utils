import { ProductPublishScope } from './cart'
import { CategoryReference, CategoryResourceIdentifier } from './category'
import {
  Asset,
  AssetDraft,
  AssetSource,
  BaseResource,
  CreatedBy,
  DiscountedPriceDraft,
  Image,
  LastModifiedBy,
  LocalizedString,
  Price,
  PriceDraft,
  ScopedPrice,
} from './common'
import { ProductTypeReference, ProductTypeResourceIdentifier } from './product-type'
import { ReviewRatingStatistics } from './review'
import { StateReference, StateResourceIdentifier } from './state'
import { TaxCategoryReference, TaxCategoryResourceIdentifier } from './tax-category'
import { FieldContainer, TypeResourceIdentifier } from './type'
export interface Attribute {
  readonly name: string
  readonly value: any
}
export interface CategoryOrderHints {
  [key: string]: string
}
export interface FacetRange {
  readonly from: number
  readonly fromStr: string
  readonly to: number
  readonly toStr: string
  readonly count: number
  readonly productCount?: number
  readonly total: number
  readonly min: number
  readonly max: number
  readonly mean: number
}
export declare type FacetResult = FilteredFacetResult | RangeFacetResult | TermFacetResult
export interface FacetResults {
  [key: string]: FacetResult
}
export interface FacetTerm {
  readonly term: any
  readonly count: number
  readonly productCount?: number
}
export declare type FacetTypes = 'filter' | 'range' | 'terms'
export interface FilteredFacetResult {
  readonly type: 'filter'
  readonly count: number
  readonly productCount?: number
}
export interface Product extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly productType: ProductTypeReference
  readonly masterData: ProductCatalogData
  readonly taxCategory?: TaxCategoryReference
  readonly state?: StateReference
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}
export interface ProductCatalogData {
  readonly published: boolean
  readonly current: ProductData
  readonly staged: ProductData
  readonly hasStagedChanges: boolean
}
export interface ProductData {
  readonly name: LocalizedString
  readonly categories: CategoryReference[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly description?: LocalizedString
  readonly slug: LocalizedString
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly masterVariant: ProductVariant
  readonly variants: ProductVariant[]
  readonly searchKeywords: SearchKeywords
}
export interface ProductDraft {
  readonly productType: ProductTypeResourceIdentifier
  readonly name: LocalizedString
  readonly slug: LocalizedString
  readonly key?: string
  readonly description?: LocalizedString
  readonly categories?: CategoryResourceIdentifier[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly masterVariant?: ProductVariantDraft
  readonly variants?: ProductVariantDraft[]
  readonly taxCategory?: TaxCategoryResourceIdentifier
  readonly searchKeywords?: SearchKeywords
  readonly state?: StateResourceIdentifier
  readonly publish?: boolean
}
export interface ProductPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Product[]
}
export interface ProductProjection extends BaseResource {
  readonly id: string
  readonly version: number
  readonly key?: string
  readonly productType: ProductTypeReference
  readonly name: LocalizedString
  readonly description?: LocalizedString
  readonly slug: LocalizedString
  readonly categories: CategoryReference[]
  readonly categoryOrderHints?: CategoryOrderHints
  readonly metaTitle?: LocalizedString
  readonly metaDescription?: LocalizedString
  readonly metaKeywords?: LocalizedString
  readonly searchKeywords?: SearchKeywords
  readonly hasStagedChanges?: boolean
  readonly published?: boolean
  readonly masterVariant: ProductVariant
  readonly variants: ProductVariant[]
  readonly taxCategory?: TaxCategoryReference
  readonly state?: StateReference
  readonly reviewRatingStatistics?: ReviewRatingStatistics
}
export interface ProductProjectionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductProjection[]
}
export interface ProductProjectionPagedSearchResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: ProductProjection[]
  readonly facets: FacetResults
}
export interface ProductReference {
  readonly typeId: 'product'
  readonly id: string
  readonly obj?: Product
}
export interface ProductResourceIdentifier {
  readonly typeId: 'product'
  readonly id?: string
  readonly key?: string
}
export interface ProductUpdate {
  readonly version: number
  readonly actions: ProductUpdateAction[]
}
export declare type ProductUpdateAction =
  | ProductAddAssetAction
  | ProductAddExternalImageAction
  | ProductAddPriceAction
  | ProductAddToCategoryAction
  | ProductAddVariantAction
  | ProductChangeAssetNameAction
  | ProductChangeAssetOrderAction
  | ProductChangeMasterVariantAction
  | ProductChangeNameAction
  | ProductChangePriceAction
  | ProductChangeSlugAction
  | ProductLegacySetSkuAction
  | ProductMoveImageToPositionAction
  | ProductPublishAction
  | ProductRemoveAssetAction
  | ProductRemoveFromCategoryAction
  | ProductRemoveImageAction
  | ProductRemovePriceAction
  | ProductRemoveVariantAction
  | ProductRevertStagedChangesAction
  | ProductRevertStagedVariantChangesAction
  | ProductSetAssetCustomFieldAction
  | ProductSetAssetCustomTypeAction
  | ProductSetAssetDescriptionAction
  | ProductSetAssetKeyAction
  | ProductSetAssetSourcesAction
  | ProductSetAssetTagsAction
  | ProductSetAttributeAction
  | ProductSetAttributeInAllVariantsAction
  | ProductSetCategoryOrderHintAction
  | ProductSetDescriptionAction
  | ProductSetDiscountedPriceAction
  | ProductSetImageLabelAction
  | ProductSetKeyAction
  | ProductSetMetaDescriptionAction
  | ProductSetMetaKeywordsAction
  | ProductSetMetaTitleAction
  | ProductSetPricesAction
  | ProductSetProductPriceCustomFieldAction
  | ProductSetProductPriceCustomTypeAction
  | ProductSetProductVariantKeyAction
  | ProductSetSearchKeywordsAction
  | ProductSetSkuAction
  | ProductSetTaxCategoryAction
  | ProductTransitionStateAction
  | ProductUnpublishAction
export interface ProductVariant {
  readonly id: number
  readonly sku?: string
  readonly key?: string
  readonly prices?: Price[]
  readonly attributes?: Attribute[]
  readonly price?: Price
  readonly images?: Image[]
  readonly assets?: Asset[]
  readonly availability?: ProductVariantAvailability
  readonly isMatchingVariant?: boolean
  readonly scopedPrice?: ScopedPrice
  readonly scopedPriceDiscounted?: boolean
}
export interface ProductVariantAvailability {
  readonly isOnStock?: boolean
  readonly restockableInDays?: number
  readonly availableQuantity?: number
  readonly channels?: ProductVariantChannelAvailabilityMap
}
export interface ProductVariantChannelAvailability {
  readonly isOnStock?: boolean
  readonly restockableInDays?: number
  readonly availableQuantity?: number
}
export interface ProductVariantChannelAvailabilityMap {
  [key: string]: ProductVariantChannelAvailability
}
export interface ProductVariantDraft {
  readonly sku?: string
  readonly key?: string
  readonly prices?: PriceDraft[]
  readonly attributes?: Attribute[]
  readonly images?: Image[]
  readonly assets?: AssetDraft[]
}
export interface RangeFacetResult {
  readonly type: 'range'
  readonly ranges: FacetRange[]
}
export interface SearchKeyword {
  readonly text: string
  readonly suggestTokenizer?: SuggestTokenizer
}
export interface SearchKeywords {
  [key: string]: SearchKeyword[]
}
export declare type SuggestTokenizer = CustomTokenizer | WhitespaceTokenizer
export interface CustomTokenizer {
  readonly type: 'custom'
  readonly inputs: string[]
}
export interface Suggestion {
  readonly text: string
}
export interface SuggestionResult {
  [key: string]: Suggestion[]
}
export interface TermFacetResult {
  readonly type: 'terms'
  readonly dataType: TermFacetResultType
  readonly missing: number
  readonly total: number
  readonly other: number
  readonly terms: FacetTerm[]
}
export declare type TermFacetResultType = 'boolean' | 'date' | 'datetime' | 'number' | 'text' | 'time'
export interface WhitespaceTokenizer {
  readonly type: 'whitespace'
}
export interface ProductAddAssetAction {
  readonly action: 'addAsset'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly asset: AssetDraft
  readonly position?: number
}
export interface ProductAddExternalImageAction {
  readonly action: 'addExternalImage'
  readonly variantId?: number
  readonly sku?: string
  readonly image: Image
  readonly staged?: boolean
}
export interface ProductAddPriceAction {
  readonly action: 'addPrice'
  readonly variantId?: number
  readonly sku?: string
  readonly price: PriceDraft
  readonly staged?: boolean
}
export interface ProductAddToCategoryAction {
  readonly action: 'addToCategory'
  readonly category: CategoryResourceIdentifier
  readonly orderHint?: string
  readonly staged?: boolean
}
export interface ProductAddVariantAction {
  readonly action: 'addVariant'
  readonly sku?: string
  readonly key?: string
  readonly prices?: PriceDraft[]
  readonly images?: Image[]
  readonly attributes?: Attribute[]
  readonly staged?: boolean
  readonly assets?: Asset[]
}
export interface ProductChangeAssetNameAction {
  readonly action: 'changeAssetName'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: LocalizedString
}
export interface ProductChangeAssetOrderAction {
  readonly action: 'changeAssetOrder'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetOrder: string[]
}
export interface ProductChangeMasterVariantAction {
  readonly action: 'changeMasterVariant'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductChangeNameAction {
  readonly action: 'changeName'
  readonly name: LocalizedString
  readonly staged?: boolean
}
export interface ProductChangePriceAction {
  readonly action: 'changePrice'
  readonly priceId: string
  readonly price: PriceDraft
  readonly staged?: boolean
}
export interface ProductChangeSlugAction {
  readonly action: 'changeSlug'
  readonly slug: LocalizedString
  readonly staged?: boolean
}
export interface ProductLegacySetSkuAction {
  readonly action: 'legacySetSku'
  readonly sku?: string
  readonly variantId: number
}
export interface ProductMoveImageToPositionAction {
  readonly action: 'moveImageToPosition'
  readonly variantId?: number
  readonly sku?: string
  readonly imageUrl: string
  readonly position: number
  readonly staged?: boolean
}
export interface ProductPublishAction {
  readonly action: 'publish'
  readonly scope?: ProductPublishScope
}
export interface ProductRemoveAssetAction {
  readonly action: 'removeAsset'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
}
export interface ProductRemoveFromCategoryAction {
  readonly action: 'removeFromCategory'
  readonly category: CategoryResourceIdentifier
  readonly staged?: boolean
}
export interface ProductRemoveImageAction {
  readonly action: 'removeImage'
  readonly variantId?: number
  readonly sku?: string
  readonly imageUrl: string
  readonly staged?: boolean
}
export interface ProductRemovePriceAction {
  readonly action: 'removePrice'
  readonly priceId: string
  readonly staged?: boolean
}
export interface ProductRemoveVariantAction {
  readonly action: 'removeVariant'
  readonly id?: number
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductRevertStagedChangesAction {
  readonly action: 'revertStagedChanges'
}
export interface ProductRevertStagedVariantChangesAction {
  readonly action: 'revertStagedVariantChanges'
  readonly variantId: number
}
export interface ProductSetAssetCustomFieldAction {
  readonly action: 'setAssetCustomField'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly name: string
  readonly value?: any
}
export interface ProductSetAssetCustomTypeAction {
  readonly action: 'setAssetCustomType'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ProductSetAssetDescriptionAction {
  readonly action: 'setAssetDescription'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly description?: LocalizedString
}
export interface ProductSetAssetKeyAction {
  readonly action: 'setAssetKey'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId: string
  readonly assetKey?: string
}
export interface ProductSetAssetSourcesAction {
  readonly action: 'setAssetSources'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly sources: AssetSource[]
}
export interface ProductSetAssetTagsAction {
  readonly action: 'setAssetTags'
  readonly variantId?: number
  readonly sku?: string
  readonly staged?: boolean
  readonly assetId?: string
  readonly assetKey?: string
  readonly tags?: string[]
}
export interface ProductSetAttributeAction {
  readonly action: 'setAttribute'
  readonly variantId?: number
  readonly sku?: string
  readonly name: string
  readonly value?: any
  readonly staged?: boolean
}
export interface ProductSetAttributeInAllVariantsAction {
  readonly action: 'setAttributeInAllVariants'
  readonly name: string
  readonly value?: any
  readonly staged?: boolean
}
export interface ProductSetCategoryOrderHintAction {
  readonly action: 'setCategoryOrderHint'
  readonly categoryId: string
  readonly orderHint?: string
  readonly staged?: boolean
}
export interface ProductSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetDiscountedPriceAction {
  readonly action: 'setDiscountedPrice'
  readonly priceId: string
  readonly staged?: boolean
  readonly discounted?: DiscountedPriceDraft
}
export interface ProductSetImageLabelAction {
  readonly action: 'setImageLabel'
  readonly sku?: string
  readonly variantId?: number
  readonly imageUrl: string
  readonly label?: string
  readonly staged?: boolean
}
export interface ProductSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ProductSetMetaDescriptionAction {
  readonly action: 'setMetaDescription'
  readonly metaDescription?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetMetaKeywordsAction {
  readonly action: 'setMetaKeywords'
  readonly metaKeywords?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetMetaTitleAction {
  readonly action: 'setMetaTitle'
  readonly metaTitle?: LocalizedString
  readonly staged?: boolean
}
export interface ProductSetPricesAction {
  readonly action: 'setPrices'
  readonly variantId?: number
  readonly sku?: string
  readonly prices: PriceDraft[]
  readonly staged?: boolean
}
export interface ProductSetProductPriceCustomFieldAction {
  readonly action: 'setProductPriceCustomField'
  readonly priceId: string
  readonly staged?: boolean
  readonly name: string
  readonly value?: any
}
export interface ProductSetProductPriceCustomTypeAction {
  readonly action: 'setProductPriceCustomType'
  readonly priceId: string
  readonly staged?: boolean
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ProductSetProductVariantKeyAction {
  readonly action: 'setProductVariantKey'
  readonly variantId?: number
  readonly sku?: string
  readonly key?: string
  readonly staged?: boolean
}
export interface ProductSetSearchKeywordsAction {
  readonly action: 'setSearchKeywords'
  readonly searchKeywords: SearchKeywords
  readonly staged?: boolean
}
export interface ProductSetSkuAction {
  readonly action: 'setSku'
  readonly variantId: number
  readonly sku?: string
  readonly staged?: boolean
}
export interface ProductSetTaxCategoryAction {
  readonly action: 'setTaxCategory'
  readonly taxCategory?: TaxCategoryResourceIdentifier
}
export interface ProductTransitionStateAction {
  readonly action: 'transitionState'
  readonly state?: StateResourceIdentifier
  readonly force?: boolean
}
export interface ProductUnpublishAction {
  readonly action: 'unpublish'
}
//# sourceMappingURL=product.d.ts.map
