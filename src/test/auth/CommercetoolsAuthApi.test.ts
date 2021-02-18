import fetch from 'node-fetch'
import nock from 'nock'
import { CommercetoolsAuth, CommercetoolsAccessTokenResponse, Region } from '../../lib'
import ResolvedValue = jest.ResolvedValue
import { CommercetoolsAuthApi } from '../../lib/auth/CommercetoolsAuthApi'

var FakeTimers = require('@sinonjs/fake-timers')
var clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })

const defaultConfig = {
  projectKey: 'test-project-key',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  region: Region.US_EAST,
  clientScopes: ['defaultClientScope1']
}

const defaultResponseToken: CommercetoolsAccessTokenResponse = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  scope:
    'scope1:test-project-key scope2:test-project-key scope3:test-project-key customer_id:123456',
  expires_in: 172800
}

describe('CommercetoolsAuthApi', () => {
  describe('public methods', () => {
    describe('constructor', () => {
      it('should get a client access token', async () => {
        //nock.recorder.rec()
        nock.disableNetConnect()

        nock('https://auth.us-east-2.aws.commercetools.com:443', { encodedQueryParams: true })
          .post(
            '/oauth/token',
            'grant_type=client_credentials&scope=defaultClientScope1%3Atest-project-key'
          )
          .reply(200, defaultResponseToken)

        console.log(new Date().toISOString())

        const auth = new CommercetoolsAuthApi(defaultConfig)
        const grant = await auth.getClientGrant()

        clock.reset()

        console.log(grant)
      })
    })
  })
})
