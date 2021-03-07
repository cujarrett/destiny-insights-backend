const test = require("tape-async")
const { getLastSoldMessge } = require("../../src/util/get-last-sold-message.js")

test("Unit - getLastSoldMessge", async (assert) => {
  assert.plan(2)

  let result = getLastSoldMessge(["2020-08-17T17:00:07.000Z", "2020-08-16T17:00:10.000Z"])
  let expected = "2020-08-17"
  assert.equal(result, expected, "getLastSoldMessge for mod sold in the last year verified")

  result = getLastSoldMessge([])
  expected = "Not sold in the last year"
  assert.equal(result, expected, "getLastSoldMessge for mod not sold in the last year verified")
})
