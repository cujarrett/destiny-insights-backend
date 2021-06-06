const AWS = require("aws-sdk")
const { name } = require("../../package.json")

module.exports.getAuth = async () => {
  console.log("getAuth called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

  const params = {
    TableName: "destiny-insights-backend-bungie-api-auth",
    KeyConditionExpression: "app = :app",
    ExpressionAttributeValues: { ":app": { "S": name } }
  }

  const response = await ddb.query(params).promise()
  const authObject = response.Items[0]
  const result = {}
  for (const key of Object.keys(authObject)) {
    result[key] = authObject[key].S || authObject[key].N
  }

  return result
}

module.exports.setAuth = async (newAuth) => {
  console.log("setAuth called")
  AWS.config.update({ region: "us-east-1" })
  const docClient = new AWS.DynamoDB.DocumentClient()

  const params = {
    TableName: "destiny-insights-backend-bungie-api-auth",
    Key: { app: name },
    // eslint-disable-next-line max-len
    UpdateExpression: "set #ei = :expiresIn, #ltr = :lastTokenRefresh, #mi = :membershipId, #at = :accessToken, #tt = :tokenType, #rt = :refreshToken, #rei = :refreshExpiresIn",
    ExpressionAttributeValues: {
      ":expiresIn": newAuth.expiresIn,
      ":lastTokenRefresh": newAuth.lastTokenRefresh,
      ":membershipId": newAuth.membershipId,
      ":accessToken": newAuth.accessToken,
      ":tokenType": newAuth.tokenType,
      ":refreshToken": newAuth.refreshToken,
      ":refreshExpiresIn": newAuth.refreshExpiresIn
    },
    ExpressionAttributeNames: {
      "#ei": "expiresIn",
      "#ltr": "lastTokenRefresh",
      "#mi": "membershipId",
      "#at": "accessToken",
      "#tt": "tokenType",
      "#rt": "refreshToken",
      "#rei": "refreshExpiresIn"
    }
  }
  await docClient.update(params).promise()
}
