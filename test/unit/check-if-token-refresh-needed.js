const test = require("ava")
const { checkIfTokenRefreshNeeded } = require("../../src/util/check-if-token-refresh-needed.js")

test("Unit - checkIfTokenRefreshNeeded no refresh needed", async (assert) => {
  const now = new Date()
  const result = checkIfTokenRefreshNeeded({ lastTokenRefresh: now, expiresIn: 3600 })
  assert.false(result)
})

test("Unit - checkIfTokenRefreshNeeded refresh needed", async (assert) => {
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  const result = checkIfTokenRefreshNeeded({ lastTokenRefresh: oneDayAgo, expiresIn: 3600 })
  assert.true(result)
})
