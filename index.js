import createApi from "lambda-api"
import ada1 from "./src/routes/ada-1.js"
import authorize from "./src/routes/authorize.js"
import banshee44 from "./src/routes/banshee-44.js"
import commanderZavala from "./src/routes/commander-zavala.js"
import devrimKay from "./src/routes/devrim-kay.js"
import failsafe from "./src/routes/failsafe.js"
import init from "./src/routes/init.js"
import lordShaxx from "./src/routes/lord-shaxx.js"
import modDataForLastYear from "./src/routes/mod-data-for-last-year.js"
import theDrifter from "./src/routes/the-drifter.js"
import xur from "./src/routes/xur.js"

const api = createApi()

api.register(ada1)
api.register(authorize)
api.register(banshee44)
api.register(commanderZavala)
api.register(devrimKay)
api.register(failsafe)
api.register(init)
api.register(lordShaxx)
api.register(modDataForLastYear)
api.register(theDrifter)
api.register(xur)

exports.handler = async (event, context) => {
  return api.run(event, context)
}
