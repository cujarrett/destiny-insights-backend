const { getModDataForLastYear } = require("../integrations/dynamodb.js")
const { name } = require("../../package.json")

module.exports = async (api) => {
  api.get("/mod-data-for-last-year", async (request, response) => {
    console.log("/mod-data-for-last-year called")
    response.header("Access-Control-Allow-Origin", "https://www.destinyinsights.com")
    const data = await getModDataForLastYear()
    const result = {
      data: [
        ...data
      ],
      metadata: {
        name,
        now: new Date().toISOString()
      }
    }
    return JSON.stringify(result, null, "  ")
  })
}
