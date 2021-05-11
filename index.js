const api = require("lambda-api")()
const authorize = require("./src/routes/authorize.js")
const init = require("./src/routes/init.js")
const ada1 = require("./src/routes/ada-1.js")
const banshee44 = require("./src/routes/banshee-44.js")
const xur = require("./src/routes/xur.js")

api.register(init)
api.register(authorize)
api.register(ada1)
api.register(banshee44)
api.register(xur)

exports.handler = async (event, context) => {
  return api.run(event, context)
}
