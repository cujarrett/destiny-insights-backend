const test = require("tape-async")
const checkIfTokenRefreshNeeded = require("../../src/util/check-if-token-refresh-needed.js")

test("Unit - checkIfTokenRefreshNeeded", async (assert) => {
  assert.plan(2)
  const now = new Date()
  let result = checkIfTokenRefreshNeeded({ lastTokenRefresh: now, expiresIn: 3600 })
  let expected = false
  assert.equal(result, expected, "checkIfTokenRefreshNeeded no refresh needed verified")
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  result = checkIfTokenRefreshNeeded({ lastTokenRefresh: oneDayAgo, expiresIn: 3600 })
  expected = true
  assert.equal(result, expected, "checkIfTokenRefreshNeeded refresh needed verified")
})
