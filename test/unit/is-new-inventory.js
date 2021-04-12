const test = require("tape-async")
const { isNewInventory } = require("../../src/util/is-new-inventory.js")

const mockCurrentNewItems = [
  { name: "Foo" },
  { name: "Shotgun Loader" }
]

const mockCurrentNotNewItems = [
  { name: "Surrounded Spec" },
  { name: "Shotgun Loader" }
]

const mockLastSoldItems = [
  { name: "Shotgun Loader" },
  { name: "Surrounded Spec" }
]

const mockNoLastSoldInGivenTimeframeItems = []

test("Unit - getCategories", async (assert) => {
  assert.plan(3)

  let result = await isNewInventory(mockCurrentNewItems, mockLastSoldItems)
  assert.equal(result, true, "isNewInventory for new inventory verified")
  result = await isNewInventory(mockCurrentNotNewItems, mockLastSoldItems)
  assert.equal(result, false, "isNewInventory for not new inventory verified")
  result = await isNewInventory(mockCurrentNewItems, mockNoLastSoldInGivenTimeframeItems)
  assert.equal(result, true, "isNewInventory for not new inventory verified")
})
