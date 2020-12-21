## What

It's an implementation of interacting with [Bungie's OAuth 2 API](https://github.com/Bungie-net/api), specifically the portion of the API dealing with Banshee-44's mod inventory. This was done to learn and build out a backend for my serverless Twitter [banshee-44-mods-bot](https://github.com/cujarrett/banshee-44-mods-bot).

## How's it work?

This project serves as a backend. It offers a handful of endpoints detailed below.

### `/init`

This endpoint serves as the trigger to authenticate the backend. It uses OAuth 2 to authenticate to a number of different providers that Bungie offers such as Steam. This endpoint simply redirects to `https://www.bungie.net/en/oauth/authorize?client_id=${CLIENT_ID}&response_type=code`.

### `/authorize`

This endpoint serves as a callback after the user has authenticated via with the third party (such as Steam), it captures a `code` from Bungie via the URL query parameter. This code along with some API config are used to make a call to `POST` `https://www.bungie.net/Platform/App/OAuth/Token/`.

Call specifics:
```js
const options = {
  "method": "post",
  "headers": {
    "Authorization": `Basic ${auth}`, // auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
    "X-API-Key": API_KEY,
    "Content-Type": "application/x-www-form-urlencoded"
  },
  "body": `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${code}` // code = request.query.code
}
```

This call to Bungie returns a response with `access_token`, `token_type`, `expires_in`, `refresh_expires_in`, `membership_id`, and `refresh_token`. All of which are used in calls to Bungie's API for data or to effect items.

### `/vendors`

This endpoint makes a call to Bungie's API to retrieve Banshee-44's mod inventory for sale. This endpoint is currently `https://www.bungie.net/Platform/Destiny2/3/Profile/REDACTED/Character/REDACTED/Vendors/672118013/?components=300,301,302,304,305,400,401,402`.

Call specifics:
```js
{
  "method": "get",
  "headers": {
    "Authorization": `Bearer ${access_token}`, // comes from /authorize
    "X-API-Key": API_KEY
  }
}
```

To get clear text info out of Bungie's API I make a couple of sequential calls.

`https://www.bungie.net/Platform/Destiny2/Manifest/` returns the English `DestinyInventoryItemDefinition`. From there I use this info to determine the correct manifest to call to get the name and other info about the mods Banshee-44 is selling.

This endpoint leverages the static data in the `known-mods.js` file to save calls and processing time. If the mods for sale are not contained within, further action will be required such as a call to `vendors-no-cache` to get the info and or a manual update to `known-mods.js` to add the missing info.

### `/vendors-no-cache`

This endpoint has the same functionality as `/vendors` but with some changes to how it goes about getting there. It does not leverage any cached mod info. This makes the endpoint more fault tolerant but at the cost to performance impacts to time and additional resource needs resulting in additional infrastructure costs.

## What's the tech stack?

This project uses [Node.js](https://nodejs.org/en/) as my language of choice. I'm using [AWS](https://aws.amazon.com/) for my infrastructure. I'm using [Terraform](https://www.terraform.io/) for my
[Infrastructure as Code (IaC)](https://en.wikipedia.org/wiki/Infrastructure_as_code) and if I wanted to have this deployed I'd do so with
[Terraform Cloud](https://www.terraform.io/docs/cloud/overview.html) to provision my infrastructure,
either on demand or in response to various events.

I'm leveraging compute via [AWS Lambda](https://aws.amazon.com/lambda/) for all of the benefits of having a serverless architecture.

I'm using [AWS API Gateway](https://aws.amazon.com/api-gateway/) to create our RESTful API. API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring, and API version management.

I'm using [AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) to persist the OAuth 2 bearer token and other app configuration and state data.

I'm using [lambda-api](https://github.com/jeremydaly/lambda-api) which offers a simple and lightweight solution that will look familiar to anyone that has spent time with [Express](https://github.com/expressjs/express). Building a solution with `lambda-api` provides a single dependency solution that is tiny at 28 kB. [I've written a short post if you want more info on this useful package](https://dev.to/cujarrett/build-an-express-like-app-on-aws-lambda-12g6).

<p align="center">
  Made with :heart:, JavaScript, and GitHub.
</p>
