import test from "ava"
import { getVendorInventory } from "../../src/util/get-vendor-inventory.js"

test("Integration - commander-zavala Vendor", async (assert) => {
  const vendorInventory = await getVendorInventory("69482069")
  assert.truthy(vendorInventory.inventory.armor.length > 0)
  assert.truthy(vendorInventory.inventory.weapons.length > 0)
  assert.truthy(vendorInventory.inventory.mods.length === 0)
})
