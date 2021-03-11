module.exports.getBansheeInventoryEndpoint = async (manifestData) => {
  console.log("getBansheeInventoryEndpoint called")
  // eslint-disable-next-line max-len
  const bansheeItemDefinitionsPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
  const bansheeItemDefinitionsEndpoint = `https://www.bungie.net${bansheeItemDefinitionsPath}`
  return bansheeItemDefinitionsEndpoint
}
