# Contributing Guide

If you're new to contributing to open source software
[this guide](https://opensource.guide/how-to-contribute/) guide is a great read.

## Not sure where to start?

A great place to jump in are issues labeled [Beginner Friendly](https://github.com/cujarrett/destiny-insights-backend/labels/Beginner%20Friendly).

## Chat

Feel free to join the [Destiny Insights Backend Discord](https://discord.gg/9jbXdyU6JT) if you have questions.

## Pull Request Checklist

- [ ] - Documentation is updated if needed
- [ ] - Passing CI pipeline

## What's the tech stack?

This project uses [Node.js](https://nodejs.org/en/) as my language of choice. I'm using [AWS](https://aws.amazon.com/) for my infrastructure. I'm using [Terraform](https://www.terraform.io/) for my
[Infrastructure as Code (IaC)](https://en.wikipedia.org/wiki/Infrastructure_as_code) and if I wanted to have this deployed I'd do so with
[Terraform Cloud](https://www.terraform.io/docs/cloud/overview.html) to provision my infrastructure,
either on demand or in response to various events.

I'm leveraging compute via [AWS Lambda](https://aws.amazon.com/lambda/) for all of the benefits of having a serverless architecture.

I'm using [AWS API Gateway](https://aws.amazon.com/api-gateway/) to create our RESTful API. API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring, and API version management.

I'm using [AWS DynamoDB](https://aws.amazon.com/dynamodb/) to persist the OAuth 2 bearer token and other app configuration, state data, and app data such as mods.
I'm using [lambda-api](https://github.com/jeremydaly/lambda-api) which offers a simple and lightweight solution that will look familiar to anyone that has spent time with [Express](https://github.com/expressjs/express). Building a solution with `lambda-api` provides a single dependency solution that is tiny at 28 kB. [I've written a short post if you want more info on this useful package](https://dev.to/cujarrett/build-an-express-like-app-on-aws-lambda-12g6).

## Backend endpoints

### `/init`

This endpoint serves as the trigger to authenticate the backend. It uses OAuth 2 to authenticate to a number of different providers that Bungie offers such as Steam. This endpoint simply redirects to `https://www.bungie.net/en/oauth/authorize?client_id=${CLIENT_ID}&response_type=code`.

### `/authorize`

This endpoint serves as a callback after the user has authenticated via with the third party (such as Steam), it captures a `code` from Bungie via the URL query parameter. This code along with some API config are used to make a call to `POST` `https://www.bungie.net/Platform/App/OAuth/Token/`.

This call to Bungie returns a response with `access_token`, `token_type`, `expires_in`, `refresh_expires_in`, `membership_id`, and `refresh_token`. All of which are used in calls to Bungie's API for data or to effect items.

## Developer Setup
Setup and use requires [Git](https://git-scm.com/), [Node JS](https://nodejs.org/en/), and a text
editor such as [VS Code](https://code.visualstudio.com/).

This project is built for the latest Node LTS and npm versions. You can
check your node version with `node -v` and your npm version with `npm -v`.

If you're on a Mac, I'd suggest using [Homebrew](https://brew.sh/) for installing the required
software listed in Setup.

### Cloning & Dependency Installations
```sh
git clone git@github.com:cujarrett/destiny-insights-backend.git
cd destiny-insights-backend
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

### Destiny Component Type Info

[Destiny Component Type Info](https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html#schema_Destiny-DestinyComponentType)

### Debugging Bungie API Item Hashs

[data.destinysets.com](https://data.destinysets.com/?) is pretty great for debugging `itemHash` issues.

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

## Persisting Auth

I'm using AWS DynamoDB to persist auth and config. The structure of that table is:

```js
{
  "app": {
    "S": "destiny-insights-backend"
  },
  "lastTokenRefresh": {
    "S": "2021-03-07T07:03:42.420Z"
  },
  "apiKey": {
    "S": ""
  },
  "refreshExpiresIn": {
    "N": ""
  },
  "clientSecret": {
    "S": ""
  },
  "tokenType": {
    "S": ""
  },
  "expiresIn": {
    "N": ""
  },
  "refreshToken": {
    "S": ""
  },
  "clientId": {
    "S": ""
  },
  "accessToken": {
    "S": ""
  },
  "membershipId": {
    "S": ""
  }
}
```

## Persisting lastUpdated

I'm using AWS DynamoDB to persist auth and config. The structure of that table is:

```js
{
  "app": {
    "S": "destiny-insights-backend"
  },
  "lastUpdated": {
    "S": "2021-03-07T04:51:16.805Z"
  }
}
```

## cached-mods.json

To avoid processing the very large JSON each compute I downsampled the normal
Bungie manifest. I've stored this in `cached-mods.json`. If you want to recreate
this file, you can use get the current raw manifest JSON and downsample it with
this script.

```sh
npm run build-cached-mods
```

## Terraform

This project uses [Terraform](https://www.terraform.io/) to create, edit, and delete its infrastructure to [AWS](https://aws.amazon.com/).

### terraform apply

The Terraform in this project requires variables.

- acm-certificate-arn`: `arn:aws:acm:REDACTED:REDACTED:certificate/REDACTED`

### Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) specification to
aid in automated releases and change log generation. [Commitlint](https://github.com/conventional-changelog/commitlint)
is enabled and ran as a `commit-msg` hook to enforce the commit format.
[Commitizen](http://commitizen.github.io/cz-cli/) can be used to prompt through any requirements at commit time
`npm run commit` (or `git cz` if Commitizen is installed globally).

In short, if a commit will be fixing a bug, prefix the commit message with `fix:`

```sh
fix: my bug fix
```

```sh
feat: my new feature
```

Commits with `fix:` prefix will show up in the generated changelog as bullets under the `Bug Fixes:` section, and
`feat:` prefixed messages will show under the `Features:` section. For more on the available prefixes/rules, see
[here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules).
