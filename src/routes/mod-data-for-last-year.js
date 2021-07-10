const { getModDataForLastYear } = require("../integrations/dynamodb.js")
const { name, version } = require("../../package.json")

module.exports = async (api) => {
  api.get("/mod-data-for-last-year", async (request, response) => {
    console.log("/mod-data-for-last-year called")
    response.header("Access-Control-Allow-Origin", "*")
    const data = await getModDataForLastYear()
    const result = {
      data: [
        ...data
      ],
      metadata: {
        name,
        version
      }
    }
    return JSON.stringify(result, null, "  ")
  })
}
