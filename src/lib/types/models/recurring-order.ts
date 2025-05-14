import { BaseResource, CreatedBy, IReference, IResourceIdentifier, LastModifiedBy } from './common.js'
import { CartReference, CartResourceIdentifier } from './cart.js'
import { OrderReference } from './order.js'
import { BusinessUnitKeyReference } from './business-unit.js'
import { StateReference, StateResourceIdentifier } from './state.js'
import { CustomerReference } from './customer.js'
import { CustomFields, CustomFieldsDraft, FieldContainer, TypeResourceIdentifier } from './type.js'
import { RecurrencePolicySchedule } from './recurrence-policy.js'

/**
 * Represents a recurring order that automates the reordering process for a customer.
 */
export interface RecurringOrder extends BaseResource {
  /**
   * Unique identifier of the RecurringOrder.
   */
  readonly id: string
  /**
   * Current version of the RecurringOrder.
   */
  readonly version: number
  /**
   * User-defined unique identifier for the RecurringOrder.
   */
  readonly key?: string
  /**
   * Reference to the Cart for a RecurringOrder.
   */
  readonly cart: CartReference
  /**
   * Reference to the Order that generated this RecurringOrder.
   */
  readonly originOrder?: OrderReference
  /**
   * Date and time (UTC) the RecurringOrder starts creating new orders.
   */
  readonly startsAt: string
  /**
   * Date and time (UTC) the RecurringOrder resumes subsequent order creation after it is unpaused.
   */
  readonly resumesAt?: string
  /**
   * Date and time (UTC) the RecurringOrder expires.
   */
  readonly expiresAt?: string
  /**
   * Date and time (UTC) when the last order was created from this RecurringOrder.
   */
  readonly lastOrderAt?: string
  /**
   * Date and time (UTC) when the next order will be created from this RecurringOrder.
   */
  readonly nextOrderAt?: string
  /**
   * Information about current and future skips of this RecurringOrder.
   */
  readonly skipConfiguration?: SkipConfiguration
  /**
   * Reference to a Business Unit the RecurringOrder belongs to.
   */
  readonly businessUnit?: BusinessUnitKeyReference
  /**
   * State of the RecurringOrder in a custom workflow.
   */
  readonly state?: StateReference
  /**
   * Current state of the RecurringOrder.
   */
  readonly recurringOrderState: RecurringOrderState
  /**
   * Schedule of the RecurringOrder.
   */
  readonly schedule: RecurrencePolicySchedule
  /**
   * The Customer that the RecurringOrder belongs to.
   */
  readonly customer?: CustomerReference
  /**
   * Email address of the Customer that the RecurringOrder belongs to.
   */
  readonly customerEmail?: string
  /**
   * Custom Fields of the RecurringOrder.
   */
  readonly custom?: CustomFields
  /**
   * IDs and references that created the RecurringOrder.
   */
  readonly createdBy?: CreatedBy
  /**
   * IDs and references that last modified the RecurringOrder.
   */
  readonly lastModifiedBy?: LastModifiedBy
}

/**
 * Draft for creating a RecurringOrder.
 */
export interface RecurringOrderDraft {
  /**
   * User-defined unique identifier of the RecurringOrder.
   */
  key?: string
  /**
   * ResourceIdentifier to the Cart from which the RecurringOrder is created.
   */
  cart: CartResourceIdentifier
  /**
   * Current version of the referenced Cart.
   */
  cartVersion: number
  /**
   * Date and time (UTC) the RecurringOrder will start.
   */
  startsAt: string
  /**
   * State for the RecurringOrder in a custom workflow.
   */
  state?: StateResourceIdentifier
  /**
   * Custom Fields to be added to the RecurringOrder.
   */
  custom?: CustomFieldsDraft
}

/**
 * Response containing a paged list of RecurringOrders.
 */
export interface RecurringOrderPagedQueryResponse {
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
   * RecurringOrders matching the query.
   */
  results: RecurringOrder[]
}

/**
 * Reference to a RecurringOrder.
 */
export interface RecurringOrderReference extends IReference {
  readonly typeId: 'recurring-order'
  readonly obj?: RecurringOrder
}

/**
 * ResourceIdentifier to a RecurringOrder.
 */
export interface RecurringOrderResourceIdentifier extends IResourceIdentifier {
  readonly typeId: 'recurring-order'
  readonly id?: string
  readonly key?: string
}

/**
 * States of a RecurringOrder.
 */
export enum RecurringOrderState {
  Active = 'Active',
  Paused = 'Paused',
  Expired = 'Expired',
  Canceled = 'Canceled',
}

/**
 * Defines how the next orders are going to be skipped.
 */
export interface SkipConfiguration {
  /**
   * Type of skip configuration.
   */
  readonly type: 'counter'
  /**
   * Amount of orders that are going to be skipped.
   */
  readonly totalToSkip: number
  /**
   * Amount of orders that were already skipped.
   */
  readonly skipped: number
  /**
   * Date and time (UTC) when the last order creation was skipped.
   */
  readonly lastSkippedAt?: string
}

/**
 * Configuration that uses a counter to track the amount of orders that will be skipped.
 */
export interface SkipConfigurationDraft {
  /**
   * Type of skip configuration.
   */
  readonly type: 'counter'
  /**
   * Amount of orders that are going to be skipped.
   */
  readonly totalToSkip: number
}

/**
 * Modes for selecting the price of a line item during order creation.
 */
export enum PriceSelectionMode {
  Fixed = 'Fixed',
  Dynamic = 'Dynamic',
}

/**
 * Update action for RecurringOrder.
 */
export type RecurringOrderUpdateAction =
  | RecurringOrderSetKeyAction
  | RecurringOrderTransitionStateAction
  | RecurringOrderSetRecurringOrderStateAction
  | RecurringOrderSetCustomFieldAction
  | RecurringOrderSetCustomTypeAction
  | RecurringOrderSetSkipConfigurationAction

/**
 * Update action to set the key of a RecurringOrder.
 */
export interface RecurringOrderSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}

/**
 * Update action to transition the state of a RecurringOrder.
 */
export interface RecurringOrderTransitionStateAction {
  readonly action: 'transitionState'
  readonly state: StateResourceIdentifier
  readonly force?: boolean
}

/**
 * Update action to set the RecurringOrderState.
 */
export interface RecurringOrderSetRecurringOrderStateAction {
  readonly action: 'setRecurringOrderState'
  readonly recurringOrderState: RecurringOrderState
}

/**
 * Update action to set a custom field.
 */
export interface RecurringOrderSetCustomFieldAction {
  readonly action: 'setCustomField'
  readonly name: string
  readonly value?: any
}

/**
 * Update action to set the custom type and fields.
 */
export interface RecurringOrderSetCustomTypeAction {
  readonly action: 'setCustomType'
  readonly type?: TypeResourceIdentifier
  readonly fields?: FieldContainer
}

/**
 * Update action to set the skip configuration.
 */
export interface RecurringOrderSetSkipConfigurationAction {
  readonly action: 'setOrderSkipConfiguration'
  readonly skipConfiguration: SkipConfigurationDraft
  readonly updatedExpiresAt?: string
}
