const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))
const cachedItems = require("../data/cached-items.json")
const cachedMods = require("../data/cached-mods.json")
const classMapping = require("../data/class-mapping.json")
const cachedWeaponWishLists = require("../data/cached-weapon-wish-lists.json")
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

const isWishList = (wishLists, currentRoll) => {
  for (const wishList of wishLists) {
    const wishListPerks = wishList.perkHashses
    // eslint-disable-next-line max-len
    const isWishListRoll = wishListPerks.every((wishListRollPerk) => currentRoll.includes(wishListRollPerk))
    if (isWishListRoll) {
      return true
    }
  }
  return false
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
    const vendorItemDefinitionsEndpoint = `https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/${value}/Vendors/${vendorHash}/?components=304,305,310,402`
    const vendorResponse = await fetch(vendorItemDefinitionsEndpoint, options)
    const vendorData = await vendorResponse.json()
    const { Message: message } = vendorData

    if (message === "The Vendor you requested was not found.") {
      return {
        inventory: {
          armor: [],
          weapons: [],
          mods: []
        },
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
    const vendorWeaponPlugs = vendorData.Response.itemComponents.reusablePlugs.data
    const vendorWeaponSockets = vendorData.Response.itemComponents.sockets.data

    for (const key of Object.keys(vendorSalesData)) {
      const itemHash = vendorSalesData[key].itemHash
      const isArmor = vendorArmorStats[key]?.stats["2996146975"]
      const isMod = cachedMods[vendorSalesData[key].itemHash]
      // eslint-disable-next-line max-len
      const isWeapon = vendorWeaponPlugs[key]?.plugs["1"]?.[0].plugItemHash || vendorWeaponSockets[key]?.sockets[0].plugHash

      if (isArmor) {
        const armor = {}
        armor.itemHash = itemHash

        if (cachedItems[itemHash]) {
          armor.name = cachedItems[itemHash].name
          armor.type = cachedItems[itemHash].type
          armor.class = cachedItems[itemHash].class
        } else {
          console.log(`itemHash ${itemHash} not found in cache`)
          usedCachedData = false
          await getItemDefinitions()
          armor.name = itemDefinitions[vendorSalesData[key].itemHash].displayProperties.name
          armor.type = itemDefinitions[vendorSalesData[key].itemHash].itemTypeAndTierDisplayName
          armor.class = classMapping[itemDefinitions[vendorSalesData[key].itemHash].classType]
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

        if (armor.class === className) {
          inventory.armor.push(armor)
        }
      } else if (isMod && !inventory.mods.find((item) => item.itemHash === itemHash)) {
        const mod = {}
        if (cachedMods[itemHash]) {
          mod.name = cachedMods[itemHash].name
          mod.type = cachedMods[itemHash].type
        } else {
          console.log(`itemHash ${itemHash} not found in cache`)
          usedCachedData = false
          await getItemDefinitions()
          mod.name = itemDefinitions[itemHash].displayProperties.name
          mod.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        }

        mod.itemHash = itemHash
        inventory.mods.push(mod)
      } else if (isWeapon && !inventory.weapons.find((item) => item.itemHash === itemHash)) {
        const weapon = {}
        weapon.itemHash = itemHash
        if (cachedItems[itemHash]) {
          weapon.name = cachedItems[itemHash].name
          weapon.type = cachedItems[itemHash].type
        } else {
          console.log(`itemHash ${itemHash} not found in cache`)
          usedCachedData = false
          await getItemDefinitions()
          weapon.name = itemDefinitions[itemHash].displayProperties.name
          weapon.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        }

        weapon.perks = []
        const perkHashes = []

        const plugs = vendorWeaponPlugs[key]?.plugs
        let sockets = vendorWeaponSockets[key]?.sockets

        if (plugs && !weapon.type.startsWith("Exotic")) {
          if (plugs?.["5"]) {
            delete plugs["5"]
          }
          if (plugs?.["7"]) {
            delete plugs["7"]
          }
          // eslint-disable-next-line max-len
          Object.values(plugs).map((plug) => plug.map(({ plugItemHash }) => perkHashes.push(plugItemHash)))
          // Add class specific sword guards that are not in Bungie API plug response :/
          if (itemHash === 2782325302) {
            perkHashes.push(2349202967)
          }
          if (itemHash === 2782325300) {
            perkHashes.push(269888150)
          }
          if (itemHash === 2782325301) {
            perkHashes.push(2363751990)
          }
        } else {
          sockets = sockets.splice(0, 5)
          perkHashes.push(...sockets.filter((item) => item.plugHash).map((item) => item.plugHash))
        }

        const killTrackerPerks = [2302094943, 38912240, 2240097604]
        for (const killTrackerPerk of killTrackerPerks) {
          if (perkHashes.includes(killTrackerPerk)) {
            perkHashes.splice(perkHashes.indexOf(killTrackerPerk, 1))
          }
        }

        const arePerksCached = () => {
          let cacheFound = true
          for (const perk of perkHashes) {
            if (perk && !cachedItems[perk]) {
              console.log(`itemHash ${perk} not found in cache`)
              cacheFound = false
            }
          }
          return cacheFound
        }

        const perksCached = arePerksCached()

        if (perksCached) {
          for (const perk of perkHashes) {
            weapon.perks.push(cachedItems[perk].name)
          }
        } else {
          usedCachedData = false
          await getItemDefinitions()
          for (const perk of perkHashes) {
            weapon.perks.push(itemDefinitions[perk].displayProperties.name)
          }
        }

        if (cachedWeaponWishLists[itemHash]) {
          const wishLists = cachedWeaponWishLists[itemHash]
          // eslint-disable-next-line max-len
          const currentRoll = []
          for (const perk of perkHashes) {
            currentRoll.push(perk.toString())
          }

          const wishList = isWishList(wishLists.rolls, currentRoll)
          weapon.wishList = wishList
        }

        if (!weapon.type.endsWith("Ghost Shell")) {
          inventory.weapons.push(weapon)
        }
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
