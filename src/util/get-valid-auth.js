import { getAuth } from "../integrations/dynamodb.js"
import { checkIfTokenRefreshNeeded } from "./check-if-token-refresh-needed.js"
import { refreshToken } from "./refresh-token.js"

export const getValidAuth = async () => {
  console.log("getValidAuth called")
  let auth = await getAuth()
  const isTokenRefreshNeeded = checkIfTokenRefreshNeeded(auth)
  try {
    if (isTokenRefreshNeeded) {
      await refreshToken(auth)
      auth = await getAuth()
    }
    return { auth, isTokenRefreshNeeded }
  } catch (error) {
    throw new Error(error)
  }
}
