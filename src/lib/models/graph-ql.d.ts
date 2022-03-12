export interface GraphQLError {
  readonly message: string
  readonly locations: GraphQLErrorLocation[]
  readonly path: any[]
}
export interface GraphQLErrorLocation {
  readonly line: number
  readonly column: number
}
export interface GraphQLRequest {
  readonly query: string
  readonly operationName?: string
  readonly variables?: GraphQLVariablesMap
}
export interface GraphQLResponse {
  readonly data?: any
  readonly errors?: GraphQLError[]
}
export interface GraphQLVariablesMap {
  [key: string]: any
}
//# sourceMappingURL=graph-ql.d.ts.map
