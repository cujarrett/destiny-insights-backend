const fetch = require("node-fetch")

module.exports.getManifest = async () => {
  console.log("getManifest called")
  const manifestEndpoint = "https://www.bungie.net/Platform/Destiny2/Manifest/"
  let rawManifest = await fetch(manifestEndpoint)
  let manifest = await rawManifest.json()
  let isValidManifestData = manifest.Message === "Ok"
  const maxRetries = 5
  let manifestRetries = 0
  if (!isValidManifestData) {
    while (manifestRetries < maxRetries && !isValidManifestData) {
      manifestRetries += 1
      console.log({ manifestRetries })
      rawManifest = await fetch(manifestEndpoint)
      manifest = await rawManifest.json()
      isValidManifestData = manifest.Message === "Ok"
    }

    if (manifestRetries === maxRetries && !isValidManifestData) {
      throw new Error(`The Bungie manifest failed to load ${maxRetries} times`)
    }
  }
  return { manifest, manifestRetries }
}
