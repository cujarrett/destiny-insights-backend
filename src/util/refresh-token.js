const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))
const { setAuth } = require("../integrations/dynamodb.js")

module.exports.refreshToken = async (auth) => {
  console.log("refreshToken called")
  const { apiKey, clientId, clientSecret, refreshToken } = auth
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const options = {
    "method": "post",
    "headers": {
      "Authorization": `Basic ${basicAuth}`,
      "X-API-Key": apiKey,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": `client_id=${clientId}&grant_type=refresh_token&refresh_token=${refreshToken}`
  }
  const rawResponse = await fetch("https://www.bungie.net/Platform/App/OAuth/Token/", options)
  const newToken = await rawResponse.json()
  if (newToken.error) {
    // eslint-disable-next-line max-len
    throw new Error("The Bungie API is down for maintenance. Check https://twitter.com/BungieHelp for more info.")
  } else {
    const newAuth = {
      lastTokenRefresh: new Date().toISOString(),
      accessToken: newToken.access_token,
      tokenType: newToken.token_type,
      expiresIn: newToken.expires_in,
      refreshExpiresIn: newToken.refresh_expires_in,
      membershipId: newToken.membership_id,
      refreshToken: newToken.refresh_token
    }
    await setAuth(newAuth)
  }
}
