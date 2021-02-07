export interface CommercetoolsAuthConfig {
  projectKey: string
  clientId: string
  clientSecret: string
  baseAuthUrl: string
  baseRestApiUrl: string
  clientScopes?: string[]
  customerScopes?: string[]
  timeout?: number
  refreshIfWithinSecs?: number
  logger?: {
    debug: (...args: any) => void
    info: (...args: any) => void
    error: (...args: any) => void
  }
}

export interface CommercetoolsTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
}

export interface RefreshedAccessToken {
  accessToken: string
  expiresIn: number
  expiresAt: Date
  scopes: string[]
}

export interface AccessToken extends RefreshedAccessToken {
  refreshToken: string
}

export interface LoginOptions {
  username: string
  password: string
  scopes: string[]
}

export interface AnonymousTokenOptions {
  scopes: string[]
}

export enum GrantType {
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password'
}
