const fetch = require("node-fetch")
const cachedMods = require("../data/cached-mods.json")
// eslint-disable-next-line max-len
const { addMod, getLastSoldAda1Mods, getModSalesInLastYear } = require("../integrations/dynamodb.js")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require ("./get-inventory-item-definition-endpoint.js")
const { getLastSoldMessge } = require("./get-last-sold-message.js")
const { getManifest } = require ("./get-manifest.js")
const { isBungieApiDownForMaintenance } = require("./is-bungie-api-down-for-maintenance.js")
const { isNewInventory } = require ("./is-new-inventory.js")
const { isSameInventory } = require ("./is-same-inventory.js")

module.exports.getAda1Inventory = async (auth) => {
  console.log("getAda1Inventory called")
  let manifest
  let manifestRetries
  let itemDefinitions
  let inventoryItemDefinitionEndpoint
  let usedCachedData = true
  const maxAuthRetries = 5
  let authRetries = 0

  const getCurrentAda1Mods = async () => {
    console.log("getCurrentAda1Mods called")
    const { accessToken, apiKey } = auth
    const options = {
      "method": "get",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "X-API-Key": apiKey
      }
    }

    // eslint-disable-next-line max-len
    const adaItemDefinitionsEndpoint = "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/350061650/?components=300,301,302,304,305,400,401,402"
    let adaInventoryResponse = await fetch(adaItemDefinitionsEndpoint, options)

    let isValidAuth = adaInventoryResponse.status === 200
    if (!isValidAuth) {
      const isBungieApiDownForMaintenanceFlag = await isBungieApiDownForMaintenance(auth)
      if (isBungieApiDownForMaintenanceFlag) {
        // eslint-disable-next-line max-len
        throw new Error("The Bungie API is down for maintenance. Check https://twitter.com/BungieHelp for more info.")
      }

      while (authRetries < maxAuthRetries && !isValidAuth) {
        authRetries += 1
        adaInventoryResponse = await fetch(adaItemDefinitionsEndpoint, options)
        isValidAuth = adaInventoryResponse.status === 200
      }

      if (authRetries === maxAuthRetries && !isValidAuth) {
        throw new Error(`The Bungie auth failed to load ${maxAuthRetries} times`)
      }
    }

    const adaInventory = await adaInventoryResponse.json()
    const categoryData = adaInventory.Response.categories.data.categories
    const salesData = adaInventory.Response.sales.data

    const getItemDefinitions = async () => {
      console.log("getItemDefinitions called")
      if (itemDefinitions === undefined) {
        try {
          const manifestResponse = await getManifest()
          manifest = manifestResponse.manifest
          manifestRetries = manifestResponse.manifestRetries
        } catch (error) {
          const result = { metadata: { error } }
          console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
          return JSON.stringify(result, null, "  ")
        }

        inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
        const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
        itemDefinitions = await itemDefinitionsResponse.json()
      }
      return itemDefinitions
    }

    // Get categories for weapon mods for sale
    const [firstModCategory, secondModCategory] = categoryData[1].itemIndexes
    const categories = [firstModCategory, secondModCategory]

    const currentMods = []
    for (const category of categories) {
      const itemHash = salesData[category].itemHash
      let mod = cachedMods[itemHash]

      if (mod === undefined) {
        usedCachedData = false
        mod = {}
        await getItemDefinitions()
        mod.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        mod.name = itemDefinitions[itemHash].displayProperties.name
      }

      mod.itemHash = itemHash
      currentMods.push(mod)
    }
    return currentMods
  }

  const currentMods = await getCurrentAda1Mods()
  const lastSoldMods = await getLastSoldAda1Mods()
  const newInventory = await isNewInventory(currentMods, lastSoldMods)

  let lastUpdated = undefined
  if (newInventory) {
    const doubleCheckedMods = await getCurrentAda1Mods()
    const confirmedNewMods = await isSameInventory(currentMods, doubleCheckedMods)
    if (confirmedNewMods) {
      const timestamp = new Date().toISOString()
      for (const mod of currentMods) {
        await addMod(mod, timestamp)
      }
      lastUpdated = timestamp
    } else {
      lastUpdated = lastSoldMods[lastSoldMods.length - 1].timestamp
    }
  } else {
    lastUpdated = lastSoldMods[lastSoldMods.length - 1].timestamp
  }

  const currentItems = []
  for (const mod of currentMods) {
    const modSales = await getModSalesInLastYear(mod)
    const lastSold = getLastSoldMessge(modSales)
    currentItems.push({
      name: mod.name,
      itemHash: mod.itemHash,
      type: mod.type,
      lastSold,
      timesSoldInLastYear: modSales.length
    })
  }

  return {
    inventory: currentItems,
    lastUpdated,
    authRetries,
    manifestRetries,
    usedCachedData,
    inventoryItemDefinitionEndpoint
  }
}
