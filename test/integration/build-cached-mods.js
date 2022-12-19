const test = require("ava")
const { buildCachedMods } = require("../../src/util/build-cached-mods.js")

test("Integration - buildCachedMods", async (assert) => {
  const cachedMods = await buildCachedMods()
  const { name, type, description, icon } = cachedMods["3185435910"]
  assert.is(name, "Charged Up")
  assert.is(type, "Common Charged with Light Mod")
  assert.is(description, "Allows for 1 additional stack of Charged with Light.")
  // eslint-disable-next-line max-len
  assert.is(icon, "https://bungie.net/common/destiny2_content/icons/ce29f32ba5ef8758d1b5f3cfad0944a6.png")
})
