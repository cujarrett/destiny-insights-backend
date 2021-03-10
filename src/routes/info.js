const fetch = require("node-fetch")

const knownMods = require("../data/known-mods.js")
// eslint-disable-next-line max-len
const { addNewMods, getAuth, getLastUpdated, setLastUpdated, getLastSoldMods, getModSalesInLastYear } = require("../integrations/dynamodb.js")
const getCategories = require("../util/get-categories.js")
const { getLastSoldMessge } = require("../util/get-last-sold-message.js")
const checkIfTokenRefreshNeeded = require("../util/check-if-token-refresh-needed.js")
const refreshToken = require("../util/refresh-token.js")
const { name, version } = require("../../package.json")

module.exports = async (api) => {
  // eslint-disable-next-line no-unused-vars
  api.get("/info", async (request, response) => {
    console.log("/info called")
    response.header("Access-Control-Allow-Origin", "*")
    let auth = await getAuth()
    const isTokenRefreshNeeded = checkIfTokenRefreshNeeded(auth)
    if (isTokenRefreshNeeded) {
      await refreshToken(auth)
      auth = await getAuth()
    }

    const { apiKey, accessToken } = auth
    const options = {
      "method": "get",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "X-API-Key": apiKey
      }
    }

    try {
      // eslint-disable-next-line max-len
      const gunsmithInventoryResponse = await fetch("https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/672118013/?components=300,301,302,304,305,400,401,402", options)

      if (gunsmithInventoryResponse.status !== 200) {
        throw new Error("Auth failed")
      }
      const gunsmithInventory = await gunsmithInventoryResponse.json()
      let rawManifest = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/")
      let manifestData = await rawManifest.json()

      let isValidManifestData = manifestData.Message === "Ok"
      const maxRetries = 5
      let manifestRetries = 0
      if (!isValidManifestData) {
        while (manifestRetries < maxRetries && !isValidManifestData) {
          manifestRetries += 1
          console.log({ manifestRetries })
          rawManifest = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/")
          manifestData = await rawManifest.json()
          isValidManifestData = manifestData.Message === "Ok"
        }

        if (manifestRetries === maxRetries && !isValidManifestData) {
          return { metadata: { error: `The Bungie manifest failed to load ${maxRetries} times` } }
        }
      }
      // eslint-disable-next-line max-len
      const gunsmithItemDefinitionsPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
      const gunsmithItemDefinitionsEndpoint = `https://www.bungie.net${gunsmithItemDefinitionsPath}`
      const categories = gunsmithInventory.Response.categories.data.categories
      const salesData = gunsmithInventory.Response.sales.data
      const [firstCategory, secondCategory] = getCategories(categories)
      const firstModHash = salesData[firstCategory].itemHash
      const secondModHash = salesData[secondCategory].itemHash

      let firstMod = knownMods[firstModHash]
      let secondMod = knownMods[secondModHash]

      let cachedMods = true
      if (!firstMod || !secondMod) {
        cachedMods = false
        const itemDefinitionsResponse = await fetch(gunsmithItemDefinitionsEndpoint)
        const itemDefinitionsText = await itemDefinitionsResponse.text()
        const itemDefinitions = await JSON.parse(itemDefinitionsText)

        firstMod = {
          name: itemDefinitions[firstModHash].displayProperties.name,
          type: itemDefinitions[firstModHash].itemTypeAndTierDisplayName
        }
        secondMod = {
          name: itemDefinitions[secondModHash].displayProperties.name,
          type: itemDefinitions[secondModHash].itemTypeAndTierDisplayName
        }
      }

      let result = undefined

      const [{ mods: lastSoldMods }] = await getLastSoldMods()
      const firstModChanged = firstMod.name !== lastSoldMods[0].name
      const secondModChanged = secondMod.name !== lastSoldMods[1].name

      let lastUpdated = await getLastUpdated()

      if (firstModChanged || secondModChanged) {
        await addNewMods(firstMod, secondMod)
        await setLastUpdated(new Date().toISOString())
        lastUpdated = await getLastUpdated()
      }

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
              itemHash: firstModHash,
              type: firstMod.type,
              lastSold: firstModLastSoldDate,
              timesSoldInLastYear: firstModTimesSoldInLastYear
            },
            {
              name: secondMod.name,
              itemHash: secondModHash,
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
          lastTokenRefresh: auth.lastTokenRefresh,
          cachedAuth: !isTokenRefreshNeeded,
          cachedMods,
          manifestRetries,
          gunsmithItemDefinitionsEndpoint
        }
      }

      console.log(`completing request

${JSON.stringify(result, null, "  ")}`)
      return JSON.stringify(result, null, "  ")
    } catch (error) {
      console.log(error)
      return { metadata: { error: "An error has occurred" } }
    }
  })
}
