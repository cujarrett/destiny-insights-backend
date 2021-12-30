const fetch = require("node-fetch")
const cachedItems = require("../data/cached-items.json")
const cachedMods = require("../data/cached-mods.json")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("./get-inventory-item-definition-endpoint.js")
const { getManifest } = require("./get-manifest.js")
const { getValidAuth } = require("../util/get-valid-auth.js")
const { isBungieApiDownForMaintenance } = require("./is-bungie-api-down-for-maintenance.js")
const { name } = require("../../package.json")

const characterClasses = {
  titan: "2305843009300765518",
  hunter: "2305843009299499863",
  warlock: "2305843009299499865"
}

let manifest
let itemDefinitions

const getItemDefinitions = async () => {
  console.log("getItemDefinitions called")
  if (itemDefinitions === undefined) {
    try {
      const manifestResponse = await getManifest()
      manifest = manifestResponse.manifest
    } catch (error) {
      const result = { metadata: { error } }
      return result
    }

    const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
    const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
    itemDefinitions = await itemDefinitionsResponse.json()
  }
  return itemDefinitions
}

module.exports.getVendorInventory = async (vendorHash) => {
  console.log("getVendorInventory called")
  const { auth, isTokenRefreshNeeded } = await getValidAuth()
  const { accessToken, apiKey } = auth
  const options = {
    "method": "get",
    "headers": {
      "Authorization": `Bearer ${accessToken}`,
      "X-API-Key": apiKey
    }
  }

  const isBungieApiDownForMaintenanceFlag = await isBungieApiDownForMaintenance(auth)
  if (isBungieApiDownForMaintenanceFlag) {
    // eslint-disable-next-line max-len
    throw new Error("The Bungie API is down for maintenance. Check https://twitter.com/BungieHelp for more info.")
  }

  let usedCachedData = true
  const inventory = {
    armor: [],
    weapons: [],
    mods: []
  }

  for (const [className, value] of Object.entries(characterClasses)) {
    // eslint-disable-next-line max-len
    const vendorItemDefinitionsEndpoint = `https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/${value}/Vendors/${vendorHash}/?components=304,310,402`
    const vendorResponse = await fetch(vendorItemDefinitionsEndpoint, options)
    const vendorData = await vendorResponse.json()
    const { Message: message } = vendorData

    if (message === "The Vendor you requested was not found.") {
      return {
        inventory: [],
        metadata: {
          name,
          now: new Date().toISOString(),
          usedCacheAuth: !isTokenRefreshNeeded,
          usedCachedData
        }
      }
    }

    const vendorSalesData = vendorData.Response.sales.data
    const vendorArmorStats = vendorData.Response.itemComponents.stats.data
    const vendorWeaponPerks = vendorData.Response.itemComponents.reusablePlugs.data

    for (const key of Object.keys(vendorSalesData)) {
      const isArmor = vendorArmorStats[key]?.stats["2996146975"]
      const isMod = vendorSalesData[key].costs[0]?.itemHash === 4046539562
      const isWeapon = vendorWeaponPerks[key]?.plugs["1"]?.[0].plugItemHash

      const itemHash = vendorSalesData[key].itemHash
      if (isArmor) {
        const armor = {}
        armor.itemHash = itemHash
        armor.class = className

        if (cachedItems[itemHash]) {
          armor.name = cachedItems[itemHash].name
          armor.type = cachedItems[itemHash].type
        } else {
          usedCachedData = false
          await getItemDefinitions()
          armor.name = itemDefinitions[vendorSalesData[key].itemHash].displayProperties.name
          armor.type = itemDefinitions[vendorSalesData[key].itemHash].itemTypeAndTierDisplayName
        }

        const mobility = vendorArmorStats[key].stats["2996146975"].value
        const resilience = vendorArmorStats[key].stats["392767087"].value
        const recovery = vendorArmorStats[key].stats["1943323491"].value
        const discipline = vendorArmorStats[key].stats["1735777505"].value
        const intellect = vendorArmorStats[key].stats["144602215"].value
        const strength = vendorArmorStats[key].stats["4244567218"].value
        armor.mobility = mobility
        armor.resilience = resilience
        armor.recovery = recovery
        armor.discipline = discipline
        armor.intellect = intellect
        armor.strength = strength
        armor.total = mobility + resilience + recovery + discipline + intellect + strength
        inventory.armor.push(armor)
      } else if (isMod && className === "titan") {
        const mod = {}
        if (cachedMods[itemHash]) {
          mod.name = cachedMods[itemHash].name
          mod.type = cachedMods[itemHash].type
        } else {
          usedCachedData = false
          await getItemDefinitions()
          mod.name = itemDefinitions[itemHash].displayProperties.name
          mod.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        }

        mod.itemHash = itemHash
        inventory.mods.push(mod)
      } else if (isWeapon && className === "titan") {
        const weapon = {}
        if (cachedItems[itemHash]) {
          weapon.name = cachedItems[itemHash].name
          weapon.type = cachedItems[itemHash].type
        } else {
          usedCachedData = false
          await getItemDefinitions()
          weapon.name = itemDefinitions[itemHash].displayProperties.name
          weapon.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        }

        const perk1 = vendorWeaponPerks[key].plugs["1"][0].plugItemHash
        const perk2 = vendorWeaponPerks[key].plugs["1"][1].plugItemHash
        const perk3 = vendorWeaponPerks[key].plugs["2"][0].plugItemHash
        const perk4 = vendorWeaponPerks[key].plugs["2"][1].plugItemHash
        const perk5 = vendorWeaponPerks[key].plugs["3"][0].plugItemHash
        const perk6 = vendorWeaponPerks[key].plugs["4"][0].plugItemHash

        // eslint-disable-next-line max-len
        if (cachedItems[perk1] && cachedItems[perk2] && cachedItems[perk3] && cachedItems[perk4] && cachedItems[perk5] && cachedItems[perk6]) {
          weapon.perks = [
            cachedItems[perk1].name,
            cachedItems[perk2].name,
            cachedItems[perk3].name,
            cachedItems[perk4].name,
            cachedItems[perk5].name,
            cachedItems[perk6].name
          ]
        } else {
          usedCachedData = false
          await getItemDefinitions()
          weapon.perks = [
            itemDefinitions[perk1].displayProperties.name,
            itemDefinitions[perk2].displayProperties.name,
            itemDefinitions[perk3].displayProperties.name,
            itemDefinitions[perk4].displayProperties.name,
            itemDefinitions[perk5].displayProperties.name,
            itemDefinitions[perk6].displayProperties.name2
          ]
        }

        weapon.itemHash = itemHash
        inventory.weapons.push(weapon)
      }
    }
  }

  return {
    inventory,
    metadata: {
      name,
      now: new Date().toISOString(),
      usedCacheAuth: !isTokenRefreshNeeded,
      usedCachedData
    }
  }
}
