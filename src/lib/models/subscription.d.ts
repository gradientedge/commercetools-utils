import { BaseResource, CreatedBy, LastModifiedBy, Reference } from './common'
import { UserProvidedIdentifiers } from './message'
export interface ChangeSubscription {
  readonly resourceTypeId: string
}
export declare type DeliveryFormat = CloudEventsFormat | PlatformFormat
export interface CloudEventsFormat {
  readonly type: 'CloudEvents'
  readonly cloudEventsVersion: string
}
export declare type DeliveryPayload =
  | MessageDeliveryPayload
  | ResourceCreatedDeliveryPayload
  | ResourceDeletedDeliveryPayload
  | ResourceUpdatedDeliveryPayload
export declare type Destination =
  | AzureEventGridDestination
  | AzureServiceBusDestination
  | EventBridgeDestination
  | GoogleCloudPubSubDestination
  | IronMqDestination
  | SnsDestination
  | SqsDestination
export interface AzureEventGridDestination {
  readonly type: 'EventGrid'
  readonly uri: string
  readonly accessKey: string
}
export interface AzureServiceBusDestination {
  readonly type: 'AzureServiceBus'
  readonly connectionString: string
}
export interface EventBridgeDestination {
  readonly type: 'EventBridge'
  readonly region: string
  readonly accountId: string
}
export interface GoogleCloudPubSubDestination {
  readonly type: 'GoogleCloudPubSub'
  readonly projectId: string
  readonly topic: string
}
export interface IronMqDestination {
  readonly type: 'IronMQ'
  readonly uri: string
}
export interface MessageDeliveryPayload {
  readonly notificationType: 'Message'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly sequenceNumber: number
  readonly resourceVersion: number
  readonly payloadNotIncluded: PayloadNotIncluded
}
export interface MessageSubscription {
  readonly resourceTypeId: string
  readonly types?: string[]
}
export interface PayloadNotIncluded {
  readonly reason: string
  readonly payloadType: string
}
export interface PlatformFormat {
  readonly type: 'Platform'
}
export interface ResourceCreatedDeliveryPayload {
  readonly notificationType: 'ResourceCreated'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly modifiedAt: string
}
export interface ResourceDeletedDeliveryPayload {
  readonly notificationType: 'ResourceDeleted'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly modifiedAt: string
  readonly dataErasure?: boolean
}
export interface ResourceUpdatedDeliveryPayload {
  readonly notificationType: 'ResourceUpdated'
  readonly projectKey: string
  readonly resource: Reference
  readonly resourceUserProvidedIdentifiers?: UserProvidedIdentifiers
  readonly version: number
  readonly oldVersion: number
  readonly modifiedAt: string
}
export interface SnsDestination {
  readonly type: 'SNS'
  readonly accessKey: string
  readonly accessSecret: string
  readonly topicArn: string
}
export interface SqsDestination {
  readonly type: 'SQS'
  readonly accessKey: string
  readonly accessSecret: string
  readonly queueUrl: string
  readonly region: string
}
export interface Subscription extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly changes: ChangeSubscription[]
  readonly destination: Destination
  readonly key?: string
  readonly messages: MessageSubscription[]
  readonly format: DeliveryFormat
  readonly status: SubscriptionHealthStatus
}
export interface SubscriptionDraft {
  readonly changes?: ChangeSubscription[]
  readonly destination: Destination
  readonly key?: string
  readonly messages?: MessageSubscription[]
  readonly format?: DeliveryFormat
}
export declare type SubscriptionHealthStatus =
  | 'ConfigurationError'
  | 'ConfigurationErrorDeliveryStopped'
  | 'Healthy'
  | 'TemporaryError'
export interface SubscriptionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Subscription[]
}
export interface SubscriptionUpdate {
  readonly version: number
  readonly actions: SubscriptionUpdateAction[]
}
export declare type SubscriptionUpdateAction =
  | SubscriptionChangeDestinationAction
  | SubscriptionSetChangesAction
  | SubscriptionSetKeyAction
  | SubscriptionSetMessagesAction
export interface SubscriptionChangeDestinationAction {
  readonly action: 'changeDestination'
  readonly destination: Destination
}
export interface SubscriptionSetChangesAction {
  readonly action: 'setChanges'
  readonly changes?: ChangeSubscription[]
}
export interface SubscriptionSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface SubscriptionSetMessagesAction {
  readonly action: 'setMessages'
  readonly messages?: MessageSubscription[]
}
//# sourceMappingURL=subscription.d.ts.map
