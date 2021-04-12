const test = require("tape-async")
const { buildCachedExotics } = require("../../src/util/build-cached-exotics.js")

test("Integration - buildCachedExotics", async (assert) => {
  assert.plan(3)
  const cachedMods = await buildCachedExotics()
  const wormhuskCrown = cachedMods["3562696927"]
  const name = wormhuskCrown.name
  const type = wormhuskCrown.type
  const icon = wormhuskCrown.icon
  assert.equal(name, "Wormhusk Crown", "buildCachedExotics for weapon mod name verified")
  assert.equal(type, "Exotic Helmet", "buildCachedExotics for weapon mod type verified")
  // eslint-disable-next-line max-len
  const expectedIconPath = "https://bungie.net/common/destiny2_content/icons/95eb480d723f510afd9fd3e2bbb1d92d.jpg"
  assert.equal(icon, expectedIconPath, "buildCachedExotics for weapon mod icon path verified")
})
