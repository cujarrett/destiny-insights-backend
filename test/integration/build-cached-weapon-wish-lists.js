import test from "ava"
import { buildWeaponWishLists } from "../../src/util/build-cached-weapon-wish-lists.js"

test("Integration - buildWeaponWishLists", async (assert) => {
  const cachedWeaponWishLists = await buildWeaponWishLists()
  const wishLists = cachedWeaponWishLists["2957367743"]
  assert.truthy(wishLists)
})
