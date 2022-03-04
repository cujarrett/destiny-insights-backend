export const checkIfTokenRefreshNeeded = (auth) => {
  console.log("checkIfTokenRefreshNeeded called")
  const { lastTokenRefresh, expiresIn } = auth

  if (!lastTokenRefresh) {
    return true
  }

  const now = new Date()
  const lastTokenRefreshDate = new Date(lastTokenRefresh)
  const lastTokenRefreshDifference = (now.getTime() - lastTokenRefreshDate.getTime()) / 1000
  const isTokenRefreshNeeded = lastTokenRefreshDifference > expiresIn

  return isTokenRefreshNeeded
}
