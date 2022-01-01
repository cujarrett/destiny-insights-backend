const test = require("ava")
const { buildCachedItems } = require("../../src/util/build-cached-items.js")

test("Integration - buildCachedItems", async (assert) => {
  const cachedMods = await buildCachedItems()
  const { name, type, icon } = cachedMods["3562696927"]
  assert.is(name, "Wormhusk Crown")
  assert.is(type, "Exotic Helmet")
  // eslint-disable-next-line max-len
  assert.is(icon, "https://bungie.net/common/destiny2_content/icons/95eb480d723f510afd9fd3e2bbb1d92d.jpg")
})
