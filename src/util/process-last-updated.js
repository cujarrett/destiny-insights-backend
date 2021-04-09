// eslint-disable-next-line max-len
const { addMod, getLastSoldMods } = require("../integrations/dynamodb.js")

module.exports.processLastUpdated = async (currentMods) => {
  console.log("processLastUpdated called")
  const lastSoldMods = await getLastSoldMods()
  let lastUpdated = lastSoldMods[0].timestamp

  let newModsFound = false
  for (let index = 0; index < currentMods && newModsFound === false; index++) {
    if (currentMods[index].name !== lastSoldMods[index].name) {
      newModsFound = true
    }
  }

  if (newModsFound) {
    for (const mod of currentMods) {
      await addMod(mod)
    }
    lastUpdated = currentMods[0].timestamp
  }
  return lastUpdated
}
