import { getVendorInventory } from "../util/get-vendor-inventory.js"

export default async (api) => {
  api.get("/the-drifter", async (request, response) => {
    console.log("/the-drifter called")
    let result

    try {
      response.header("Access-Control-Allow-Origin", "*")
      result = await getVendorInventory("248695599")
    } catch (error) {
      response.sendStatus(500)
      result = { "error": error.message }
    }

    result = JSON.stringify(result, null, "  ")
    console.log(`Completing request:\n${result}`)
    return result
  })
}
