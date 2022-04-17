import fetch from "node-fetch"
import { getJson } from "./json.js"
import { getInventoryItemDefinitionEndpoint } from "./get-inventory-item-definition-endpoint.js"
import { getManifest } from "./get-manifest.js"

export const buildCachedItems = async () => {
  const { manifest } = await getManifest()
  const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(manifest)
  const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
  const itemDefinitions = await itemDefinitionsResponse.json()

  const output = {}
  for (const item in itemDefinitions) {
    const name = itemDefinitions[item].displayProperties.name
    const type = itemDefinitions[item].itemTypeAndTierDisplayName
    const classMapping = await getJson("../data/class-mapping.json")
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
