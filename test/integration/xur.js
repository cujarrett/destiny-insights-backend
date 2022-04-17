import test from "ava"
import { getVendorInventory } from "../../src/util/get-vendor-inventory.js"

test("Integration - xur Vendor", async (assert) => {
  const vendorInventory = await getVendorInventory("2190858386")
  assert.truthy(vendorInventory.inventory.armor)
  assert.truthy(vendorInventory.inventory.weapons)
  assert.truthy(vendorInventory.inventory.mods.length === 0)
})
