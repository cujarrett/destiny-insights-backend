module.exports.getInventoryItemDefinitionEndpoint = (manifestData) => {
  console.log("getInventoryItemDefinitionEndpoint called")
  // eslint-disable-next-line max-len
  const inventoryItemDefinitionPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
  const inventoryItemDefinitionEndpoint = `https://www.bungie.net${inventoryItemDefinitionPath}`
  return inventoryItemDefinitionEndpoint
}
