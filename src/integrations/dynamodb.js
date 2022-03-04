import { createRequire } from "module"
const require = createRequire(import.meta.url)

const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb")
import { getJson } from "../util/json.js"

export const getAuth = async () => {
  console.log("getAuth called")

  try {
    const { name } = await getJson("../../package.json")
    const client = new DynamoDBClient({ region: "us-east-1" })
    const params = {
      TableName: "destiny-insights-backend-bungie-api-auth",
      KeyConditionExpression: "app = :app",
      ExpressionAttributeValues: { ":app": { "S": name } }
    }
    const command = new QueryCommand(params)
    const response = await client.send(command)
    const authObject = response.Items[0]
    const result = {}
    for (const key of Object.keys(authObject)) {
      result[key] = authObject[key].S || authObject[key].N
    }

    return result
  } catch (error) {
    console.log(error)
  }
}

export const setAuth = async (newAuth) => {
  console.log("setAuth called")

  try {
    const ddbClient = new DynamoDBClient({ region: "us-east-1" })
    const marshallOptions = {
      convertEmptyValues: false,
      removeUndefinedValues: false,
      convertClassInstanceToMap: false
    }
    const unmarshallOptions = {
      wrapNumbers: false
    }

    const translateConfig = { marshallOptions, unmarshallOptions }

    const params = {
      TableName: "destiny-insights-backend-bungie-api-auth",
      Key: { app: "destiny-insights-backend" },
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
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig)
    await ddbDocClient.send(new UpdateCommand(params))
  } catch (error) {
    console.log(error)
  }
}

export const getModDataForLastYear = async () => {
  console.log("getModDataForLastYear called")

  try {
    const client = new DynamoDBClient({ region: "us-east-1" })
    const now = new Date().toISOString().split("T")[0]
    let oneYearAgo = new Date(now)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    oneYearAgo = oneYearAgo.toISOString().split("T")[0]

    const input = {
      TableName: "destiny-insights-items",
      // eslint-disable-next-line max-len
      FilterExpression: "#ts > :startDate AND (#type = :armorType OR #type = :combatSyleType OR #type = :weaponType)",
      ExpressionAttributeValues: {
        // AWS DynamoDB uses single char for types
        // eslint-disable-next-line id-length
        ":startDate": { S: oneYearAgo },
        // eslint-disable-next-line id-length
        ":armorType": { S: "Armor Mod" },
        // eslint-disable-next-line id-length
        ":weaponType": { S: "Weapon Mod" },
        // eslint-disable-next-line id-length
        ":combatSyleType": { S: "Combat Style Mod" }
      },
      ExpressionAttributeNames: {
        "#ts": "timestamp",
        "#type": "type"
      }
    }
    const command = new ScanCommand(input)
    const response = await client.send(command)
    const responses = []
    const results = []

    responses.push(...response.Items)

    for (const mod of responses) {
      results.push({
        timestamp: mod.timestamp.S,
        name: mod.name.S,
        type: mod.type.S
      })
    }

    const sortedResults = results.sort((first, second) => {
      return new Date(second.timestamp) - new Date(first.timestamp)
    })

    return sortedResults
  } catch (error) {
    console.log(error)
  }
}
