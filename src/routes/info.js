const { getBansheeInventory } = require ("../util/get-banshee-inventory.js")
const { getBansheeInventoryEndpoint } = require ("../util/get-banshee-inventory-endpoint.js")
const { getCategories } = require("../util/get-categories.js")
const { getLastSoldMessge } = require("../util/get-last-sold-message.js")
const { getManifestData } = require ("../util/get-manifest-data.js")
const { getMods } = require ("../util/get-mods.js")
const { getValidAuth } = require("../util/get-valid-auth.js")
const { processLastUpdated } = require ("../util/process-last-updated.js")
const { getModSalesInLastYear } = require("../integrations/dynamodb.js")
const { name, version } = require("../../package.json")

module.exports = async (api) => {
  // eslint-disable-next-line no-unused-vars
  api.get("/info", async (request, response) => {
    console.log("/info called")
    let result = {}

    try {
      response.header("Access-Control-Allow-Origin", "*")
      const { auth, isTokenRefreshNeeded, lastTokenRefresh } = await getValidAuth()
      // eslint-disable-next-line max-len
      const { categoryData, salesData, authRetries, getBansheeInventoryError } = await getBansheeInventory(auth)
      if (getBansheeInventoryError) {
        result = { metadata: { error: getBansheeInventoryError } }
        return JSON.stringify(result, null, "  ")
      }

      const { manifestData, manifestRetries, getManifestDataError } = await getManifestData()
      if (getBansheeInventoryError) {
        result = { metadata: { error: getManifestDataError } }
        return JSON.stringify(result, null, "  ")
      }

      const bansheeItemDefinitionsEndpoint = await getBansheeInventoryEndpoint(manifestData)
      const categories = getCategories(categoryData)
      const modData = await getMods(salesData, categories, bansheeItemDefinitionsEndpoint)
      const { firstMod, secondMod, cachedMods } = modData
      const lastUpdated = await processLastUpdated(firstMod, secondMod)
      const firstModSales = await getModSalesInLastYear(firstMod.name)
      const secondModSales = await getModSalesInLastYear(secondMod.name)
      const firstModLastSoldDate = getLastSoldMessge(firstModSales)
      const secondModLastSoldDate = getLastSoldMessge(secondModSales)
      const firstModTimesSoldInLastYear = firstModSales.length
      const secondModTimesSoldInLastYear = secondModSales.length

      result = {
        "inventory": {
          mods: [
            {
              name: firstMod.name,
              itemHash: firstMod.itemHash,
              type: firstMod.type,
              lastSold: firstModLastSoldDate,
              timesSoldInLastYear: firstModTimesSoldInLastYear
            },
            {
              name: secondMod.name,
              itemHash: secondMod.itemHash,
              type: secondMod.type,
              lastSold: secondModLastSoldDate,
              timesSoldInLastYear: secondModTimesSoldInLastYear
            }
          ]
        }, "metadata": {
          name,
          version,
          now: new Date().toISOString(),
          lastUpdated,
          lastTokenRefresh,
          cachedAuth: !isTokenRefreshNeeded,
          cachedMods,
          authRetries,
          manifestRetries,
          bansheeItemDefinitionsEndpoint
        }
      }

      console.log(`completing request

${JSON.stringify(result, null, "  ")}`)
      return JSON.stringify(result, null, "  ")
    } catch (error) {
      console.log(error)
      result = { metadata: { error: "An error has occurred" } }
      return JSON.stringify(result, null, "  ")
    }
  })
}
