const fetch = require("node-fetch")

module.exports.getManifestData = async () => {
  console.log("getManifestData called")
  const manifestEndpoint = "https://www.bungie.net/Platform/Destiny2/Manifest/"
  let rawManifest = await fetch(manifestEndpoint)
  let manifestData = await rawManifest.json()
  let isValidManifestData = manifestData.Message === "Ok"
  const maxRetries = 5
  let manifestRetries = 0
  if (!isValidManifestData) {
    while (manifestRetries < maxRetries && !isValidManifestData) {
      manifestRetries += 1
      console.log({ manifestRetries })
      rawManifest = await fetch(manifestEndpoint)
      manifestData = await rawManifest.json()
      isValidManifestData = manifestData.Message === "Ok"
    }

    if (manifestRetries === maxRetries && !isValidManifestData) {
      return { getManifestDataError: `The Bungie manifest failed to load ${maxRetries} times` }
    }
  }
  return { manifestData, manifestRetries }
}
