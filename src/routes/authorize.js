const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))
const { getAuth, setAuth } = require("../integrations/dynamodb.js")

module.exports = async (api) => {
  api.get("/authorize", async (request, response) => {
    try {
      console.log("/authorize called")
      const { apiKey, clientId, clientSecret } = await getAuth()
      const code = request.query.code
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      const options = {
        "method": "post",
        "headers": {
          "Authorization": `Basic ${basicAuth}`,
          "X-API-Key": apiKey,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "body": `client_id=${clientId}&grant_type=authorization_code&code=${code}`
      }

      const rawResponse = await fetch("https://www.bungie.net/Platform/App/OAuth/Token/", options)
      const newToken = await rawResponse.json()

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
      response.redirect("https://github.com/cujarrett/destiny-insights-backend#use")
    } catch (error) {
      console.log(error)
    }
  })
}
