const test = require("tape-async")
const { getManifest } = require("../../src/util/get-manifest.js")

test("Unit - getManifest", async (assert) => {
  assert.plan(3)
  const { manifest, manifestRetries } = await getManifest()
  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  assert.true(manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition, "inventoryItemDefinitionEndpoint verified")
  // eslint-disable-next-line max-len
  assert.true(manifest.Response.jsonWorldComponentContentPaths.en.DestinySandboxPerkDefinition, "sandboxPerkDefinitionEndpoint verified")
  assert.true(typeof manifestRetries === "number", "manifestRetries is a number verified")
})
