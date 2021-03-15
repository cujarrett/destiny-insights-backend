const { getModDataForLastYear } = require("../integrations/dynamodb.js")
const { knownMods } = require("../data/known-mods.js")

module.exports = async (api) => {
  api.get("/get-mod-data-for-last-year", async (request, response) => {
    console.log("/get-mod-data-for-last-year called")
    response.header("Access-Control-Allow-Origin", "*")
    const data = await getModDataForLastYear()

    const modTypeMap = {}
    for (const value of Object.values(knownMods)) {
      modTypeMap[value.name] = value.type
    }

    for (const mod of data) {
      let name = mod.mods[0].name
      mod.mods[0].type = modTypeMap[name]
      name = mod.mods[1].name
      mod.mods[1].type = modTypeMap[name]
    }

    const result = {
      data: [
        ...data
      ]
    }
    return JSON.stringify(result, null, "  ")
  })
}
