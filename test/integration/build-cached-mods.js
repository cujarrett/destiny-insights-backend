import test from "ava"
import { buildCachedMods } from "../../src/util/build-cached-mods.js"

test("Integration - buildCachedMods", async (assert) => {
  const cachedMods = await buildCachedMods()
  const { name, type, description, icon } = cachedMods["666440382"]
  assert.is(name, "Rampage Spec")
  assert.is(type, "Legendary Weapon Mod")
  assert.is(description, "Increases duration of Rampage.")
  // eslint-disable-next-line max-len
  assert.is(icon, "https://bungie.net/common/destiny2_content/icons/b3eadd1fcadf34e389fad3e7a75acc26.jpg")
})
