# Testing

Notes related to the coding of tests and test suites. 

## Fake timer strangeness

We use the `nock` package for mocking network calls. This does not play nicely
with Jest's `useFakeTimers` method for mocking the time (which we need to do to
test grant expiry and renewal). Instead of using Jest for mocking timers, we use
the `@sinon/fake-timers` package. This is the same one used by Jest, but by using
it directly we avoid Jest's mocking of `process.nextTick`, which prevents `nock`
from processing network requests (it just waits, and then times out). You can still
use Jest if you really want to, but it gets awkward as you need to return a promise,
then run the timers using say `jest.runAllTimers()` before then awaiting the promise.

Here's an example of using `jest`:

```typescript
jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01T09:35:23.000'))

nock('https://auth.us-east-2.aws.commercetools.com', { encodedQueryParams: true })
  .post('/oauth/token', 'grant_type=client_credentials&scope=view_products%3Atest-project-key')
  .reply(200, { ... })

const auth = new CommercetoolsAuthApi(defaultConfig)
const grantPromise = await auth.getClientGrant()
jest.runAllTimers()  // or jest.runAllTicks()
const grant = await grantPromise

jest.useRealTimers()
```

...and the same using `@sinon/fake-timers`:

```typescript
const clock = FakeTimers.install({ now: new Date('2020-01-01T09:35:23.000') })

nock('https://auth.us-east-2.aws.commercetools.com', { encodedQueryParams: true })
  .post('/oauth/token', 'grant_type=client_credentials&scope=view_products%3Atest-project-key')
  .reply(200, { ... })

const auth = new CommercetoolsAuthApi(defaultConfig)
const grant = await auth.getClientGrant()

clock.uninstall()
```
