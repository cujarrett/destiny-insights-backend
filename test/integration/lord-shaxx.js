const test = require("ava")
const { getVendorInventory } = require("../../src/util/get-vendor-inventory.js")

test("Integration - lord-shaxx Vendor", async (assert) => {
  const vendorInventory = await getVendorInventory("3603221665")
  assert.truthy(vendorInventory.inventory.armor.length > 0)
  assert.truthy(vendorInventory.inventory.mods.length === 0)
})
