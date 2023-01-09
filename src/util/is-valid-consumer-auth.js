const { getKeys } = require("../integrations/dynamodb.js")

module.exports.isValidConsumerAuth = async (request) => {
  console.log("checkConsumerAuth called")
  try {
    const { key } = request.headers
    const validKeys = await getKeys()
    if (key) {
      const isValidKey = validKeys.includes(key)
      if (isValidKey) {
        console.log(`Key ${key} verfied valid`)
        return true
      } else {
        console.log(`Key ${key} verfied invalid`)
        return false
      }
    } else {
      console.log("Key missing")
      return false
    }
  } catch (error) {
    throw new Error(error)
  }
}
