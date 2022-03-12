import { BaseResource, CreatedBy, LastModifiedBy } from './common'
export interface CustomObject extends BaseResource {
  readonly id: string
  readonly version: number
  readonly createdAt: string
  readonly lastModifiedAt: string
  readonly lastModifiedBy?: LastModifiedBy
  readonly createdBy?: CreatedBy
  readonly container: string
  readonly key: string
  readonly value: any
}
export interface CustomObjectDraft {
  readonly container: string
  readonly key: string
  readonly value: any
  readonly version?: number
}
export interface CustomObjectPagedQueryResponse {
  readonly limit: number
  readonly count: number
  readonly total?: number
  readonly offset: number
  readonly results: CustomObject[]
}
export interface CustomObjectReference {
  readonly typeId: 'key-value-document'
  readonly id: string
  readonly obj?: CustomObject
}
//# sourceMappingURL=custom-object.d.ts.map
