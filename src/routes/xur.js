const { isValidConsumerAuth } = require("../util/is-valid-consumer-auth.js")
const { getVendorInventory } = require ("../util/get-vendor-inventory.js")

module.exports = async (api) => {
  api.get("/xur", async (request, response) => {
    console.log("/xur called")
    let result

    try {
      const validConsumerAuth = await isValidConsumerAuth(request)
      console.log({ validConsumerAuth })
      response.header("Access-Control-Allow-Origin", "*")
      result = await getVendorInventory("2190858386")
    } catch (error) {
      response.sendStatus(500)
      result = { "error": error.message }
    }

    result = JSON.stringify(result, null, "  ")
    console.log(`Completing request:\n${result}`)
    return result
  })
}
