import test from "ava"
// eslint-disable-next-line max-len
import { getSandboxPerkDefinitionEndpoint } from "../../src/util/get-sandbox-perk-definition-endpoint.js"

test("Unit - getInventoryItemDefinitionEndpoint", async (assert) => {
  const mockedManifestData = {
    "Response": {
      "jsonWorldComponentContentPaths": {
        "en": {
          // eslint-disable-next-line max-len
          "DestinySandboxPerkDefinition": "/common/destiny2_content/json/zh-chs/DestinySandboxPerkDefinition-aec69088-d246-4c61-b4fc-cd92fd2bd63b.json"
        }
      }
    }
  }
  const inventoryItemDefinitionEndpoint = getSandboxPerkDefinitionEndpoint(mockedManifestData)
  assert.truthy(inventoryItemDefinitionEndpoint)
})
