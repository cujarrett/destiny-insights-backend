import { getAuth } from "../integrations/dynamodb.js"

export default async (api) => {
  api.get("/init", async (request, response) => {
    console.log("/init called")
    const { clientId } = await getAuth()
    if (clientId === "35442") {
      // eslint-disable-next-line max-len
      response.redirect(`https://www.bungie.net/en/oauth/authorize?client_id=${clientId}&response_type=code`)
    } else {
      response.sendStatus(200)
      const result = { "error": "Unauthorized init" }
      console.log(`Completing request:\n${JSON.stringify(result, null, "  ")}`)
      return JSON.stringify(result, null, "  ")
    }
  })
}
