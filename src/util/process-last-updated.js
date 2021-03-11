// eslint-disable-next-line max-len
const { addNewMods, getLastUpdated, setLastUpdated, getLastSoldMods } = require("../integrations/dynamodb.js")

module.exports.processLastUpdated = async (firstMod, secondMod) => {
  console.log("processLastUpdated called")
  const [{ mods: lastSoldMods }] = await getLastSoldMods()
  const firstModChanged = firstMod.name !== lastSoldMods[0].name
  const secondModChanged = secondMod.name !== lastSoldMods[1].name
  let lastUpdated = await getLastUpdated()

  if (firstModChanged || secondModChanged) {
    await addNewMods(firstMod, secondMod)
    await setLastUpdated(new Date().toISOString())
    lastUpdated = await getLastUpdated()
  }
  return lastUpdated
}
