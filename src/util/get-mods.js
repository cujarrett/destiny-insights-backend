const fetch = require("node-fetch")

const { knownMods } = require("../data/known-mods.js")
module.exports.getMods = async (salesData, categories, bansheeItemDefinitionsEndpoint) => {
  console.log("getMods called")
  const [firstCategory, secondCategory] = categories
  const firstModHash = salesData[firstCategory].itemHash
  const secondModHash = salesData[secondCategory].itemHash
  let firstMod = knownMods[firstModHash]
  let secondMod = knownMods[secondModHash]

  let cachedMods = true
  if (!firstMod || !secondMod) {
    cachedMods = false
    const itemDefinitionsResponse = await fetch(bansheeItemDefinitionsEndpoint)
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
  return { firstMod, secondMod, cachedMods }
}
