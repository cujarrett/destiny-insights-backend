const test = require("tape-async")
const { getMods } = require("../../src/util/get-mods.js")

test("Unit - getMods", async (assert) => {
  assert.plan(8)
  const mockedSalesData = {
    "1": { itemHash: 666440382 },
    "2": { itemHash: 1484685887 }
  }
  const mockedCategories = ["1", "2"]
  const mockedInventoryItemDefinitionEndpoint = ""

  // eslint-disable-next-line max-len
  const mods = await getMods(mockedSalesData, mockedCategories, mockedInventoryItemDefinitionEndpoint)
  // eslint-disable-next-line max-len
  let expectedName = "Rampage Spec"
  assert.equals(mods.firstMod.name, expectedName, "getMods name for cached weapon mod verified")
  let expectedType = "Legendary Weapon Mod"
  assert.equals(mods.firstMod.type, expectedType, "getMods type for cached weapon mod verified")
  let expectedDescription = "Increases duration of Rampage."
  // eslint-disable-next-line max-len
  assert.equals(mods.firstMod.description, expectedDescription, "getMods description for cached weapon mod verified")
  // eslint-disable-next-line max-len
  let expectedIconPath = "https://bungie.net/common/destiny2_content/icons/b3eadd1fcadf34e389fad3e7a75acc26.jpg"
  assert.equals(mods.firstMod.icon, expectedIconPath, "getMods icon for cached weapon mod verified")
  expectedName = "Powerful Friends"
  assert.equals(mods.secondMod.name, expectedName, "getMods name for cached armor mod verified")
  expectedType = "Common Charged with Light Mod"
  assert.equals(mods.secondMod.type, expectedType, "getMods type for cached armor mod verified")
  // eslint-disable-next-line max-len
  expectedDescription = "This mod's secondary perk is active when at least one other Arc mod is socketed into this armor, or when at least one other Arc Charged With Light mod is socketed into another piece of armor you are wearing."
  // eslint-disable-next-line max-len
  assert.equals(mods.secondMod.description, expectedDescription, "getMods description for cached armor mod verified")
  // eslint-disable-next-line max-len
  expectedIconPath = "https://bungie.net/common/destiny2_content/icons/006460670f0ca57fbe5ee1af83dcfd4d.png"
  assert.equals(mods.secondMod.icon, expectedIconPath, "getMods icon for cached armor mod verified")
})
