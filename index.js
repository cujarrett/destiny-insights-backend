const api = require("lambda-api")()
const authorize = require("./src/routes/authorize.js")
const init = require("./src/routes/init.js")
const mods = require("./src/routes/mods.js")
const xur = require("./src/routes/xur.js")

api.register(init)
api.register(authorize)
api.register(mods)
api.register(xur)

exports.handler = async (event, context) => {
  return api.run(event, context)
}
