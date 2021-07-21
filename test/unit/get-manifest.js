const test = require("ava")
const { getManifest } = require("../../src/util/get-manifest.js")

test("Unit - getManifest", async (assert) => {
  const { manifest, manifestRetries } = await getManifest()
  assert.truthy(manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition)
  assert.truthy(manifest.Response.jsonWorldComponentContentPaths.en.DestinySandboxPerkDefinition)
  assert.true(typeof manifestRetries === "number")
})
