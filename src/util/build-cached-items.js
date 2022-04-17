const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))
const fs = require("fs")
const classMapping = require("../data/class-mapping.json")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("./get-inventory-item-definition-endpoint.js")
const { getManifest } = require("./get-manifest")

module.exports.buildCachedItems = async () => {
  const { manifest } = await getManifest()
  const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
  const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
  const itemDefinitions = await itemDefinitionsResponse.json()

  const output = {}
  for (const item in itemDefinitions) {
    const name = itemDefinitions[item].displayProperties.name
    const type = itemDefinitions[item].itemTypeAndTierDisplayName
    const classType = classMapping[itemDefinitions[item].classType]
    const icon = `https://bungie.net${itemDefinitions[item].displayProperties.icon}`

    if (name && name !== "" && type && type !== "" && icon && icon !== "") {
      output[item] = {
        name,
        type,
        class: classType,
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
