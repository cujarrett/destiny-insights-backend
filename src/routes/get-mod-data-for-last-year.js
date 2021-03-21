const { getModDataForLastYear } = require("../integrations/dynamodb.js")
const cachedMods = require("../data/cached-mods.json")

module.exports = async (api) => {
  api.get("/get-mod-data-for-last-year", async (request, response) => {
    console.log("/get-mod-data-for-last-year called")
    response.header("Access-Control-Allow-Origin", "*")
    const data = await getModDataForLastYear()

    const modsByName = {}
    for (const [key, value] of Object.entries(cachedMods)) {
      modsByName[value.name] = {
        itemHash: key,
        type: value.type,
        value: value.type,
        description: value.description,
        icon: value.icon
      }
    }

    for (const mod of data) {
      let name = mod.mods[0].name
      mod.mods[0].type = modsByName[name].type
      mod.mods[0].description = modsByName[name].description
      mod.mods[0].icon = modsByName[name].icon
      name = mod.mods[1].name
      mod.mods[1].type = modsByName[name].type
      mod.mods[1].description = modsByName[name].description
      mod.mods[1].icon = modsByName[name].icon
    }

    const result = {
      data: [
        ...data
      ]
    }
    return JSON.stringify(result, null, "  ")
  })
}
