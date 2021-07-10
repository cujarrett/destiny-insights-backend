const api = require("lambda-api")()
const ada1 = require("./src/routes/ada-1.js")
const authorize = require("./src/routes/authorize.js")
const banshee44 = require("./src/routes/banshee-44.js")
const init = require("./src/routes/init.js")
const modDataForLastYear = require("./src/routes/mod-data-for-last-year.js")
const xur = require("./src/routes/xur.js")

api.register(ada1)
api.register(authorize)
api.register(banshee44)
api.register(init)
api.register(modDataForLastYear)
api.register(xur)

exports.handler = async (event, context) => {
  return api.run(event, context)
}
