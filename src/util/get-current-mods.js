const fetch = require("node-fetch")
const cachedMods = require("../data/cached-mods.json")

module.exports.getCurrentMods = async (salesData, categories, inventoryItemDefinitionEndpoint) => {
  console.log("getCurrentMods called")
  const mods = []
  let usedCachedMods = true
  for (const category of categories) {
    const itemHash = salesData[category].itemHash
    let mod = cachedMods[itemHash]

    if (mod === undefined) {
      usedCachedMods = false
      mod = {}
      const itemDefinitionsResponse = await fetch(inventoryItemDefinitionEndpoint)
      const itemDefinitionsText = await itemDefinitionsResponse.text()
      const itemDefinitions = await JSON.parse(itemDefinitionsText)
      mod.type = itemDefinitions[itemHash].itemTypeAndTierDisplayName
      mod.name = itemDefinitions[itemHash].displayProperties.name
    }

    mod.itemHash = itemHash
    mods.push(mod)
  }

  return { currentMods: [...mods], usedCachedMods }
}
