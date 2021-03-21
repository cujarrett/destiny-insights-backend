const test = require("tape-async")
// eslint-disable-next-line max-len
const { getInventoryItemDefinitionEndpoint } = require("../../src/util/get-inventory-item-definition-endpoint.js")

test("Unit - getInventoryItemDefinitionEndpoint", async (assert) => {
  assert.plan(1)
  const mockedManifestData = {
    "Response": {
      "jsonWorldComponentContentPaths": {
        "en": {
          // eslint-disable-next-line max-len
          "DestinyInventoryItemDefinition": "/common/destiny2_content/json/en/DestinyInventoryItemDefinition-aec69088-d246-4c61-b4fc-cd92fd2bd63b.json"
        }
      }
    }
  }
  const inventoryItemDefinitionEndpoint = getInventoryItemDefinitionEndpoint(mockedManifestData)
  assert.true(inventoryItemDefinitionEndpoint, "getInventoryItemDefinitionEndpoint verified")
})
