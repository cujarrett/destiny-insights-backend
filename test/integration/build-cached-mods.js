const test = require("tape-async")
const { buildCachedMods } = require("../../src/util/build-cached-mods.js")

test("Integration - buildCachedMods", async (assert) => {
  assert.plan(4)
  const cachedMods = await buildCachedMods()
  const rampageSpec = cachedMods["666440382"]
  const name = rampageSpec.name
  const type = rampageSpec.type
  const description = rampageSpec.description
  const icon = rampageSpec.icon
  assert.equal(name, "Rampage Spec", "buildCachedMods for weapon mod name verified")
  assert.equal(type, "Legendary Weapon Mod", "buildCachedMods for weapon mod type verified")
  // eslint-disable-next-line max-len
  assert.equal(description, "Increases duration of Rampage.", "buildCachedMods for weapon mod description verified")
  // eslint-disable-next-line max-len
  const expectedIconPath = "https://bungie.net/common/destiny2_content/icons/b3eadd1fcadf34e389fad3e7a75acc26.jpg"
  assert.equal(icon, expectedIconPath, "buildCachedMods for weapon mod icon path verified")
})
