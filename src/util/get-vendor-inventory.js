const fetch = require("node-fetch")
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
    const vendorWeaponPerks = vendorData.Response.itemComponents.reusablePlugs.data
    const vendorWeaponSockets = vendorData.Response.itemComponents.sockets.data

    for (const key of Object.keys(vendorSalesData)) {
      const itemHash = vendorSalesData[key].itemHash
      const isArmor = vendorArmorStats[key]?.stats["2996146975"]
      const isMod = vendorSalesData[key].costs[0]?.itemHash === 4046539562
      // eslint-disable-next-line max-len
      const isWeapon = vendorWeaponPerks[key]?.plugs["1"]?.[0].plugItemHash || vendorWeaponSockets[key]?.sockets[0].plugHash

      if (isArmor) {
        const armor = {}
        armor.itemHash = itemHash

        if (cachedItems[itemHash]) {
          armor.name = cachedItems[itemHash].name
          armor.type = cachedItems[itemHash].type
          armor.class = cachedItems[itemHash].class
        } else {
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
          usedCachedData = false
          await getItemDefinitions()
          weapon.name = itemDefinitions[itemHash].displayProperties.name
          weapon.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
        }

        weapon.perks = []
        let perk1
        let perk2
        let perk3
        let perk4
        let perk5
        let perk6

        const isSword = weapon.type.endsWith("Sword")

        if (isSword) {
          if (vendorWeaponPerks[key] && Object.keys(vendorWeaponPerks[key].plugs).length > 2) {
            perk1 = vendorWeaponPerks[key].plugs["1"][0].plugItemHash
            perk2 = vendorWeaponPerks[key].plugs["1"][1].plugItemHash
            // eslint-disable-next-line max-len
            perk3 = vendorWeaponPerks[key].plugs["1"]?.[2]?.plugItemHash || vendorWeaponPerks[key].plugs["2"][0].plugItemHash
            // Swords perk locations are weird :(
            // eslint-disable-next-line max-len
            perk4 = vendorWeaponSockets[key].sockets?.[2]?.plugHash || vendorWeaponPerks[key].plugs["2"][1].plugItemHash
            perk5 = vendorWeaponPerks[key].plugs["3"][0].plugItemHash
            perk6 = vendorWeaponPerks[key].plugs["4"][0].plugItemHash
          }
        } else {
          // eslint-disable-next-line max-len
          if (vendorWeaponPerks[key] && Object.keys(vendorWeaponPerks[key].plugs).length > 2) {
            perk1 = vendorWeaponPerks[key].plugs["1"][0].plugItemHash
            perk2 = vendorWeaponPerks[key].plugs["1"][1].plugItemHash
            perk3 = vendorWeaponPerks[key].plugs["2"][0].plugItemHash
            perk4 = vendorWeaponPerks[key].plugs["2"][1].plugItemHash
            perk5 = vendorWeaponPerks[key].plugs["3"][0].plugItemHash
            perk6 = vendorWeaponPerks[key].plugs["4"][0].plugItemHash
          } else {
            perk1 = vendorWeaponSockets[key].sockets[0].plugHash
            perk2 = vendorWeaponSockets[key].sockets[1].plugHash
            perk3 = vendorWeaponSockets[key].sockets[2].plugHash
            perk4 = vendorWeaponSockets[key].sockets[3].plugHash
            perk5 = vendorWeaponSockets[key].sockets[4].plugHash
          }
        }

        const arePerksCached = () => {
          let cacheFound = true
          const perks = [perk1, perk2, perk3, perk4, perk5, perk6]
          for (const perk of perks) {
            if (perk && !cachedItems[perk]) {
              cacheFound = false
            }
          }
          return cacheFound
        }

        const perksCached = arePerksCached()

        if (perksCached) {
          if (perk1) {
            weapon.perks.push(cachedItems[perk1].name)
          }
          if (perk2) {
            weapon.perks.push(cachedItems[perk2].name)
          }
          if (perk3) {
            weapon.perks.push(cachedItems[perk3].name)
          }
          if (perk4) {
            weapon.perks.push(cachedItems[perk4].name)
          }
          if (perk5) {
            weapon.perks.push(cachedItems[perk5].name)
          }
          if (perk6) {
            weapon.perks.push(cachedItems[perk6].name)
          }
        } else {
          usedCachedData = false
          await getItemDefinitions()

          if (perk1) {
            weapon.perks.push(itemDefinitions[perk1].displayProperties.name)
          }
          if (perk2) {
            weapon.perks.push(itemDefinitions[perk2].displayProperties.name)
          }
          if (perk3) {
            weapon.perks.push(itemDefinitions[perk3].displayProperties.name)
          }
          if (perk4) {
            weapon.perks.push(itemDefinitions[perk4].displayProperties.name)
          }
          if (perk5) {
            weapon.perks.push(itemDefinitions[perk5].displayProperties.name)
          }
          if (perk6) {
            weapon.perks.push(itemDefinitions[perk6].displayProperties.name)
          }
        }

        if (cachedWeaponWishLists[itemHash]) {
          const wishLists = cachedWeaponWishLists[itemHash]
          // eslint-disable-next-line max-len
          const currentRoll = []
          if (perk1) {
            currentRoll.push(perk1.toString())
          }
          if (perk2) {
            currentRoll.push(perk2.toString())
          }
          if (perk3) {
            currentRoll.push(perk3.toString())
          }
          if (perk4) {
            currentRoll.push(perk4.toString())
          }
          if (perk5) {
            currentRoll.push(perk5.toString())
          }
          if (perk6) {
            currentRoll.push(perk6.toString())
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
