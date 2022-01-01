const test = require("ava")
const { getVendorInventory } = require("../../src/util/get-vendor-inventory.js")

test("Integration - ada-1 Vendor", async (assert) => {
  const vendorInventory = await getVendorInventory("350061650")
  assert.truthy(vendorInventory.inventory.armor.length > 0)
  assert.truthy(vendorInventory.inventory.weapons.length === 0)
  assert.truthy(vendorInventory.inventory.mods.length > 0)
})
