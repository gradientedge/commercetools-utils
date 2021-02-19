import { CommercetoolsGrantResponse, CommercetoolsRefreshGrantResponse } from './types'
import { scopeRequestStringToArray } from './scopes'

export class CommercetoolsGrant {
  public accessToken = ''
  public refreshToken = ''
  public expiresIn = 0
  public expiresAt = new Date()
  public scopes: string[] = []

  constructor(data: CommercetoolsGrantResponse | CommercetoolsRefreshGrantResponse) {
    this.initialise(data)

    if ('refresh_token' in data) {
      this.refreshToken = data.refresh_token
    }
  }

  public expiresWithin(refreshIfWithinSecs: number) {
    const cutoff = new Date().getTime() + refreshIfWithinSecs * 1000
    return this.expiresAt.getTime() < cutoff
  }

  refresh(data: CommercetoolsRefreshGrantResponse) {
    this.initialise(data)
  }

  initialise(data: CommercetoolsGrantResponse | CommercetoolsRefreshGrantResponse) {
    this.accessToken = data.access_token
    this.expiresIn = data.expires_in
    this.expiresAt = new Date(new Date().getTime() + 1000 * data.expires_in)
    this.scopes = scopeRequestStringToArray(data.scope)
  }
}
