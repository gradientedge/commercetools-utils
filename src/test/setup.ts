import 'jest-matcher-specific-error'
import nock from 'nock'

process.env.GECTU_IS_BROWSER = '0'

nock.disableNetConnect()
