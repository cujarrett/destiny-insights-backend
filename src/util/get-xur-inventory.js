const fetch = require("node-fetch")
const cachedExotics = require("../data/cached-exotics.json")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("./get-inventory-item-definition-endpoint.js")
const { getManifest } = require("./get-manifest")
const { isBungieApiDownForMaintenance } = require("./is-bungie-api-down-for-maintenance.js")

let manifest
let manifestRetries
let itemDefinitions
let inventoryItemDefinitionEndpoint

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

module.exports.getXurInventory = async (auth) => {
  console.log("getXurInventory called")
  const { accessToken, apiKey } = auth
  const options = {
    "method": "get",
    "headers": {
      "Authorization": `Bearer ${accessToken}`,
      "X-API-Key": apiKey
    }
  }

  // eslint-disable-next-line max-len
  const xurItemDefinitionsEndpoint = "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/2190858386/?components=304,402"
  let xurDataResponse = await fetch(xurItemDefinitionsEndpoint, options)
  let isValidAuth = xurDataResponse.status === 200

  const maxRetries = 5
  let authRetries = 0
  if (!isValidAuth) {
    const isBungieApiDownForMaintenanceFlag = await isBungieApiDownForMaintenance(auth)
    if (isBungieApiDownForMaintenanceFlag) {
      // eslint-disable-next-line max-len
      throw new Error("The Bungie API is down for maintenance. Check https://twitter.com/BungieHelp for more info.")
    }

    while (authRetries < maxRetries && !isValidAuth) {
      authRetries += 1
      xurDataResponse = await fetch(xurItemDefinitionsEndpoint, options)
      isValidAuth = xurDataResponse.status === 200
    }

    if (authRetries === maxRetries && !isValidAuth) {
      throw new Error(`The Bungie auth failed to load ${maxRetries} times`)
    }
  }

  const xurData = await xurDataResponse.json()
  const xurSalesData = xurData.Response.sales.data

  const [, weaponKey, ...armorKeys] = Object.keys(xurSalesData)
  armorKeys.pop()
  const inventoryKeys = [weaponKey, ...armorKeys]
  const xurItemComponents = xurData.Response.itemComponents.stats.data

  let usedCachedData = true
  const inventory = []

  const xurHasInventory = inventoryKeys.length > 1
  if (xurHasInventory) {
    for (const key of inventoryKeys) {
      const itemHash = xurSalesData[key].itemHash

      const item = {}
      item.itemHash = itemHash
      if (cachedExotics[itemHash]) {
        item.name = cachedExotics[itemHash].name
        item.type = cachedExotics[itemHash].type
      } else {
        usedCachedData = false
        await getItemDefinitions()
        item.name = itemDefinitions[xurSalesData[key].itemHash].displayProperties.name
        item.type = itemDefinitions[xurSalesData[key].itemHash].itemTypeAndTierDisplayName
      }

      const isArmor = xurItemComponents[key].stats["2996146975"]
      if (isArmor) {
        const mobility = xurItemComponents[key].stats["2996146975"].value
        const resilience = xurItemComponents[key].stats["392767087"].value
        const recovery = xurItemComponents[key].stats["1943323491"].value
        const discipline = xurItemComponents[key].stats["1735777505"].value
        const intellect = xurItemComponents[key].stats["144602215"].value
        const strength = xurItemComponents[key].stats["4244567218"].value
        item.mobility = mobility
        item.resilience = resilience
        item.recovery = recovery
        item.discipline = discipline
        item.intellect = intellect
        item.strength = strength
        item.total = mobility + resilience + recovery + discipline + intellect + strength
      }

      inventory.push(item)
    }
  }

  return {
    inventory,
    authRetries,
    manifestRetries,
    usedCachedData,
    inventoryItemDefinitionEndpoint
  }
}
