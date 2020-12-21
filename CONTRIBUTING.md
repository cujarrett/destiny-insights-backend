# Contributing Guide

If you're new to contributing to open source software
[this guide](https://opensource.guide/how-to-contribute/) guide is a great read.

## Developer Setup
Setup and use requires [Git](https://git-scm.com/), [Node JS](https://nodejs.org/en/), and a text
editor such as [VS Code](https://code.visualstudio.com/).

This project is built for the latest Node LTS and npm versions. You can
check your node version with `node -v` and your npm version with `npm -v`.

If you're on a Mac, I'd suggest using [Homebrew](https://brew.sh/) for installing the required
software listed in Setup.

### Cloning & Dependency Installations
```sh
git clone git@github.com:cujarrett/bungie-api-client.git
cd bungie-api-client
npm install
```

### Run Linting
Finds problematic patterns or code that doesn’t adhere to certain style guidelines
```sh
npm run lint
```

### Fix linting errors (automated)
```sh
npm run fix-lint
```

## Bungie API

Bungie's API is fully documented [here](https://bungie-net.github.io/multi/index.html). Information on how to work with Bungie's API
OAuth 2 can be found [here](https://github.com/Bungie-net/api/wiki/OAuth-Documentation).

## App Setup

You'll need to setup your Bungie API Key to be used in this app via [Bungie's Developer site](https://www.bungie.net/developer).
There are some important elements noted for the app to function are.

- `API Key`
- `OAuth client_id`
- `OAuth client_secret`

For my implementation, in the `APP AUTHENTICATION` section I used:

- `OAuth Client Type` as `Confidential`
- `Redirect URL` as the endpoint that Terraform plan outputs plus `/init`, for example: `https://fk64o3bun8.execute-api.us-east-1.amazonaws.com/v1/init`
- `Scope` as `Read your Destiny 2 information (Vault, Inventory, and Vendors), as well as Destiny 1 Vault and Inventory data.`

## AWS Parameter Store

I've elected to use [AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
to persist config between Lambda invocations. I used pathing and `getParametersByPath` intentionally to reduce calls to one to
retrieve all the config. I've used `Type` of `SecureString` and `Standard` for all parameters. My AWS Parameter Store is as follows:

- `/bungie-api-client/API_KEY` - Holding my Bungie `API_KEY`
- `/bungie-api-client/CLIENT_ID` - Holding my Bungie `CLIENT_ID`
- `/bungie-api-client/CLIENT_SECRET` - Holding my Bungie `CLIENT_SECRET`
- `/bungie-api-client/access_token` - Stores the `access_token` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/expires_in` - Stores the `expires_in` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/membership_id` - Stores the `membership_id` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/refresh_expires_in` - Stores the `refresh_expires_in` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/refresh_token` - Stores the `refresh_token` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/token_type` - Stores the `token_type` from the [Bungie Access Token Request](https://github.com/Bungie-net/api/wiki/OAuth-Documentation#access-token-request)
- `/bungie-api-client/gunsmithItemDefinitionsEndpoint` - Stores the last gunsmith item definitions endpoint from Bungie's API manifest
- `/bungie-api-client/lastTokenRefresh` - Stores the timestamp of the last time the auth token was refreshed, this is used in the
  logic to determine if the cached auth can be used or needs to be refreshed

## known-mods.js

To avoid processing the very large JSON each compute I downsampled the normal Bungie manifest for Banshee-44's mods use case. I've
stored this in `known-mods.js`. If you want to recreate this file, you can use get the current raw manifest JSON and downsample it
with this script.

```js
const fs = require("fs")

const text = fs.readFileSync("./input.json","utf8")
const data = JSON.parse(text)

const output = {}
for (const item in data) {
  const name = data[item].displayProperties.name
  const type = data[item].itemTypeAndTierDisplayName

  if(type && type.endsWith("Mod")) {
    output[item] = {
      name,
      type
    }
  }
}

fs.writeFile('./output.json', JSON.stringify(output, null, "  "), (error) => {
  if (error) {
    return console.log(error)
  }
  console.log("Done")
})
```

## Terraform

This project uses [Terraform](https://www.terraform.io/) to create, edit, and delete its infrastructure to [AWS](https://aws.amazon.com/).

### terraform apply

The Terraform in this project require one variable to be passed in. This variable is `parameter-store-bungie-api-client-arn`. Please
note the `/*` at the end of the variable. This is important as the app uses the `getParametersByPath` SDK.

```sh
terraform apply -var 'parameter-store-bungie-api-client-arn=arn:aws:ssm:REDACTED:REDACTED:parameter/bungie-api-client/*'
```

### Lambda resource considerations

The `/vendors-no-cache` requires call and processing of large JSON from Bungie, hence it needs more resources.

```tf
resource "aws_lambda_function" "bungie-api-client" {
  ...
  memory_size   = 512
  ...
}
```
