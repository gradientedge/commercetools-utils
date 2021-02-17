import { CommercetoolsAccessTokenResponse, CommercetoolsRefreshTokenResponse } from './types'
import { scopeRequestStringToArray } from './scopes'

export class Grant {
  public accessToken: string
  public refreshToken: string = ''
  public expiresIn: number
  public expiresAt: Date
  public scopes: string[]

  constructor(data: CommercetoolsAccessTokenResponse | CommercetoolsRefreshTokenResponse) {
    this.accessToken = data.access_token
    this.expiresIn = data.expires_in
    this.expiresAt = new Date(new Date().getTime() + 1000 * data.expires_in)
    this.scopes = scopeRequestStringToArray(data.scope)

    if ('refresh_token' in data) {
      this.refreshToken = data.refresh_token
    }
  }

  public expiresWithin(refreshIfWithinSecs: number) {
    const cutoff = new Date().getTime() - refreshIfWithinSecs * 1000
    return this.expiresAt.getTime() > cutoff
  }

  getRefreshToken() {
    return this.refreshToken
  }

  refresh(data: CommercetoolsRefreshTokenResponse) {}
}
