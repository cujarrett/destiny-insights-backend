const AWS = require("aws-sdk")
const { name } = require("../../package.json")

module.exports.getAuth = async () => {
  console.log("getAuth called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

  const params = {
    TableName: "banshee-44-mods-backend-bungie-api-auth",
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
    TableName: "banshee-44-mods-backend-bungie-api-auth",
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

module.exports.getLastUpdated = async () => {
  console.log("getLastUpdated called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

  const params = {
    TableName: "banshee-44-mods-backend-last-updated",
    KeyConditionExpression: "app = :app",
    ExpressionAttributeValues: { ":app": { "S": name } }
  }

  const response = await ddb.query(params).promise()
  const { lastUpdated } = response.Items[0]

  return lastUpdated.S
}

module.exports.setLastUpdated = async (lastUpdated) => {
  console.log("setLastUpdated called")
  AWS.config.update({ region: "us-east-1" })
  const docClient = new AWS.DynamoDB.DocumentClient()

  const params = {
    TableName: "banshee-44-mods-backend-last-updated",
    Key: { app: name },
    UpdateExpression: "set #lu = :lastUpdated",
    ExpressionAttributeValues: {
      ":lastUpdated": lastUpdated
    },
    ExpressionAttributeNames: {
      "#lu": "lastUpdated"
    }
  }
  await docClient.update(params).promise()
}

const getQuery = (modNumber, mod) => {
  let oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  // eslint-disable-next-line newline-per-chained-call
  oneYearAgo = oneYearAgo.toISOString().split("T")[0]

  return {
    TableName: "banshee-44-mods-backend-mods",
    FilterExpression: `#ts > :startDate and ${modNumber} = :value`,
    ExpressionAttributeValues: {
      // AWS DynamoDB uses single char for types
      // eslint-disable-next-line id-length
      ":startDate": { S: oneYearAgo },
      // eslint-disable-next-line id-length
      ":value": { S: mod }
    },
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    }
  }
}

module.exports.getModSalesInLastYear = async (mod) => {
  console.log("getModSalesInLastYear called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })
  const responses = []
  const results = []

  const query1 = getQuery("mod1", mod)
  let response = await ddb.scan(query1).promise()
  responses.push(...response.Items)
  const query2 = getQuery("mod2", mod)
  response = await ddb.scan(query2).promise()
  responses.push(...response.Items)

  for (const tweet of responses) {
    results.push(new Date(tweet.timestamp.S))
  }

  const sortedResults = results.sort((first, second) => {
    return new Date(second) - new Date(first)
  })

  return sortedResults
}

module.exports.getModDataForLastYear = async () => {
  console.log("getModDataForLastYear called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })
  const responses = []
  const results = []

  // eslint-disable-next-line newline-per-chained-call
  const now = new Date().toISOString().split("T")[0]
  let oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  oneYearAgo = oneYearAgo.toISOString().split("T")[0]

  const query = {
    TableName: "banshee-44-mods-backend-mods",
    FilterExpression: "#ts > :startDate",
    ExpressionAttributeValues: {
      // AWS DynamoDB uses single char for types
      // eslint-disable-next-line id-length
      ":startDate": { S: oneYearAgo }
    },
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    }
  }

  const response = await ddb.scan(query).promise()
  responses.push(...response.Items)

  for (const tweet of responses) {
    results.push({
      timestamp: tweet.timestamp.S,
      mods: [
        { name: tweet.mod1.S, type: "Weapon Mod" },
        { name: tweet.mod2.S, type: "Armor Mod" }
      ]
    })
  }

  const sortedResults = results.sort((first, second) => {
    return new Date(second.timestamp) - new Date(first.timestamp)
  })

  return sortedResults
}

module.exports.getLastSoldMods = async () => {
  console.log("getLastSoldMods called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })
  const responses = []
  const results = []

  // eslint-disable-next-line newline-per-chained-call
  const now = new Date().toISOString().split("T")[0]
  let oneDayAgo = new Date(now)
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  oneDayAgo = oneDayAgo.toISOString().split("T")[0]

  const query = {
    TableName: "banshee-44-mods-backend-mods",
    FilterExpression: "#ts > :startDate",
    ExpressionAttributeValues: {
      // AWS DynamoDB uses single char for types
      // eslint-disable-next-line id-length
      ":startDate": { S: oneDayAgo }
    },
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    }
  }

  const response = await ddb.scan(query).promise()
  responses.push(...response.Items)

  for (const tweet of responses) {
    results.push({
      timestamp: tweet.timestamp.S,
      mods: [
        { name: tweet.mod1.S, type: "Weapon Mod" },
        { name: tweet.mod2.S, type: "Armor Mod" }
      ]
    })
  }

  const sortedResults = results.sort((first, second) => {
    return new Date(second.timestamp) - new Date(first.timestamp)
  })

  return sortedResults
}

module.exports.addNewMods = async (mod1, mod2) => {
  console.log("addNewMods called")
  AWS.config.update({ region: "us-east-1" })
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

  const params = {
    TableName: "banshee-44-mods-backend-mods",
    Item: {
      // AWS DynamoDB uses single char for types
      // eslint-disable-next-line id-length
      timestamp: { S: new Date().toISOString() },
      // eslint-disable-next-line id-length
      mod1: { S: mod1.name },
      // eslint-disable-next-line id-length
      mod2: { S: mod2.name }
    }
  }

  await ddb.putItem(params).promise()
}
