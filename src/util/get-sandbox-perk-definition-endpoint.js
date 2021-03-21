module.exports.getSandboxPerkDefinitionEndpoint = (manifestData) => {
  console.log("getSandboxPerkDefinitionEndpoint called")
  // eslint-disable-next-line max-len
  const sandboxPerkDefinitionPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinySandboxPerkDefinition
  const sandboxPerkDefinitionEndpoint = `https://www.bungie.net${sandboxPerkDefinitionPath}`
  return sandboxPerkDefinitionEndpoint
}
