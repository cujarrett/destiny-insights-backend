const test = require("tape-async")
const { getCurrentMods } = require("../../src/util/get-current-mods.js")

test("Unit - getCurrentMods", async (assert) => {
  assert.plan(8)
  const mockedSalesData = {
    "1": { itemHash: 666440382 },
    "2": { itemHash: 1484685887 }
  }
  const mockedCategories = ["1", "2"]
  const mockedInventoryItemDefinitionEndpoint = ""

  // eslint-disable-next-line max-len
  const { currentMods } = await getCurrentMods(mockedSalesData, mockedCategories, mockedInventoryItemDefinitionEndpoint)
  // eslint-disable-next-line max-len
  let expectedName = "Rampage Spec"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[0].name, expectedName, "getCurrentMods name for cached weapon mod verified")
  let expectedType = "Legendary Weapon Mod"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[0].type, expectedType, "getCurrentMods type for cached weapon mod verified")
  let expectedDescription = "Increases duration of Rampage."
  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  assert.equals(currentMods[0].description, expectedDescription, "getCurrentMods description for cached weapon mod verified")
  // eslint-disable-next-line max-len
  let expectedIconPath = "https://bungie.net/common/destiny2_content/icons/b3eadd1fcadf34e389fad3e7a75acc26.jpg"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[0].icon, expectedIconPath, "getCurrentMods icon for cached weapon mod verified")
  expectedName = "Powerful Friends"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[1].name, expectedName, "getCurrentMods name for cached armor mod verified")
  expectedType = "Common Charged with Light Mod"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[1].type, expectedType, "getCurrentMods type for cached armor mod verified")
  // eslint-disable-next-line max-len
  expectedDescription = "When you become Charged with Light, nearby allies also become Charged with Light, if they are not already."
  // eslint-disable-next-line max-len
  assert.equals(currentMods[1].description, expectedDescription, "getCurrentMods description for cached armor mod verified")
  // eslint-disable-next-line max-len
  expectedIconPath = "https://bungie.net/common/destiny2_content/icons/006460670f0ca57fbe5ee1af83dcfd4d.png"
  // eslint-disable-next-line max-len
  assert.equals(currentMods[1].icon, expectedIconPath, "getCurrentMods icon for cached armor mod verified")
})
