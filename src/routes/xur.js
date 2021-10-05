const { getValidAuth } = require("../util/get-valid-auth.js")
const { getXurInventory } = require("../util/get-xur-inventory.js")
const { name, version } = require("../../package.json")

module.exports = async (api) => {
  // eslint-disable-next-line no-unused-vars
  api.get("/xur", async (request, response) => {
    console.log("/xur called")
    let result

    try {
      response.header("Access-Control-Allow-Origin", "*")
      const { auth, isTokenRefreshNeeded, lastTokenRefresh } = await getValidAuth()
      const {
        inventory,
        lastUpdated,
        authRetries,
        manifestRetries,
        inventoryItemDefinitionEndpoint,
        usedCachedData } = await getXurInventory(auth)

      result = {
        inventory,
        metadata: {
          name,
          now: new Date().toISOString(),
          lastUpdated,
          lastTokenRefresh,
          usedCachedAuth: !isTokenRefreshNeeded,
          usedCachedData,
          authRetries,
          manifestRetries,
          inventoryItemDefinitionEndpoint
        }
      }
    } catch (error) {
      response.sendStatus(500)
      result = { "error": error.message }
    }

    console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
    return JSON.stringify(result, null, "  ")
  })
}
