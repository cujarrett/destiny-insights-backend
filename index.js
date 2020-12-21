const api = require("lambda-api")()
const fetch = require("node-fetch")
const { getParameters, setParameter } = require("./src/integrations/aws-parameter-store.js")
const knownMods = require("./known-mods.js")
const { version } = require("./package.json")

api.get("/init", async (request, response) => {
  console.log("init called")
  const { CLIENT_ID } = await getParameters()
  // eslint-disable-next-line max-len
  response.redirect(`https://www.bungie.net/en/oauth/authorize?client_id=${CLIENT_ID}&response_type=code`)
})

api.get("/authorize", async (request, response) => {
  try {
    console.log("authorize called")
    let config = await getParameters()
    const { API_KEY, CLIENT_ID, CLIENT_SECRET } = config
    const code = request.query.code
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
    const options = {
      "method": "post",
      "headers": {
        "Authorization": `Basic ${auth}`,
        "X-API-Key": API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "body": `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${code}`
    }
    const rawResponse = await fetch("https://www.bungie.net/Platform/App/OAuth/Token/", options)
    const newToken = await rawResponse.json()

    await setParameter("lastTokenRefresh", new Date().toString())
    await setParameter("access_token", newToken.access_token)
    await setParameter("token_type", newToken.token_type)
    await setParameter("expires_in", newToken.expires_in)
    await setParameter("refresh_expires_in", newToken.refresh_expires_in)
    await setParameter("membership_id", newToken.membership_id)
    await setParameter("refresh_token", newToken.refresh_token)

    config = await getParameters()
    // This endpoint will be whatever comes out of the Terraform apply + /vendors
    response.redirect("https://fk64o3bun8.execute-api.us-east-1.amazonaws.com/v1/vendors")
  } catch (error) {
    console.log(error)
  }
})

const checkIfTokenRefreshNeeded = (config) => {
  console.log("checkIfTokenRefreshNeeded called")
  const now = new Date()
  const lastTokenRefresh = new Date(config.lastTokenRefresh)
  const lastTokenRefreshDifference = (now.getTime() - lastTokenRefresh.getTime()) / 1000
  return lastTokenRefreshDifference > config.expires_in
}

const refreshToken = async (config) => {
  console.log("refreshToken called")
  // Bungie and tradition use underscores
  // eslint-disable-next-line camelcase
  const { API_KEY, CLIENT_ID, CLIENT_SECRET, refresh_token } = config
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
  const options = {
    "method": "post",
    "headers": {
      "Authorization": `Basic ${auth}`,
      "X-API-Key": API_KEY,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    // Bungie and tradition use underscores
    // eslint-disable-next-line camelcase
    "body": `client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${refresh_token}`
  }
  const rawResponse = await fetch("https://www.bungie.net/Platform/App/OAuth/Token/", options)
  const newToken = await rawResponse.json()
  await setParameter("lastTokenRefresh", new Date().toString())
  await setParameter("access_token", newToken.access_token)
  await setParameter("token_type", newToken.token_type)
  await setParameter("expires_in", newToken.expires_in)
  await setParameter("refresh_expires_in", newToken.refresh_expires_in)
  await setParameter("membership_id", newToken.membership_id)
  await setParameter("refresh_token", newToken.refresh_token)
}

// eslint-disable-next-line no-unused-vars
api.get("/vendors", async (request, response) => {
  console.log("/vendors called")
  let config = await getParameters()
  const isTokenRefreshNeeded = checkIfTokenRefreshNeeded(config)
  if (isTokenRefreshNeeded) {
    await refreshToken(config)
    config = await getParameters()
  }

  // Bungie and tradition use underscores
  // eslint-disable-next-line camelcase
  const { API_KEY, access_token } = config

  const options = {
    "method": "get",
    "headers": {
      // Bungie uses underscores
      // eslint-disable-next-line camelcase
      "Authorization": `Bearer ${access_token}`,
      "X-API-Key": API_KEY
    }
  }

  try {
    // eslint-disable-next-line max-len
    const gunsmithInventoryResponse = await fetch("https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/672118013/?components=300,301,302,304,305,400,401,402", options)

    if (gunsmithInventoryResponse.status !== 200) {
      console.log("Auth error", gunsmithInventoryResponse)
      throw new Error("Auth refresh needed")
    }
    const rawManifest = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", options)
    const manifestData = await rawManifest.json()
    // eslint-disable-next-line max-len
    const gunsmithItemDefinitionsPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
    const gunsmithItemDefinitionsEndpoint = `https://www.bungie.net${gunsmithItemDefinitionsPath}`

    const gunsmithInventory = await gunsmithInventoryResponse.json()
    const categories = gunsmithInventory.Response.categories.data.categories
    const salesData = gunsmithInventory.Response.sales.data
    const [firstCategory, secondCategory] = categories[categories.length - 1].itemIndexes
    const firstModHash = salesData[firstCategory].itemHash
    const secondModHash = salesData[secondCategory].itemHash
    let result = undefined

    const firstMod = knownMods[firstModHash]
    const secondMod = knownMods[secondModHash]

    if (firstMod && secondMod) {
      result = {
        "banshee-44": {
          mods: [
            { name: firstMod.name, itemHash: firstModHash, type: firstMod.type },
            { name: secondMod.name, itemHash: secondModHash, type: secondMod.type }
          ]
        }, "metadata": {
          version,
          now: new Date().toString(),
          lastTokenRefresh: config.lastTokenRefresh,
          cachedAuth: !isTokenRefreshNeeded,
          gunsmithItemDefinitionsEndpoint
        }
      }
    } else {
      result = "not found"
    }

    return JSON.stringify(result, null, "  ")
  } catch (error) {
    console.log(error)
    return error.message
  }
})

// eslint-disable-next-line no-unused-vars
api.get("/vendors-no-cache", async (request, response) => {
  console.log("/vendors-no-cache called")
  let config = await getParameters()
  const isTokenRefreshNeeded = checkIfTokenRefreshNeeded(config)
  if (isTokenRefreshNeeded) {
    await refreshToken(config)
    config = await getParameters()
  }

  // Bungie and tradition use underscores
  // eslint-disable-next-line camelcase
  const { API_KEY, access_token } = config

  const options = {
    "method": "get",
    "headers": {
      // Bungie uses underscores
      // eslint-disable-next-line camelcase
      "Authorization": `Bearer ${access_token}`,
      // Tradition use underscores for env vars
      // eslint-disable-next-line camelcase
      "X-API-Key": API_KEY
    }
  }

  try {
    // eslint-disable-next-line max-len
    const gunsmithInventoryResponse = await fetch("https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018467431261/Character/2305843009299499863/Vendors/672118013/?components=300,301,302,304,305,400,401,402", options)
    const gunsmithInventory = await gunsmithInventoryResponse.json()

    const rawManifest = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", options)
    const manifestData = await rawManifest.json()
    // eslint-disable-next-line max-len
    const gunsmithItemDefinitionsPath = manifestData.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
    const gunsmithItemDefinitionsEndpoint = `https://www.bungie.net${gunsmithItemDefinitionsPath}`
    const categories = gunsmithInventory.Response.categories.data.categories
    const salesData = gunsmithInventory.Response.sales.data
    const [firstCategory, secondCategory] = categories[categories.length - 1].itemIndexes
    const firstModHash = salesData[firstCategory].itemHash
    const secondModHash = salesData[secondCategory].itemHash

    await setParameter("lastTokenRefresh", new Date().toString())
    await setParameter("gunsmithItemDefinitionsEndpoint", gunsmithItemDefinitionsEndpoint)

    const itemDefinitionsResponse = await fetch(gunsmithItemDefinitionsEndpoint)
    const itemDefinitionsText = await itemDefinitionsResponse.text()
    const itemDefinitions = await JSON.parse(itemDefinitionsText)
    let result = undefined

    result = {
      "banshee-44": {
        mods: [
          // eslint-disable-next-line max-len
          { name: itemDefinitions[firstModHash].displayProperties.name, itemHash: firstModHash, type: itemDefinitions[firstModHash].itemTypeDisplayName },
          // eslint-disable-next-line max-len
          { name: itemDefinitions[secondModHash].displayProperties.name, itemHash: secondModHash, type: itemDefinitions[firstModHash].itemTypeDisplayName }
        ]
      }, "metadata": {
        version,
        now: new Date().toString(),
        lastTokenRefresh: config.lastTokenRefresh,
        cachedAuth: !isTokenRefreshNeeded,
        gunsmithItemDefinitionsEndpoint
      }
    }

    return JSON.stringify(result, null, "  ")
  } catch (error) {
    console.log(error)
    return error
  }
})

exports.handler = async (event, context) => {
  return await api.run(event, context)
}
