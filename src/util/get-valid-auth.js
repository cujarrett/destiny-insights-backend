const { getAuth } = require("../integrations/dynamodb.js")
const { checkIfTokenRefreshNeeded } = require("./check-if-token-refresh-needed.js")
const { refreshToken } = require("./refresh-token.js")

module.exports.getValidAuth = async () => {
  console.log("getValidAuth called")
  let auth = await getAuth()
  const isTokenRefreshNeeded = checkIfTokenRefreshNeeded(auth)
  if (isTokenRefreshNeeded) {
    await refreshToken(auth)
    auth = await getAuth()
  }
  return { auth, isTokenRefreshNeeded }
}
