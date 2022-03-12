import { ChannelReference, ChannelResourceIdentifier } from './channel'
import { BaseResource, CreatedBy, LastModifiedBy } from './common'
import { CustomerReference, CustomerResourceIdentifier } from './customer'
import { ProductReference, ProductResourceIdentifier } from './product'
import { StateReference, StateResourceIdentifier } from './state'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type'
export interface Review extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  readonly target?: ProductReference | ChannelReference
  readonly includedInStatistics: boolean
  readonly rating?: number
  readonly state?: StateReference
  readonly customer?: CustomerReference
  readonly custom?: CustomFields
}
export interface ReviewDraft {
  readonly key?: string
  readonly uniquenessValue?: string
  readonly locale?: string
  readonly authorName?: string
  readonly title?: string
  readonly text?: string
  readonly target?: ProductResourceIdentifier | ChannelResourceIdentifier
  readonly state?: StateResourceIdentifier
  readonly rating?: number
  readonly customer?: CustomerResourceIdentifier
  readonly custom?: CustomFieldsDraft
}
export interface ReviewPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Review[]
}
export interface ReviewRatingStatistics {
  readonly averageRating: number
  readonly highestRating: number
  readonly lowestRating: number
  readonly count: number
  readonly ratingsDistribution: any
}
export interface ReviewReference {
  readonly typeId: 'review'
  readonly id: string
  readonly obj?: Review
}
export interface ReviewResourceIdentifier {
  readonly typeId: 'review'
  readonly id?: string
  readonly key?: string
}
export interface ReviewUpdate {
  readonly version: number
  readonly actions: ReviewUpdateAction[]
}
export declare type ReviewUpdateAction =
  | ReviewSetAuthorNameAction
  | ReviewSetCustomFieldAction
  | ReviewSetCustomTypeAction
  | ReviewSetCustomerAction
  | ReviewSetKeyAction
  | ReviewSetLocaleAction
  | ReviewSetRatingAction
  | ReviewSetTargetAction
  | ReviewSetTextAction
  | ReviewSetTitleAction
  | ReviewTransitionStateAction
export interface ReviewSetAuthorNameAction {
  readonly action: 'setAuthorName'
  readonly authorName?: string
}
export interface ReviewSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}
export interface ReviewSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}
export interface ReviewSetCustomerAction {
  readonly action: 'setCustomer'
  readonly customer?: CustomerResourceIdentifier
}
export interface ReviewSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ReviewSetLocaleAction {
  readonly action: 'setLocale'
  readonly locale?: string
}
export interface ReviewSetRatingAction {
  readonly action: 'setRating'
  readonly rating?: number
}
export interface ReviewSetTargetAction {
  readonly action: 'setTarget'
  readonly target: ProductResourceIdentifier | ChannelResourceIdentifier
}
export interface ReviewSetTextAction {
  readonly action: 'setText'
  readonly text?: string
}
export interface ReviewSetTitleAction {
  readonly action: 'setTitle'
  readonly title?: string
}
export interface ReviewTransitionStateAction {
  readonly action: 'transitionState'
  readonly state: StateResourceIdentifier
  readonly force?: boolean
}
//# sourceMappingURL=review.d.ts.map
