import { BaseResource, CreatedBy, IReference, IResourceIdentifier, LastModifiedBy, LocalizedString } from './common.js'

/**
 * Represents a recurrence policy that defines a schedule for recurring orders.
 */
export interface RecurrencePolicy extends BaseResource {
  /**
   * Unique identifier of the RecurrencePolicy.
   */
  readonly id: string
  /**
   * Current version of the RecurrencePolicy.
   */
  readonly version: number
  /**
   * User-defined unique identifier for the RecurrencePolicy.
   */
  readonly key?: string
  /**
   * Name of the RecurrencePolicy.
   */
  readonly name?: LocalizedString
  /**
   * Description of the RecurrencePolicy.
   */
  readonly description?: LocalizedString
  /**
   * Schedule of the RecurrencePolicy.
   */
  readonly schedule: RecurrencePolicySchedule
  /**
   * IDs and references that created the RecurrencePolicy.
   */
  readonly createdBy?: CreatedBy
  /**
   * IDs and references that last modified the RecurrencePolicy.
   */
  readonly lastModifiedBy?: LastModifiedBy
}

/**
 * Draft for creating a RecurrencePolicy.
 */
export interface RecurrencePolicyDraft {
  /**
   * User-defined unique identifier for the RecurrencePolicy.
   */
  key?: string
  /**
   * Name of the RecurrencePolicy.
   */
  name?: LocalizedString
  /**
   * Description of the RecurrencePolicy.
   */
  description?: LocalizedString
  /**
   * Schedule where the recurrence is defined.
   */
  schedule: RecurrencePolicySchedule
}

/**
 * Response containing a paged list of RecurrencePolicies.
 */
export interface RecurrencePolicyPagedQueryResponse {
  /**
   * Number of results requested.
   */
  limit: number
  /**
   * Number of elements skipped.
   */
  offset: number
  /**
   * Actual number of results returned.
   */
  count: number
  /**
   * Total number of results matching the query.
   */
  total?: number
  /**
   * RecurrencePolicies matching the query.
   */
  results: RecurrencePolicy[]
}

/**
 * Reference to a RecurrencePolicy.
 */
export interface RecurrencePolicyReference extends IReference {
  readonly typeId: 'recurrence-policy'
  readonly obj?: RecurrencePolicy
}

/**
 * ResourceIdentifier to a RecurrencePolicy.
 */
export interface RecurrencePolicyResourceIdentifier extends IResourceIdentifier {
  readonly typeId: 'recurrence-policy'
  readonly id?: string
  readonly key?: string
}

/**
 * Schedule used for a recurrence policy.
 */
export interface RecurrencePolicySchedule {
  /**
   * Type of schedule.
   */
  readonly type: 'standard'
  /**
   * Number of schedule types between orders.
   */
  readonly value: number
  /**
   * The interval used for this schedule.
   */
  readonly intervalUnit: IntervalUnit
}

/**
 * Draft for a standard schedule.
 */
export interface StandardScheduleDraft {
  /**
   * Type of schedule.
   */
  readonly type: 'standard'
  /**
   * Number of schedule types between orders.
   */
  readonly value: number
  /**
   * The interval used for this schedule.
   */
  readonly intervalUnit: IntervalUnit
}

/**
 * Intervals supported for schedules.
 */
export enum IntervalUnit {
  Days = 'Days',
  Weeks = 'Weeks',
  Months = 'Months',
}

/**
 * Update action for RecurrencePolicy.
 */
export type RecurrencePolicyUpdateAction =
  | RecurrencePolicySetKeyAction
  | RecurrencePolicySetNameAction
  | RecurrencePolicySetDescriptionAction

/**
 * Update action to set the key of a RecurrencePolicy.
 */
export interface RecurrencePolicySetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}

/**
 * Update action to set the name of a RecurrencePolicy.
 */
export interface RecurrencePolicySetNameAction {
  readonly action: 'setName'
  readonly name?: LocalizedString
}

/**
 * Update action to set the description of a RecurrencePolicy.
 */
export interface RecurrencePolicySetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: LocalizedString
}
