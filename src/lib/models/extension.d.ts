import { BaseResource, CreatedBy, LastModifiedBy, Reference } from './common'
export interface Extension extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly destination: ExtensionDestination
  readonly triggers: ExtensionTrigger[]
  readonly timeoutInMs?: number
}
export declare type ExtensionAction = 'Create' | 'Update'
export declare type ExtensionDestination = AWSLambdaDestination | HttpDestination
export interface AWSLambdaDestination {
  readonly type: 'AWSLambda'
  readonly arn: string
  readonly accessKey: string
  readonly accessSecret: string
}
export interface ExtensionDraft {
  readonly key?: string
  readonly destination: ExtensionDestination
  readonly triggers: ExtensionTrigger[]
  readonly timeoutInMs?: number
}
export interface ExtensionInput {
  readonly action: ExtensionAction
  readonly resource: Reference
}
export interface ExtensionPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: Extension[]
}
export declare type ExtensionResourceTypeId = 'cart' | 'customer' | 'order' | 'payment'
export interface ExtensionTrigger {
  readonly resourceTypeId: ExtensionResourceTypeId
  readonly actions: ExtensionAction[]
}
export interface ExtensionUpdate {
  readonly version: number
  readonly actions: ExtensionUpdateAction[]
}
export declare type ExtensionUpdateAction =
  | ExtensionChangeDestinationAction
  | ExtensionChangeTriggersAction
  | ExtensionSetKeyAction
  | ExtensionSetTimeoutInMsAction
export interface HttpDestination {
  readonly type: 'HTTP'
  readonly url: string
  readonly authentication?: HttpDestinationAuthentication
}
export declare type HttpDestinationAuthentication = AuthorizationHeaderAuthentication | AzureFunctionsAuthentication
export interface AuthorizationHeaderAuthentication {
  readonly type: 'AuthorizationHeader'
  readonly headerValue: string
}
export interface AzureFunctionsAuthentication {
  readonly type: 'AzureFunctions'
  readonly key: string
}
export interface ExtensionChangeDestinationAction {
  readonly action: 'changeDestination'
  readonly destination: ExtensionDestination
}
export interface ExtensionChangeTriggersAction {
  readonly action: 'changeTriggers'
  readonly triggers: ExtensionTrigger[]
}
export interface ExtensionSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
export interface ExtensionSetTimeoutInMsAction {
  readonly action: 'setTimeoutInMs'
  readonly timeoutInMs?: number
}
//# sourceMappingURL=extension.d.ts.map
