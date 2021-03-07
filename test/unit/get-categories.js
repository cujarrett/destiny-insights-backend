const test = require("tape-async")
const getCategories = require("../../src/util/get-categories.js")

const normalTestData = [{ itemIndexes: [3] }, { itemIndexes: [1, 2] }]
const vendorQuestPresentTestData = [{ itemIndexes: [1, 2] }, { itemIndexes: [3] }]

test("Unit - getCategories", async (assert) => {
  assert.plan(4)

  const [normalFirst, normalSecond] = getCategories(normalTestData)
  let expected = 1
  // eslint-disable-next-line max-len
  assert.equal(normalFirst, expected, "getCategories for first category on normal inventory verified")
  expected = 2
  // eslint-disable-next-line max-len
  assert.equal(normalSecond, expected, "getCategories for second category on normal inventory verified")

  const [questFirst, questSecond] = getCategories(vendorQuestPresentTestData)
  expected = 1
  // eslint-disable-next-line max-len
  assert.equal(questFirst, expected, "getCategories for first category on quest inventory verified")
  expected = 2
  // eslint-disable-next-line max-len
  assert.equal(questSecond, expected, "getCategories for second category on quest inventory verified")
})
