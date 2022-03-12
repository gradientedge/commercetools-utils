import { BaseResource, CreatedBy, LastModifiedBy } from './common'
export interface Location {
  readonly country: string
  readonly state?: string
}
export interface Zone extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly key?: string
  readonly name: string
  readonly description?: string
  readonly locations: Location[]
}
export interface ZoneDraft {
  readonly key?: string
  readonly name: string
  readonly description?: string
  readonly locations?: Location[]
}
export interface ZonePagedQueryResponse {
  readonly limit: number
  readonly offset: number
  readonly count: number
  readonly total?: number
  readonly results: Zone[]
}
export interface ZoneReference {
  readonly typeId: 'zone'
  readonly id: string
  readonly obj?: Zone
}
export interface ZoneResourceIdentifier {
  readonly typeId: 'zone'
  readonly id?: string
  readonly key?: string
}
export interface ZoneUpdate {
  readonly version: number
  readonly actions: ZoneUpdateAction[]
}
export declare type ZoneUpdateAction =
  | ZoneAddLocationAction
  | ZoneChangeNameAction
  | ZoneRemoveLocationAction
  | ZoneSetDescriptionAction
  | ZoneSetKeyAction
export interface ZoneAddLocationAction {
  readonly action: 'addLocation'
  readonly location: Location
}
export interface ZoneChangeNameAction {
  readonly action: 'changeName'
  readonly name: string
}
export interface ZoneRemoveLocationAction {
  readonly action: 'removeLocation'
  readonly location: Location
}
export interface ZoneSetDescriptionAction {
  readonly action: 'setDescription'
  readonly description?: string
}
export interface ZoneSetKeyAction {
  readonly action: 'setKey'
  readonly key?: string
}
//# sourceMappingURL=zone.d.ts.map
