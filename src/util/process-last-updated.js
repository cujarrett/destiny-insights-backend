const { addMod, getLastSoldMods } = require("../integrations/dynamodb.js")

module.exports.processLastUpdated = async (currentMods) => {
  console.log("processLastUpdated called")
  const lastSoldMods = await getLastSoldMods()
  const noModsInLastDay = lastSoldMods.length === 0
  let newModsFound = false
  const lastModsSold = lastSoldMods.map((value) => value.name)

  for (const currentMod of currentMods) {
    if (!lastModsSold.includes(currentMod.name)) {
      newModsFound = true
    }
  }

  let lastUpdated = undefined
  if (noModsInLastDay || newModsFound) {
    for (const mod of currentMods) {
      await addMod(mod)
    }
    lastUpdated = new Date().toISOString()
  } else {
    lastUpdated = lastSoldMods[0].timestamp
  }
  return lastUpdated
}
