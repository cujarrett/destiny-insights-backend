import { getVendorInventory } from "../util/get-vendor-inventory.js"

export default async (api) => {
  api.get("/failsafe", async (request, response) => {
    console.log("/failsafe called")
    let result

    try {
      response.header("Access-Control-Allow-Origin", "*")
      result = await getVendorInventory("1576276905")
    } catch (error) {
      response.sendStatus(500)
      result = { "error": error.message }
    }

    result = JSON.stringify(result, null, "  ")
    console.log(`Completing request:\n${result}`)
    return result
  })
}
