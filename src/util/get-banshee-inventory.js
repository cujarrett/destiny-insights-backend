const fetch = require("node-fetch")

module.exports.getBansheeInventory = async (auth) => {
  console.log("getBansheeInventory called")
  const { accessToken, apiKey } = auth
  const options = {
    "method": "get",
    "headers": {
      "Authorization": `Bearer ${accessToken}`,
      "X-API-Key": apiKey
    }
  }

  // eslint-disable-next-line max-len
  const bansheeItemDefinitionsEndpoint = "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/672118013/?components=300,301,302,304,305,400,401,402"
  let bansheeInventoryResponse = await fetch(bansheeItemDefinitionsEndpoint, options)
  let bansheeInventory = await bansheeInventoryResponse.json()

  let isValidAuth = bansheeInventoryResponse.status === 200
  const maxRetries = 5
  let authRetries = 0
  if (!isValidAuth) {
    while (authRetries < maxRetries && !isValidAuth) {
      authRetries += 1
      console.log({ authRetries })
      bansheeInventoryResponse = await fetch(bansheeItemDefinitionsEndpoint, options)
      bansheeInventory = await bansheeInventoryResponse.json()
      isValidAuth = bansheeInventoryResponse.status === 200
    }

    if (authRetries === maxRetries && !isValidAuth) {
      return { getBansheeInventoryError: `The Bungie auth failed to load ${maxRetries} times` }
    }
  }
  const categoryData = bansheeInventory.Response.categories.data.categories
  const salesData = bansheeInventory.Response.sales.data
  return { categoryData, salesData, authRetries }
}
