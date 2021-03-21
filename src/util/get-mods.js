const fetch = require("node-fetch")

const cachedMods = require("../data/cached-mods.json")
module.exports.getMods = async (salesData, categories, inventoryItemDefinitionEndpoint) => {
  console.log("getMods called")
  const [firstCategory, secondCategory] = categories
  const firstModHash = salesData[firstCategory].itemHash
  const secondModHash = salesData[secondCategory].itemHash
  let firstMod = cachedMods[firstModHash]
  let secondMod = cachedMods[secondModHash]

  let usedCachedMods = true
  if (!firstMod || !secondMod) {
    usedCachedMods = false
    const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
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
  firstMod.itemHash = firstModHash
  secondMod.itemHash = secondModHash
  return { firstMod, secondMod, usedCachedMods }
}
