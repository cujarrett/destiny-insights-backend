const api = require("lambda-api")()
const authorize = require("./src/routes/authorize.js")
const init = require("./src/routes/init.js")
const mods = require("./src/routes/mods.js")
const getModDataForLastYear = require("./src/routes/get-mod-data-for-last-year.js")

api.register(init)
api.register(authorize)
api.register(mods)
api.register(getModDataForLastYear)

exports.handler = async (event, context) => {
  return api.run(event, context)
}
