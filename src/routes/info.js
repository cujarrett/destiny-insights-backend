const { getBansheeInventory } = require ("../util/get-banshee-inventory.js")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require ("../util/get-inventory-item-definition-endpoint.js")
const { getCategories } = require("../util/get-categories.js")
const { getLastSoldMessge } = require("../util/get-last-sold-message.js")
const { getManifest } = require ("../util/get-manifest.js")
const { getMods } = require ("../util/get-mods.js")
const { getValidAuth } = require("../util/get-valid-auth.js")
const { processLastUpdated } = require ("../util/process-last-updated.js")
const { getModSalesInLastYear } = require("../integrations/dynamodb.js")
const { name, version } = require("../../package.json")

module.exports = async (api) => {
  // eslint-disable-next-line no-unused-vars
  api.get("/info", async (request, response) => {
    console.log("/info called")
    response.header("Access-Control-Allow-Origin", "*")
    let categoryData
    let salesData
    let authRetries
    let manifest
    let manifestRetries

    const { auth, isTokenRefreshNeeded, lastTokenRefresh } = await getValidAuth()

    try {
      const bansheeInventory = await getBansheeInventory(auth)
      categoryData = bansheeInventory.categoryData
      salesData = bansheeInventory.salesData
      authRetries = bansheeInventory.authRetries
    } catch (error) {
      const result = { metadata: { error } }
      console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
      return JSON.stringify(result, null, "  ")
    }

    try {
      const manifestResponse = await getManifest()
      manifest = manifestResponse.manifest
      manifestRetries = manifestResponse.manifestRetries
    } catch (error) {
      const result = { metadata: { error } }
      console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
      return JSON.stringify(result, null, "  ")
    }

    const inventoryItemDefinitionEndpoint = await getInventoryItemDefinitionEndpoint(manifest)
    const categories = getCategories(categoryData)
    const modData = await getMods(salesData, categories, inventoryItemDefinitionEndpoint)
    const { firstMod, secondMod, usedCachedMods } = modData
    const lastUpdated = await processLastUpdated(firstMod, secondMod)
    const firstModSales = await getModSalesInLastYear(firstMod.name)
    const secondModSales = await getModSalesInLastYear(secondMod.name)
    const firstModLastSoldDate = getLastSoldMessge(firstModSales)
    const secondModLastSoldDate = getLastSoldMessge(secondModSales)
    const firstModTimesSoldInLastYear = firstModSales.length
    const secondModTimesSoldInLastYear = secondModSales.length

    const result = {
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
        usedCachedAuth: !isTokenRefreshNeeded,
        usedCachedMods,
        authRetries,
        manifestRetries,
        inventoryItemDefinitionEndpoint
      }
    }

    console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
    return JSON.stringify(result, null, "  ")
  })
}
