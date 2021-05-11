const fetch = require("node-fetch")

module.exports.isBungieApiDownForMaintenance = async (auth) => {
  console.log("isBungieApiDownForMaintenance called")
  const { accessToken, apiKey } = auth
  const options = {
    "method": "get",
    "headers": {
      "Authorization": `Bearer ${accessToken}`,
      "X-API-Key": apiKey
    }
  }

  const settingsEndpoint = "https://www.bungie.net/Platform/Settings/"
  const rawResponse = await fetch(settingsEndpoint, options)
  if (rawResponse.ok) {
    const response = await rawResponse.json()
    const isBungieApiDown = response.ErrorCode !== 1
    const isVendorsDisabled = response.Response.systems.D2Vendors.enabled === false
    return isBungieApiDown || isVendorsDisabled
  } else {
    return false
  }
}
