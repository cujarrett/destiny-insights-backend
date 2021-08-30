const fetch = require("node-fetch")
const fs = require("fs")
const { getManifest } = require("./get-manifest")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("./get-inventory-item-definition-endpoint.js")

module.exports.buildCachedItems = async () => {
  const { manifest } = await getManifest()
  const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
  const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
  const itemDefinitions = await itemDefinitionsResponse.json()

  const output = {}
  for (const item in itemDefinitions) {
    const name = itemDefinitions[item].displayProperties.name
    const type = itemDefinitions[item].itemTypeAndTierDisplayName
    const icon = `https://bungie.net${itemDefinitions[item].displayProperties.icon}`

    if (name && name !== "" && type && type !== "" && icon && icon !== "") {
      output[item] = {
        name,
        type,
        icon
      }
    }
  }

  return output
}

module.exports.updateCachedItems = async () => {
  const cachedItems = await this.buildCachedItems()
  const data = JSON.stringify(cachedItems, null, "  ")
  await fs.writeFileSync("./src/data/cached-items.json", data)
}
