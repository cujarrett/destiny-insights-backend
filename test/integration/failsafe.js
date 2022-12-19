const test = require("ava")
const { getVendorInventory } = require("../../src/util/get-vendor-inventory.js")

test("Integration - failsafe Vendor", async (assert) => {
  const vendorInventory = await getVendorInventory("1576276905")
  assert.truthy(vendorInventory.inventory.armor.length > 0)
  assert.truthy(vendorInventory.inventory.weapons.length === 0)
  assert.truthy(vendorInventory.inventory.mods.length === 0)
})
