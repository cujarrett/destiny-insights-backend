const test = require("ava")
const { buildCachedMods } = require("../../src/util/build-cached-mods.js")

test("Integration - buildCachedMods", async (assert) => {
  const cachedMods = await buildCachedMods()
  const { name, type, description, icon } = cachedMods["666440382"]
  assert.is(name, "Rampage Spec")
  assert.is(type, "Legendary Weapon Mod")
  assert.is(description, "Increases duration of Rampage.")
  // eslint-disable-next-line max-len
  assert.is(icon, "https://bungie.net/common/destiny2_content/icons/8fb859ce78bf1fbc2c677fa013d3961e.png")
})
