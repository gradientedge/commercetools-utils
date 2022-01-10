[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Gradient Edge commercetools utils

An easy-to-use toolkit for working with the commercetools HTTP API:
https://docs.commercetools.com/api/

**Please note:** this API is being built out bit by bit. If you're looking to use a method
that doesn't appear to exist, please either raise an issue or feel free to make the change
yourself and raise a PR 👍

See full documentation here: [API documentation](https://gradientedge.github.io/commercetools-utils/).

## How does this compare to the official commercetools SDK?

We think it's easier to use and less verbose. On the flip side, the 
[official commercetools SDK](https://github.com/commercetools/commercetools-sdk-typescript) is
more flexible and certainly more complete and up to date.

## Installation

Simply install the `@gradientedge/commercetools-utils` package using your package manager, e.g.:

```shell
npm install --save @gradientedge/commercetools-utils
```

## Code examples

For clarity, we use the term **grant** to describe the object that holds the access token,
refresh token, scope and expiry details.

### Creating a client grant

```typescript
import { Region, CommercetoolsAuth, CommercetoolsGrant } from '@gradientedge/commercetools-utils'

async function example() {
  const auth = new CommercetoolsAuth({
    projectKey: 'your-project-key',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    region: Region.EUROPE_GCP,
    clientScopes: ['create_anonymous_token']
  })

  let grant: CommercetoolsGrant

  try {
    const grant = await auth.getClientGrant()
    console.log('Grant:', grant)
  } catch (error) {
    // 'error' will likely be an instance of CommercetoolsError.
    // See the API for full details.
    console.error(error)
    throw error
  }
}

example()
```

### Logging in a customer

```typescript
import { Region, CommercetoolsAuth, CommercetoolsGrant } from '@gradientedge/commercetools-utils'

async function example() {
  const auth = new CommercetoolsAuth({
    projectKey: 'your-project-key',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    region: Region.EUROPE_GCP,
    clientScopes: ['create_anonymous_token']
  })

  let grant: CommercetoolsGrant

  try {
    const grant = await auth.login({
      username: 'myUsername',
      password: 'myPassword'
    })
    console.log('Grant:', grant)
  } catch (error) {
    console.error(error)
    throw error
  }
}

example()
```

Note that the `getClientGrant` method here could be swapped out for say, `login`, in order to login a customer.
There is no need to call `getClientGrant` before calling `login`. Ensuring that there's an active client grant
will be taken care of by the `CommercetoolsAuth` class.

### Get an anonymous customer grant

```typescript
import { Region, CommercetoolsAuth, CommercetoolsGrant } from '@gradientedge/commercetools-utils'

async function example() {
  const auth = new CommercetoolsAuth({
    projectKey: 'your-project-key',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    region: Region.EUROPE_GCP,
    clientScopes: ['create_anonymous_token']
  })

  let grant: CommercetoolsGrant

  try {
    const grant = await auth.getAnonymousGrant()
    console.log('Grant:', grant)
  } catch (error) {
    console.error(error)
    throw error
  }
}

example()
```

### Refresh an existing customer grant

The code below demonstrates how we can call the `refreshCustomerGrant` method with the `refreshToken` of an
existing grant. Realistically, that grant would probably have come from something like a JWT that was passed
to your back-end server by your UI.

```typescript
import { Region, CommercetoolsAuth, CommercetoolsGrant } from '@gradientedge/commercetools-utils'

async function example() {
  const auth = new CommercetoolsAuth({
    projectKey: 'your-project-key',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    region: Region.EUROPE_GCP,
    clientScopes: ['create_anonymous_token']
  })

  let grant: CommercetoolsGrant

  try {
    const grant = await auth.login({
      username: 'myUsername',
      password: 'myPassword'
    })
    console.log('Grant:', grant)
  } catch (error) {
    console.error(error)
    throw error
  }

  // The 'grant' would have been
  const refreshToken = grant.refreshToken
  try {
    const grant = await auth.refreshCustomerGrant(refreshToken)
    console.log('Refreshed grant:', grant)
  } catch (error) {
    console.error(error)
    throw error
  }
}

example()
```
