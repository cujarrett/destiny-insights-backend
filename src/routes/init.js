const { getAuth } = require("../integrations/dynamodb.js")

module.exports = async (api) => {
  api.get("/init", async (request, response) => {
    console.log("/init called")
    const { clientId } = await getAuth()
    // eslint-disable-next-line max-len
    response.redirect(`https://www.bungie.net/en/oauth/authorize?client_id=${clientId}&response_type=code`)
  })
}
