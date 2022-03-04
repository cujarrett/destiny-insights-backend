import { getModDataForLastYear } from "../integrations/dynamodb.js"
import { getJson } from "../util/json.js"

export default async (api) => {
  api.get("/mod-data-for-last-year", async (request, response) => {
    console.log("/mod-data-for-last-year called")
    response.header("Access-Control-Allow-Origin", "*")
    const data = await getModDataForLastYear()
    const { name } = await getJson("../../package.json")
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
