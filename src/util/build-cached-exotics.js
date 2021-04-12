const fetch = require("node-fetch")
const { getManifest } = require("./get-manifest")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("./get-inventory-item-definition-endpoint.js")

module.exports.buildCachedExotics = async () => {
  const { manifest } = await getManifest()
  const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
  const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
  const itemDefinitions = await itemDefinitionsResponse.json()

  const output = {}
  for (const item in itemDefinitions) {
    const name = itemDefinitions[item].displayProperties.name
    const type = itemDefinitions[item].itemTypeAndTierDisplayName
    const icon = `https://bungie.net${itemDefinitions[item].displayProperties.icon}`

    const exoticWeaponOrArmorTypes = [
      "Exotic Trace Rifle",
      "Exotic Gauntlets",
      "Exotic Helmet",
      "Exotic Leg Armor",
      "Exotic Hand Cannon",
      "Exotic Grenade Launcher",
      "Exotic Chest Armor",
      "Exotic Pulse Rifle",
      "Exotic Fusion Rifle",
      "Exotic Scout Rifle",
      "Exotic Auto Rifle",
      "Exotic Combat Bow",
      "Exotic Rocket Launcher",
      "Exotic Machine Gun",
      "Exotic Shotgun",
      "Exotic Sidearm",
      "Exotic Sword",
      "Exotic Sniper Rifle",
      "Exotic Linear Fusion Rifle",
      "Exotic Submachine Gun"
    ]

    if (type && exoticWeaponOrArmorTypes.includes(type)) {
      output[item] = {
        name,
        type,
        icon
      }
    }
  }

  return output
}

module.exports.printCachedExotics = async () => {
  const data = await this.buildCachedExotics()
  console.log(JSON.stringify(data, null, "  "))
}
